---
date : '2025-05-19T21:05:05+08:00'
draft : false
title : 'Interface'
categories : 
  - Java
  - Notes

---
## 两个重要接口

- Comparable Interface
- Comparator Interface

## Comparable Interface

对于Arrays.sort()函数，需要待排序的数组有排序标准  
对于下面Java代码

```java
Person[] persons = new Person[3];
persons[0] = new Person("Han Mei");
persons[1] = new Person("Li Lei");
persons[2] = new Person("Tom");
Arrays.sort(persons);
for (Person p : persons)
    System.out.println(p);

```

会有

```java
Person cannot be cast to java.lang.Comparable
```

报错信息，因此需要传入排序标准

- Comparable接口原理：

  ```java
  public interface Comparable {
      int compareTo(Object  other);
  }
  ```

  通过返回int类型的值来判断this与other的大小关系  
  int < 0, if this < other  
  int = 0, if this = other  
  int > 0, if this > other

- 具体实现

  ```java
  class Person implements Comparable{
     private String name;
     public Person(String name) {
         this.name = name;
     }
     public String toString() {
         return "A person " + name; 
     }
     // 对接口中的抽象函数进行复写
     public int compareTo(Object o) {
         Person p = (Person)o;
         return name.compareTo(p.name);
     }
  }

  public static void main(String[] args) {
      Person[] persons = new Person[3];
      persons[0] = new Person("Han Mei");
      persons[1] = new Person("Li Lei");
      persons[2] = new Person("Tom");

      // 使用sort函数进行排序
      Arrays.sort(persons);

      for (Person p : persons)
          System.out.println(p);
  }
  ```

对于从父类继承来的子类对象，也可以继承其接口功能  
如果需要改变排序标准，可以重写其抽象方法

## Comparator Interface

- Comparator接口原理

  ```java
  public interface Comparator<T>
  {
       int compare(T first, T second);
  }
  ```

- 具体实现

  ```java
  // 创建一个临时的类，其中补全Comparator的抽象方法
  class CompareStuMajorAsc implements Comparator<Student> {
      public int compare(Student p1, Student p2) {
          return p1.getName().compareTo(p2.getName());
      }
  }
  ```

  ```java
  Student[] stus = new Student[3];
  stus[0] = new Student("Han Mei", "E-Commerce");
  stus[1] = new Student("Li Lei", "Bioinfomatics");
  stus[2] = new Student("Tom", "Computer Science");
  // Student类继承Person的接口，默认按照name排序
  Arrays.sort(stus);
  for (Student p : stus)
    System.out.println(p);

  // new CompareStuNameAsc() 传入新排序标准，按major名称排序
  Arrays.sort(stus, new CompareStuMajorAsc());
  for (Student p : stus)
    System.out.println(p);
  ```

  若需要改成降序排列，只需要改动临时类中return的代码

  ```java
  class CompareStuNameDes implements Comparator<Student> {
      public int compare(Student p1, Student p2) {
      return p2.getName().compareTo(p1.getName()); // 将p2移前
      }
  }
  ```

  - 代码简化 v1
    使用**内部类**，即将原先的单独的临时类放到主函数中

    ```java
    // 简化前
    class CompareIntDes implements Comparator<Integer> {
        public int compare(Integer i, Integer j) {
            return j - i;
        } 
    }
    Integer[] intArr = new Integer[] {3, 1, 2};
    Arrays.sort(intArr, new CompareIntDes());
    for (int i : intArr)
        System.out.println(i);
    
    ```

    ```java
    // 简化后
    Integer[] intArr = new Integer[] {3, 1, 2};
    Arrays.sort(intArr, new Comparator<Integer>() { // 将临时类放在sort函数中
        public int compare(Integer i, Integer j) {
            return j - i;
        }
    });
    for (int i : intArr)
        System.out.println(i);
    ```

  - 代码简化 v2
    使用Lambda表达式简化代码量
    
    ```java
    // 简化前
    // 使用内部类
    Arrays.sort(stus, new Comparator<Student>() {
        public int compare(Student s1, Student s2) {
            return s2.getMajor().compareTo(s1.getMajor());
        }
    });
    ```

    ```java
    // 简化后
    Arrays.sort(stus, (s1,s2) -> s2.getMajor().compareTo(s1.getMajor()));
    ```

    可用一行函数完成  

    **注意：** 使用Lambda表达式可以看作没有使用任何一个接口，其中的`.compareTo()`方法是String类中自带的方法