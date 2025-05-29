---
date : '2025-05-29T10:51:44+08:00'
draft : false
title : 'JavaHW12'

categories : 
  - Java
---

### Q1:

![](https://raw.githubusercontent.com/Ferdinandhu000/my_blog_img/master/20250529105404.png)

```java
package hujue20243143024_Q1;

import java.awt.Font;
import java.awt.Graphics;
import javax.swing.JComponent;
import javax.swing.JFrame;

public class GUI extends JFrame {
    public void showUI() {
        setTitle("GUI Designed by HJ!");
        setSize(800,600);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        add(new GUIComponent());
        setVisible(true);

    }

    public static void main(String[] args) {
        GUI ui = new GUI();
        ui.showUI();
    }
}

class GUIComponent extends JComponent {
    protected void paintComponent(Graphics g) {
        g.setFont(new Font(Font.SERIF, Font.PLAIN, 30));
        g.drawString("Hello my first GUI", 280, 300);
        g.setFont(new Font(Font.SERIF, Font.PLAIN, 20));
        g.drawString("Ferdinand Hu", 340, 330);
    }
}
```

### Q2:

![](https://raw.githubusercontent.com/Ferdinandhu000/my_blog_img/master/20250529105505.png)

GUI.java
```java
package hujue20243143024_Q2;

import javax.swing.JFrame;

public class GUI extends JFrame{
    public void showUI() {
        setTitle("Normal Distribution");
        setSize(1200,600);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        add(new MyCanvas());
        validate();
        setVisible(true);
    }
    
    public static void main(String[] args) {
        GUI ui = new GUI();
        ui.showUI();
    }
}
```

MyCanvas.java
```java
package hujue20243143024_Q2;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.Graphics2D;

import javax.swing.JPanel;

public class MyCanvas extends JPanel {
    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2 = (Graphics2D)g;
        g2.translate(600, 550);

        g2.drawLine(-600, 0, 600, 0);
        g2.drawLine(0, -550, 0, 50);
        g2.setFont(new Font(Font.SERIF,Font.PLAIN,20));
        g2.setColor(Color.BLUE);
        g2.drawString("x", 570, -10);
        g2.drawString("y", 10, -530);

        for(double x = -60.0 ; x <= 60.0 ; x += 0.01) {
            double y = -100*(Math.exp(x*x/-200)/Math.sqrt(2*Math.PI)*10);
            g2.drawLine((int)(8*x), (int)y, (int)(8*x), (int)y);
        }
    }
    
}
```

### Q3:

![](https://raw.githubusercontent.com/Ferdinandhu000/my_blog_img/master/20250529105738.png)

1. 
GUI.java
```java
package hujue20243143024_Q3.Q1;

import java.awt.Font;
import java.awt.Graphics;
import java.awt.GridLayout;

import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JFrame;
import javax.swing.JPanel;


public class GUI extends JFrame {
    public void showUI() {
        setTitle("GUI Designed by HJ!");
        setSize(800,600);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        add(new GUIComponent());
        
        setVisible(true);
        

    }

    public static void main(String[] args) {
        GUI ui = new GUI();
        ui.showUI();
    }
}

class GUIComponent extends JComponent {

    Listener ac;
    public GUIComponent() {
        ac = new Listener(this);
    }

    protected void paintComponent(Graphics g) {

        g.setColor(ac.color);
        g.setFont(new Font(Font.SERIF, Font.PLAIN, 30));
        g.drawString("Hello my first GUI", 280, 300);
        g.setFont(new Font(Font.SERIF, Font.PLAIN, 20));
        g.drawString("Ferdinand Hu", 340, 330);

        JButton btn1 = new JButton("Red");
        JButton btn2 = new JButton("Green");
        JButton btn3 = new JButton("Blue");
        JButton btn4 = new JButton("Yellow");

        btn1.addActionListener(ac);
        btn2.addActionListener(ac);
        btn3.addActionListener(ac);
        btn4.addActionListener(ac);

        JPanel p = new JPanel();
        p.setLayout(new GridLayout(2,2));
        p.setSize(150, 80);
        p.setLocation(0, 0);
        p.add(btn1);
        p.add(btn2);
        p.add(btn3);
        p.add(btn4);

        add(p);
        validate();
    }
}
```
Listener.java
```java
package hujue20243143024_Q3.Q1;
import java.awt.Color;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class Listener implements ActionListener{

    Color color = Color.BLACK;
    private GUIComponent component;
    public Listener(GUIComponent component) {
        this.component = component;
    }
    @Override
    public void actionPerformed(ActionEvent e) {
        String c = e.getActionCommand();
        
        if(c.equals("Red")) {
            color = Color.RED;
        } else if(c.equals("Green")) {
            color = Color.GREEN;
        } else if(c.equals("Blue")) {
            color = Color.BLUE;
        } else if(c.equals("Yellow")) {
            color = Color.YELLOW;
        }
        component.repaint();
    }
    public Color getColor() {
        return color;
    }
}
```

2. 
GUI.java
```java
package hujue20243143024_Q3.Q2;
import javax.swing.JFrame;

public class GUI extends JFrame{
    public void showUI() {
        setTitle("Normal Distribution");
        setSize(1200,600);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        add(new MyCanvas());
        validate();
        setVisible(true);
    }
    
    public static void main(String[] args) {
        GUI ui = new GUI();
        ui.showUI();
    }
}
```
Listener.java
```java
package hujue20243143024_Q3.Q2;

import java.awt.Color;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class Listener implements ActionListener{

    Color color = Color.BLACK;
    private MyCanvas component;
    public Listener(MyCanvas component) {
        this.component = component;
    }
    @Override
    public void actionPerformed(ActionEvent e) {
        String c = e.getActionCommand();
        
        if(c.equals("Red")) {
            color = Color.RED;
        } else if(c.equals("Green")) {
            color = Color.GREEN;
        } else if(c.equals("Blue")) {
            color = Color.BLUE;
        } else if(c.equals("Yellow")) {
            color = Color.YELLOW;
        }
        component.repaint();
    }
    public Color getColor() {
        return color;
    }
}
```
MyCanvas.java
```java
package hujue20243143024_Q3.Q2;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.GridLayout;

import javax.swing.JButton;
import javax.swing.JPanel;

public class MyCanvas extends JPanel {

    Listener ac;
    public MyCanvas() {
        ac = new Listener(this);
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2 = (Graphics2D)g;
        g2.translate(600, 550);

        g2.drawLine(-600, 0, 600, 0);
        g2.drawLine(0, -550, 0, 50);
        g2.setFont(new Font(Font.SERIF,Font.PLAIN,20));
        g2.setColor(ac.color);
        g2.drawString("x", 570, -10);
        g2.drawString("y", 10, -530);

        for(double x = -60.0 ; x <= 60.0 ; x += 0.01) {
            double y = -100*(Math.exp(x*x/-200)/Math.sqrt(2*Math.PI)*10);
            g2.drawLine((int)(8*x), (int)y, (int)(8*x), (int)y);
        }

        JButton btn1 = new JButton("Red");
        JButton btn2 = new JButton("Green");
        JButton btn3 = new JButton("Blue");
        JButton btn4 = new JButton("Yellow");

        btn1.addActionListener(ac);
        btn2.addActionListener(ac);
        btn3.addActionListener(ac);
        btn4.addActionListener(ac);

        JPanel p = new JPanel();
        p.setLayout(new GridLayout(2,2));
        p.setSize(150, 80);
        p.setLocation(-600, -550);
        p.add(btn1);
        p.add(btn2);
        p.add(btn3);
        p.add(btn4);

        add(p);
    }
    
}
```