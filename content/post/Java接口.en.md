---
date : '2025-05-17T14:16:07+08:00'
draft : false
title : 'Interface of Java'
categories : 
  - Java
---

## Interface of Java

### Concept:
- An interface is a special type of class where all variables are implicitly `public static final` and all methods are abstract (without method bodies).
- It serves as a contract that defines a set of methods that a class must implement, ensuring uniformity and standardization.
- Interfaces can be seen as a protocol that classes must adhere to, specifying the methods they must provide.

---

### Differences Between Interfaces and Classes
- **Keywords**: Uses `interface` instead of `class` (implementing an interface can be considered a special form of inheritance).
- **Variables**: All variables in an interface are implicitly `public static final`.
- **Methods**: All methods in an interface are implicitly `public abstract` and lack method bodies.
- **Inheritance**: A class can implement multiple interfaces but can only inherit from one superclass.
- **Interface Inheritance**: An interface can inherit from multiple interfaces.

---

### Implementing an Interface

- **Declaring an Interface**: Use the `interface` keyword to define an interface (e.g., USB).
```java
// Define the USB interface with two abstract methods: input and output
public interface USB {
    // Input method
    void input();
    // Output method
    void output();
}
```

- **Implementing an Interface**: Use the `implements` keyword in a class to implement an interface and provide implementations for all abstract methods.
```java
// Keyboard class implements the USB interface
class Keyboard implements USB {

    // Get string input from the keyboard
    public String getString() {
        return "String obtained from keyboard";
    }

    // Implement the input method from the USB interface
    // Used to receive power from USB
    @Override
    public void input() {
        System.out.println("Receiving power from USB");
    }

    // Implement the output method from the USB interface
    // Used to output the string obtained from the keyboard
    @Override
    public void output() {
        System.out.println("Sending string from keyboard: " + getString());
    }
}
```

---

### Key Notes
1. **Access Modifier**: Methods in an interface are implicitly `public` and cannot be declared with a more restrictive access modifier.
2. **Implementation Requirement**: A class implementing an interface must provide implementations for all abstract methods defined in the interface.
3. **Default and Static Methods**: Interfaces can include default methods (`default`) and static methods (`static`).
4. **No Constructors**: Interfaces cannot contain constructors.
5. **Variables**: Variables in an interface are implicitly `public static final` (constants).