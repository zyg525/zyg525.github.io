---
title: MapStruct教程
tags: 开发工具
---

　　当我们需要把一个实体类的属性映射到另一个实体类上时，可以使用`BeanUtils.copyProperties()`方法，但是它只能映射同名的属性，而且效率比较低。更好的方法是使用MapStruct。

* ### 引入依赖

```xml
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct-jdk8</artifactId>
    <version>1.2.0.Final</version>
</dependency>
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct-processor</artifactId>
    <version>1.2.0.Final</version>
</dependency>
```

* ### 使用方法

　　1、创建Mapper接口，在接口中定义转换方法

```java
@Mapper //注意，这不是Mybatis中的@Mapper注解
public interface StudentMappers {
    StudentMappers INSTANCE = Mappers.getMapper(StudentMappers.class);

    //映射方法
    StudentVo toStudentVo(StudentDo studentDo);
}
```

　　2、调用映射方法

```java
public static void main(String[] args) {
    StudentDo studentDo = new StudentDo(1, "张三", 18, 99);
    StudentVo studentVo = StudentMappers.INSTANCE.toStudentVo(studentDo);
    System.out.println(studentVo);
}
```

　　3、当源类和目标类中的属性名不相同时，接口需要修改成这样

```java
@Mapper
public interface StudentMappers {
    StudentMappers INSTANCE = Mappers.getMapper(StudentMappers.class);

    @Mappings({
            @Mapping(source = "id",target = "idVo"),
            @Mapping(source = "name",target = "nameVo")
    })
    StudentVo toStudentVo(StudentDo studentDo);
}
```

　　4、当源类有多个或者存在嵌套关系时，接口需要改成这样

```java
@Mapper
public interface StudentMappers {
    StudentMappers INSTANCE = Mappers.getMapper(StudentMappers.class);

    @Mappings({
            @Mapping(source = "studentDo.id",target = "idVo"),
            @Mapping(source = "teacher.name",target = "nameVo")
            @Mapping(source = "studentDo.teacher.age",target = "ageVo")
    })
    StudentVo toStudentVo(StudentDo studentDo, Teacher teacher);
}
```

　　

本文参考：

1、<https://blog.csdn.net/qq_40194399/article/details/110162124>