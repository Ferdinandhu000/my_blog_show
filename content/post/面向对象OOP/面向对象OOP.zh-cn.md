---
date : '2025-05-17T14:16:29+08:00'
draft : false
title : 'Java面向对象编程'
categories : 
  - Java
  - 面向对象
---
# Java 面向对象编程 (OOP)

## 目录
- [面向对象](#面向对象)
  - [什么是面向对象](#什么是面向对象)
  - [面向对象 vs 面向过程](#面向对象-vs-面向过程)
- [类和对象](#类和对象)
  - [定义和使用](#定义和使用)
  - [构造函数](#构造函数)
  - [Java中类定义的最简形式](#java中类定义的最简形式)
- [public private static final 关键字](#public-private-static-final-关键字)
  - [public 和 private](#public-和-private)
  - [static](#static)
  - [final](#final)
- [面向对象三大特性](#面向对象三大特性)
  - [1. 封装](#1-封装)
  - [2. 继承](#2-继承)
  - [3. 多态](#3-多态)

---

## 面向对象

### 什么是面向对象
通俗来讲，面向对象就是让每一个对象有自己的**属性**和**方法**，并且进行封装的过程

### 面向对象 vs 面向过程
| 特性 | 面向对象 (OOP) | 面向过程 (POP) |
|------|---------------|---------------|
| 重点 | 数据封装 | 功能实现 |
| 适用场景 | 复杂系统开发 | 小型程序开发 |
| 维护性 | 高 | 较低 |
| 代码复用 | 强 | 弱 |

![OOP vs POP对比图](https://raw.githubusercontent.com/Ferdinandhu000/my_blog_img/master/OOP%20vs%20POP.png)

---

## 类和对象

### 定义和使用
- **类**：对象的模板  
  包括：属性和方法  
- **对象**：类的实例
- **举例**：
  - 类：人  
  - 对象：学生，老师

### 构造函数
**格式**：`public 类名 (传入的属性) {}`
```java
class Employee {
    // 属性
    private static String name;
    private double salary;
    private LocalDate hireDay;

    // 默认的无参构造函数
    public Employee() {
    }
}
```

使用 `this` 关键字可以访问当前对象和方法的属性
```java
class Employee {
    private String name;
    private double salary;
    private LocalDate hireDay;

    // 默认构造函数
    public Employee() {
    }

    // 带参数的构造函数
    public Employee(String name, double salary, int year, int month, int day) {
        this.name = name;
        this.salary = salary;
        this.hireDay = LocalDate.of(year, month, day);
    }
}
```

> **注意**：一个类中可以包括多个构造函数（重载）

### Java中类定义的最简形式
```java
class ClassName { 
    属性1
    属性2
    ... 
    构造函数1
    构造函数2 
    ... 
    方法1
    方法2 
    ... 
} 
```

---
## public private static final 关键字

### public 和 private
- 两个都是访问权限修饰符，用于限制或允许外界对类内部成员的访问，可以修饰 **类** **属性** **方法**
    - **public**：表示对象成员公开，整个项目中都可以使用
    - **private**：表示对象成员完全私有，不允许外界的任何访问

### static
- 表示静态的，可以修饰 **类** **方法** **代码块**
- **特点**：
    - 修饰属性时，属性会在内存中并且只会存储唯一的一份。因此可以通过 `类名.属性名` 直接访问，不需要单独创建一个对象再访问  
      例如：`Math.PI`
    - 修饰方法时，也可以通过`类名.方法名`直接调用  
      例如：`Math.sin()`
      但是，静态方法中不能直接使用本类中的其他非static成员
    ```java
    class Test {
        String name;
        public static int id;
        public static void showInfo1() {
            System.out.println("id:" + id); // id是static，不会报错

            System.out.println("name:" + name);  // name不是staitc，这行代码会报错！
        }
    }
    ```
    - 修饰代码块时，只有类加载时静态方法快会执行且只执行一次
    ```java
    static {
        System.out.println("静态代码块"); // 只在最开始执行一次，之后不会执行
    }

    {
        System.out.println("普通代码块"); // 只要类被加载，就会执行这段代码
    }
    ```

### final
- 表示修饰的成员不可改变
- **特点**：
    - 修饰变量时，必须进行初始化复制，之后在任何位置使用时都不能修改值
    - 修饰方法时，这个方法不能被子类重写
    - 修饰类时，这个类不能被继承

---

## 面向对象三大特性

### 1. 封装
| 访问范围             | private | default | protected | public |
|----------------------|:-------:|:-------:|:---------:|:------:|
| 同一个包中的同一类   |   √     |   √     |    √      |   √    |
| 同一个包的不同类     |         |   √     |    √      |   √    |
| 不同包中的子类       |         |         |    √      |   √    |
| 不同包的非子类       |         |         |           |   √    |

### 2. 继承
- **含义**：在已有类（父类）的基础上，创建一个新的类（子类）添加一些新的属性和方法，实现对重复代码的复用，减少代码量
- **具体实现**：
    - 创建类时，使用 `extends` 关键字继承父类  
      格式： `public class 子类名 extends 父类名 {}`
      需要访问父类中的成员变量或者方法时，使用 `super` 关键字
    ```java
    // 父类 Employee
    public class Employee {
        private String name = "Hanmei";
        private double salary;

        public Employee(String name, double salary) {} // 构造函数

        public String getName() {}
        public double raiseSalary(double byPercent) {}
        public double getSalary() {}
    }
    ```
    ```java
    // 子类 Manager
    public class Manager extends Employee {
        // 在父类基础上添加新属性 bonus
        private double bonus;

        public Manager(String name, double salary) {
            super(name, salary); // 使用super获取父类中的属性
        }

        public void setBonus(double bonus) {
            this.bonus = bonus;
        }
        // 重写父类getsalary()函数
        public double getSalary() {
            return super.getSalary() + bonus; //使用super获取父类中的方法
        }
    }
    ```
- **继承特点**：
    - 继承可以有多层继承：`Person <-- Employee <-- Manager`
    - 继承可以有多分枝

### 3. 多态
- **含义**：在继承体系下，当子类对父类中的方法进行重写后，创建子类对象并调用方法，程序执行的是对应类中的方法
- **具体实现**：
    参照上面继承的代码，当执行下面的代码后
    ```java
    Employee Alice = new Manager("Alice",10000); // 声明类型是Employee，实际类型是Manager
    Alice.setBonous(5000);

    Alice.getSalary();
    ```
    程序会输出15000而不是10000，因为程序调用的是Manager中重写的方法，尽管Alice声明的对象类型是Employee

- **特别注意**：
    对于下面这段代码
    ```java
    class SuperClass {
        void method1() {System.out.println("SuperClass.method1");}
        void method2() {System.out.println("SuperClass.method2");}
    }

    class SubClass extends SuperClass {
        void method2() {System.out.println("SubClass.method2");}
        void method3() {System.out.println("SubClass.method3");}
    }

    public static void main(String[] args) {
        SuperClass superC = new SuperClass();
        SubClass subC = new SubClass();
        SuperClass polyC = new SubClass(); //声明类型是superClass，实际类型是SubClass

        superC.method1();
        superC.method2();
        superC.method3();
        subC.method1();
        subC.method2();
        subC.method3();
        polyC.method1();
        polyC.method2();
        polyC.method3();
    }
    ```
    会有以下输出信息：
    ```
    SuperClass.method1
    SuperClass.method2
    method3() undefined
    SuperClass.method1
    SubClass.method2
    SubClass.method3
    SuperClass.method1
    SubClass.method2
    method3() undefined // 尽管实际类型是SubClass，但是编译器只看声明类型，在SuperClass中无method3方法
    ```

- **多态的优点**：
    1. 可以降低代码的圈复杂度避免使用大量的if-else，提高代码的可读性
    2. 增强了代码的可扩展性，降低代码的修改成本