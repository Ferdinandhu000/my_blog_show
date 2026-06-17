const fs = require('fs');
const path = require('path');
const https = require('https');

// Config
const SITE_URL = 'https://ferdinandhu.netlify.app';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_USER_ID = process.env.TELEGRAM_USER_ID;

const HISTORY_FILE = path.join(__dirname, '../stats_history.json');
const POSTS_DIR = path.join(__dirname, '../public/p');

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_USER_ID) {
    console.error('Error: TELEGRAM_BOT_TOKEN and TELEGRAM_USER_ID environment variables must be set.');
    process.exit(1);
}

// Helper: Fetch statistics from Busuanzi using a specific Referer header (single attempt)
function _fetchBusuanziOnce(referer) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'busuanzi.ibruce.info',
            path: '/busuanzi?jsonpCallback=BusuanziCallback_' + Math.floor(Math.random() * 1000000000),
            headers: {
                'Referer': referer,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 5000
        };

        const req = https.get(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    resolve({ error: `HTTP status ${res.statusCode}` });
                    return;
                }
                try {
                    const jsonMatch = data.match(/\(([^)]+)\)/);
                    if (jsonMatch) {
                        resolve(JSON.parse(jsonMatch[1]));
                    } else {
                        resolve({ error: `JSON match failed (no parentheses found): ${data}` });
                    }
                } catch (e) {
                    resolve({ error: `JSON parse exception: ${e.message}` });
                }
            });
        });

        req.on('error', (err) => {
            resolve({ error: `Network error: ${err.message}` });
        });
        req.on('timeout', () => {
            req.destroy();
            resolve({ error: 'Timeout' });
        });
    });
}

// Helper: Fetch statistics from Busuanzi with retries
async function fetchBusuanzi(referer) {
    const retries = 4;
    for (let attempt = 1; attempt <= retries; attempt++) {
        const res = await _fetchBusuanziOnce(referer);
        if (res && !res.error) {
            return res;
        }
        console.warn(`[Attempt ${attempt}/${retries}] Failed to fetch Busuanzi for ${referer}. Error: ${res ? res.error : 'Unknown'}`);
        if (attempt < retries) {
            await delay(1500); // Wait 1.5s before retrying
        }
    }
    return null;
}

