---
title: 查询分页工具PageHelper
tags: 开发工具
---

　　本文基于SpringBoot-2.7.0和PageHelper-1.4.6。

* ### 引入依赖

```xml
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper-spring-boot-starter</artifactId>
    <version>1.4.6</version>
</dependency>
```

* ### 配置文件

```yml
pagehelper:
  helper-dialect: mysql #数据库类型
  page-size-zero: true #默认是false，当是true时，如果pageSize=0，会查询出全部结果
  reasonable: true #默认是false，当是true时，如果pageNum<=0，会查询第一页，如果pageNum>pageCounts，会查询最后一页
```

* ### 使用方法

```java
public List<Student> selectStudents(int pageNum, int pageSize) {
    PageHelper.startPage(pageNum,pageSize);
    List<Student> list = studentMapper.selectStudents();
    long total = ((Page)list).getTotal();
    return list;
}
```

　　1、`PageHelper.startPage()`后面的第一条查询语句会被分页；

　　2、第一页的`pageNum=1`；

　　3、`PageHelper`的工作原理仍然是`limit`；

　　4、可以将List类型的查询结果强转为Page类型，以获取其它信息，比如总的数据量。

　　

参考连接：

1、[如何使用分页插件](https://pagehelper.github.io/docs/howtouse/)