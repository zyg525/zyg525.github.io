---
title: hashCode()与equals()
tags: Java基础
layout: post
---

* ### hashCode()方法

　　`hashCode()`方法是Object类中定义的一个native方法，它的返回值是int类型：

```java
public native int hashCode();
```

　　**`hashCode()`方法的作用是计算该对象在哈希表中的索引位置**。在JDK中用到哈希表的类有HashMap、HashSet等等，当对象作为key存入哈希表时，HashMap会调用它的`hashCode()`方法来生成索引位置，然后将键值对存入该位置。查询的时候，会先调用要查询key的`hashCode()`方法计算出键值对在哈希表中的索引位置，然后直接取出键值对。这个过程不需要遍历，因此效率很高。

　　为了保证用key能够取出正确的键值对，我们需要`hashCode()`方法必须能够做到：对于属性相同的对象，它们的`hashCode()`方法返回相同的值。但是我们不能保证对于属性不同的对象，它们的`hashCode()`方法一定返回不同的值，这叫做哈希冲突。

　　我们需要在Object的子类中对`hashCode()`方法进行重写。

* ### equals()方法

　　`equals()`方法是Object类中定义的一个java方法，它比较的是两对象的地址：

```java
public boolean equals(Object obj) {
        return (this == obj);
    }
```

　　我们需要在Object的子类中对`equals()`方法进行重写。

* ### 二者的联系

　　在HashMap中，key是不能重复的，即不能将两个属性相同的对象同时作为key。为了保证这一点，我们可以先正确地重写对象的`equals()`方法，然后在插入的时候，用`equals()`方法判断两个对象属性是否相同，只有不相同时才插入。

　　但是`equals()`方法的执行效率有点低，为了提高比较的效率，我们是否可以通过比较两个对象的`hashCode`值来判断它们的属性是否相同呢？答案是可以，但还需要增加一些措施。我们首先比较两个对象的`hashCode`值，如果它们不相等，说明这两个对象的属性一定不相同，如果它们相等，由于哈希冲突现象的存在，我们无法保证这两个对象的属性一定相同，这时候我们只需要调用`equals()`方法再比较一次即可。**简言之，在HashMap给key去重的过程中，`equals()`方法是用来给`hashCode()`方法兜底的，因为`hashCode`值无法保证完全正确地比较两个对象，而`equals()`方法可以保证，但`hashCode`值的优点在于比较速度比`equals()`方法快**。

　　因此，为了保证HashMap能够正确地存取键值对，我们必须正确地重写key对象的`hashCode()`方法和`equals()`方法。对于`hashCode()`方法，我们的重写要求是：对于属性相同的对象，返回相同的值，对于属性不同的对象，尽量返回不同的值，避免哈希冲突。对于`equals()`方法，我们的重写要求是：对于属性相同的对象，返回true，对于属性不同的对象，返回false。