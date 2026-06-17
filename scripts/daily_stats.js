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

async function main() {
    console.log('Starting daily blog statistics collection...');

    // 1. Load history stats
    let history = { site: { pv: 0, uv: 0 }, articles: {} };
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

    // 3. Scan posts from the public/p directory
    if (!fs.existsSync(POSTS_DIR)) {
        console.error('Error: public/p/ directory does not exist. Run "hugo" to build the site first.');
        process.exit(1);
    }

    const dirs = fs.readdirSync(POSTS_DIR).filter(file => {
        return fs.statSync(path.join(POSTS_DIR, file)).isDirectory();
    });

    console.log(`Found ${dirs.length} published posts. Fetching individual views...`);

    const articleStats = [];
    const newArticlesHistory = {};

    for (let i = 0; i < dirs.length; i++) {
        const dir = dirs[i];
        const pageUrl = `${SITE_URL}/p/${encodeURIComponent(dir)}/`;
        const indexPath = path.join(POSTS_DIR, dir, 'index.html');

        // Extract title from index.html
        let title = dir;
        if (fs.existsSync(indexPath)) {
            const html = fs.readFileSync(indexPath, 'utf-8');
            const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
            if (titleMatch) {
                const rawTitle = titleMatch[1].trim();
                title = rawTitle.split('|')[0].trim(); // Extract before site title separator
            }
        }

        // Fetch page PV
        console.log(`[${i + 1}/${dirs.length}] Fetching: ${title}`);
        const pageData = await fetchBusuanzi(pageUrl);
        const currentPv = (pageData && pageData.page_pv) || 0;
        
        const oldPv = history.articles?.[dir] || 0;
        const deltaPv = currentPv - oldPv;

        articleStats.push({
            dir,
            title,
            currentPv,
            deltaPv
        });

        newArticlesHistory[dir] = currentPv;

        // Rate limit: 200ms delay between requests to avoid overloading Busuanzi
        await delay(200);
    }

    // Sort active articles by 24h page views change desc
    const activeArticles = articleStats
        .filter(art => art.deltaPv > 0)
        .sort((a, b) => b.deltaPv - a.deltaPv);

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

    message += `🔥 *今日热门文章 (24h PV 新增)*:\n`;
    if (activeArticles.length === 0) {
        message += `• _暂无新增浏览量的文章，继续加油！_\n`;
    } else {
        activeArticles.slice(0, 10).forEach((art, idx) => {
            message += `${idx + 1}. *${art.title}*\n`;
            message += `   └─ 浏览量: \`${art.currentPv}\` (较昨日 \`+${art.deltaPv}\`)\n`;
        });
        if (activeArticles.length > 10) {
            message += `• _...以及另外 ${activeArticles.length - 10} 篇有浏览增加的文章_`;
        }
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
        },
        articles: newArticlesHistory
    };

    fs.writeFileSync(HISTORY_FILE, JSON.stringify(newHistory, null, 2), 'utf-8');
    console.log('Updated stats_history.json saved.');
}

main().catch(err => {
    console.error('Unhandled script error:', err);
    process.exit(1);
});
