---
date : '2025-05-17T14:16:37+08:00'
draft : false
title : 'Java Object-Oriented Programming'
categories : 
  - Java
  - OOP
---


# Java Object-Oriented Programming (OOP)

## Contents
- [Object-Oriented Programming](#object-oriented-programming)
  - [What is Object-Oriented Programming](#what-is-object-oriented-programming)
  - [Object-Oriented vs Procedural Programming](#object-oriented-vs-procedural-programming)
- [Classes and Objects](#classes-and-objects)
  - [Definition and Usage](#definition-and-usage)
  - [Constructors](#constructors)
  - [Simplest Form of Class Definition in Java](#simplest-form-of-class-definition-in-java)
- [Keywords: public, private, static, final](#keywords-public-private-static-final)
  - [public and private](#public-and-private)
  - [static](#static)
  - [final](#final)
- [Three Pillars of Object-Oriented Programming](#three-pillars-of-object-oriented-programming)
  - [1. Encapsulation](#1-encapsulation)
  - [2. Inheritance](#2-inheritance)
  - [3. Polymorphism](#3-polymorphism)

---

## Object-Oriented Programming

### What is Object-Oriented Programming
In simple terms, object-oriented programming is the process of encapsulating **attributes** and **methods** into individual objects.

### Object-Oriented vs Procedural Programming
| Feature                | Object-Oriented (OOP) | Procedural (POP)      |
|------------------------|-----------------------|-----------------------|
| Focus                  | Data encapsulation    | Function implementation |
| Use Case               | Complex system development | Small program development |
| Maintainability        | High                  | Low                   |
| Code Reusability       | Strong                | Weak                  |

![OOP vs POP Comparison Diagram](https://raw.githubusercontent.com/Ferdinandhu000/my_blog_img/master/OOP%20vs%20POP.png)

---

## Classes and Objects

### Definition and Usage
- **Class**: A blueprint for objects  
  Includes: attributes and methods  
- **Object**: An instance of a class
- **Example**:
  - Class: Person  
  - Objects: Student, Teacher

### Constructors
**Syntax**: `public ClassName (parameters) {}`
```java
class Employee {
    // Attributes
    private static String name;
    private double salary;
    private LocalDate hireDay;

    // Default no-argument constructor
    public Employee() {
    }
}
```

Using the `this` keyword to access current object's attributes and methods
```java
class Employee {
    private String name;
    private double salary;
    private LocalDate hireDay;

    // Default constructor
    public Employee() {
    }

    // Parameterized constructor
    public Employee(String name, double salary, int year, int month, int day) {
        this.name = name;
        this.salary = salary;
        this.hireDay = LocalDate.of(year, month, day);
    }
}
```

> **Note**: A class can have multiple constructors (overloading)

### Simplest Form of Class Definition in Java
```java
class ClassName { 
    attribute1;
    attribute2;
    ... 
    constructor1();
    constructor2(); 
    ... 
    method1();
    method2(); 
    ... 
} 
```

---

## Keywords: public, private, static, final

### public and private
- Both are access modifiers used to restrict or allow access to class members. They can modify **classes**, **attributes**, and **methods**.
    - **public**: Members are accessible throughout the project.
    - **private**: Members are completely private and cannot be accessed from outside the class.

### static
- Indicates a static member. Can modify **classes**, **methods**, and **code blocks**.
- **Characteristics**:
    - When modifying an attribute, the attribute is stored only once in memory. Can be accessed via `ClassName.attributeName` without creating an instance.  
      Example: `Math.PI`
    - When modifying a method, the method can be called via `ClassName.methodName`.  
      Example: `Math.sin()`  
      However, non-static members cannot be directly accessed within static methods.
    ```java
    class Test {
        String name;
        public static int id;
        public static void showInfo1() {
            System.out.println("id:" + id); // id is static, no error

            System.out.println("name:" + name);  // name is not static, this line will cause an error!
        }
    }
    ```
    - When modifying a code block, the static block executes once when the class is loaded.
    ```java
    static {
        System.out.println("Static code block"); // Executes once when the class is first loaded
    }

    {
        System.out.println("Instance code block"); // Executes every time an instance is created
    }
    ```

### final
- Indicates that the modified member cannot be changed.
- **Characteristics**:
    - When modifying a variable, it must be initialized and cannot be reassigned.
    - When modifying a method, the method cannot be overridden by subclasses.
    - When modifying a class, the class cannot be inherited.

---

## Three Pillars of Object-Oriented Programming

### 1. Encapsulation
| Access Scope           | private | default | protected | public |
|------------------------|:-------:|:-------:|:---------:|:------:|
| Same class in same package |   √     |   √     |    √      |   √    |
| Different class in same package |       |   √     |    √      |   √    |
| Subclass in different package |         |         |    √      |   √    |
| Non-subclass in different package |         |         |           |   √    |

### 2. Inheritance
- **Meaning**: Creating a new class (subclass) based on an existing class (superclass) to reuse code and add new attributes and methods.
- **Implementation**:
    - Use the `extends` keyword when defining a class.  
      Syntax: `public class SubclassName extends SuperclassName {}`  
      Use the `super` keyword to access superclass members.
    ```java
    // Superclass Employee
    public class Employee {
        private String name = "Hanmei";
        private double salary;

        public Employee(String name, double salary) {} // Constructor

        public String getName() {}
        public double raiseSalary(double byPercent) {}
        public double getSalary() {}
    }
    ```
    ```java
    // Subclass Manager
    public class Manager extends Employee {
        // New attribute added to the subclass
        private double bonus;

        public Manager(String name, double salary) {
            super(name, salary); // Call superclass constructor
        }

        public void setBonus(double bonus) {
            this.bonus = bonus;
        }
        // Override the getSalary() method
        public double getSalary() {
            return super.getSalary() + bonus; // Call superclass method
        }
    }
    ```
- **Characteristics of Inheritance**:
    - Multiple levels of inheritance are allowed: `Person <-- Employee <-- Manager`
    - Multiple branches of inheritance are possible

### 3. Polymorphism
- **Meaning**: In an inheritance hierarchy, when a subclass overrides a method of the superclass, calling the method on a subclass object will execute the subclass's implementation.
- **Implementation**:
    Referring to the inheritance example above, when executing the following code:
    ```java
    Employee Alice = new Manager("Alice",10000); // Declared type is Employee, actual type is Manager
    Alice.setBonus(5000);

    Alice.getSalary();
    ```
    The program will output 15000 instead of 10000, because the overridden method in Manager is called, even though Alice is declared as an Employee.

- **Special Note**:
    For the following code:
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
        SuperClass polyC = new SubClass(); // Declared type is SuperClass, actual type is SubClass

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
    The output will be:
    ```
    SuperClass.method1
    SuperClass.method2
    method3() undefined
    SuperClass.method1
    SubClass.method2
    SubClass.method3
    SuperClass.method1
    SubClass.method2
    method3() undefined // Although the actual type is SubClass, the compiler only checks the declared type which is SuperClass
    ```

- **Advantages of Polymorphism**:
    1. Reduces code complexity by avoiding excessive if-else statements, improving code readability.
    2. Enhances code extensibility and reduces modification costs.