// Helper: Send message to Telegram Bot
function sendTelegram(message) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify({
            chat_id: TELEGRAM_USER_ID,
            text: message,
            parse_mode: 'Markdown'
        });

        const options = {
            hostname: 'api.telegram.org',
            path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            },
            timeout: 10000
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(true);
                } else {
                    reject(new Error(`Telegram API status ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', (err) => reject(err));
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Telegram API timeout'));
        });

        req.write(payload);
        req.end();
    });
}

// Helper: Delay function for rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Fetch discussions and comments from GitHub GraphQL API
function fetchGithubDiscussions() {
    return new Promise((resolve) => {
        const token = process.env.GITHUB_TOKEN;
        if (!token) {
            console.log('No GITHUB_TOKEN provided, skipping Giscus comments check.');
            resolve([]);
            return;
        }

        const query = `
        query {
          repository(owner: "Ferdinandhu000", name: "my_blog_source") {
            discussions(first: 20, orderBy: {field: UPDATED_AT, direction: DESC}) {
              nodes {
                title
                url
                category {
                  name
                }
                comments(last: 10) {
                  nodes {
                    author {
                      login
                    }
                    bodyText
                    createdAt
                    url
                  }
                }
              }
            }
          }
        }`;

        const payload = JSON.stringify({ query });

        const options = {
            hostname: 'api.github.com',
            path: '/graphql',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'User-Agent': 'NodeJS-HTTP-Client',
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            },
            timeout: 10000
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    console.error(`GitHub API returned status ${res.statusCode}: ${data}`);
                    resolve([]);
                    return;
                }
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.errors) {
                        console.error('GitHub GraphQL Errors:', parsed.errors);
                        resolve([]);
                    } else {
                        resolve(parsed.data.repository.discussions.nodes || []);
                    }
                } catch (e) {
                    console.error('Failed to parse GitHub response:', e);
                    resolve([]);
                }
            });
        });

        req.on('error', (err) => {
            console.error('GitHub API network error:', err);
            resolve([]);
        });
        req.on('timeout', () => {
            req.destroy();
            console.error('GitHub API timeout');
            resolve([]);
        });

        req.write(payload);
        req.end();
    });
}

async function main() {
    console.log('Starting daily blog statistics collection (site-only)...');

    // 1. Load history stats
    let history = { site: { pv: 0, uv: 0 } };
    if (fs.existsSync(HISTORY_FILE)) {
        try {
            history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'));
            console.log('Successfully loaded historical data.');
        } catch (e) {
            console.warn('Warning: Could not parse history file, starting fresh.');
        }
    }

    // 2. Fetch global site views
    console.log('Fetching site-wide views...');
    const siteData = await fetchBusuanzi(SITE_URL + '/');
    if (!siteData) {
        console.error('Error: Failed to fetch global site views from Busuanzi.');
        process.exit(1);
    }
    const currentSitePv = siteData.site_pv || 0;
    const currentSiteUv = siteData.site_uv || 0;

    const deltaSitePv = history.site?.pv ? (currentSitePv - history.site.pv) : 0;
    const deltaSiteUv = history.site?.uv ? (currentSiteUv - history.site.uv) : 0;

    // 3. Fetch Giscus comments
    console.log('Fetching Giscus comments from GitHub...');
    const discussions = await fetchGithubDiscussions();
    const now = new Date();
    const recentComments = [];

    discussions.forEach(disc => {
        if (disc.category && disc.category.name !== 'Announcements') {
            return;
        }

        if (disc.comments && disc.comments.nodes) {
            disc.comments.nodes.forEach(comment => {
                const commentDate = new Date(comment.createdAt);
                // 24 hours = 24 * 60 * 60 * 1000 = 86400000 ms
                if (now - commentDate < 24 * 60 * 60 * 1000) {
                    recentComments.push({
                        articleTitle: disc.title,
                        articleUrl: disc.url,
                        author: comment.author ? comment.author.login : 'anonymous',
                        body: comment.bodyText,
                        url: comment.url,
                        createdAt: commentDate
                    });
                }
            });
        }
    });

    // 4. Construct Telegram Message
    const todayStr = new Date().toLocaleDateString('zh-CN', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });

    let message = `📊 *FerdinandHu 博客每日数据报表*\n`;
    message += `📅 统计时间: ${todayStr} (北京时间)\n\n`;

    message += `📈 *全站整体数据*:\n`;
    message += `• *总访问量 (PV)*: \`${currentSitePv}\` (较昨日 \`+${deltaSitePv}\`)\n`;
    message += `• *总访客数 (UV)*: \`${currentSiteUv}\` (较昨日 \`+${deltaSiteUv}\`)\n\n`;

    message += `💬 *最新留言评论 (24h 新增)*:\n`;
    if (recentComments.length === 0) {
        message += `• _过去 24 小时内暂无新评论。_\n`;
    } else {
        recentComments.forEach((c, idx) => {
            const snippet = c.body.length > 60 ? (c.body.substring(0, 57) + '...') : c.body;
            message += `${idx + 1}. *${c.author}* 在《${c.articleTitle}》中说:\n`;
            message += `   └─ "${snippet}"\n`;
            message += `   └─ [查看留言](${c.url})\n`;
        });
    }

    console.log('\n--- Telegram Message ---');
    console.log(message);
    console.log('------------------------');

    // 5. Send message via Telegram Bot
    console.log('Sending report to Telegram...');
    try {
        await sendTelegram(message);
        console.log('Telegram report sent successfully!');
    } catch (err) {
        console.error('Failed to send Telegram message:', err.message);
    }

    // 6. Write updated history to file
    const newHistory = {
        last_updated: new Date().toISOString(),
        site: {
            pv: currentSitePv,
            uv: currentSiteUv
        }
    };

    fs.writeFileSync(HISTORY_FILE, JSON.stringify(newHistory, null, 2), 'utf-8');
    console.log('Updated stats_history.json saved.');
}

main().catch(err => {
    console.error('Unhandled script error:', err);
    process.exit(1);
});
