---
date : '2025-05-17T14:15:40+08:00'
draft : false
title : 'Java接口'
categories : 
  - Java
---
## 接口 Interface

### 概念：
- 接口是特殊的类，具体表现在接口中所有变量的属性都是 public static final 的，并且无方法体
- 用于制定统一标准，后续其他类实现这个接口后需要补全接口中的抽象方法
- 接口可以看作是一种约定，规定了实现类必须提供的方法

---

### 接口与class的区别
- 关键字不同（可看作调用接口是一种特殊的继承）
- 接口中定义的所有属性都是默认由 public static final 修饰的
- 接口中定义的所有方法默认都是由 public abstract 修饰的，并且没有方法体
- 一个类可以实现多个接口，但只能继承一个类
- 接口可以继承多个接口

---

### 接口的具体实现

- 在接口类中，用 interface 关键字声明一个接口（例如USB）
```java
// 定义USB接口，包含输入和输出两个抽象方法
public interface USB {
    // 定义输入方法
    void input();
    // 定义输出方法
    void output();
}
```

- 在普通类中（例如Keyboard），用 implement 关键字来实现接口，并重写接口中的所有抽象方法
```java
// 键盘类，实现了USB接口
class Keyboard implements USB {

    // 获取键盘输入的字符串
    public String getString() {
        return "从键盘获取的字符串";
    }

    // 实现USB接口的input方法
    // 用于接收USB供电
    @Override
    public void input() {
        System.out.println("接收USB供电");
    }

    // 实现USB接口的output方法
    // 用于输出键盘获取的字符串
    @Override
    public void output() {
        System.out.println("传入从键盘获取的字符串：" + getString());
    }
}
```
---

### 注意事项
1. 接口中的方法必须是public的
2. 实现类必须实现接口中的所有抽象方法
3. 接口可以包含默认方法（default）和静态方法（static）
4. 接口不能包含构造方法
5. 接口中的变量默认是public static final的