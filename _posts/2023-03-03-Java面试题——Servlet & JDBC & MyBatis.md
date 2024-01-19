---
title: Java面试题——Servlet & JDBC & MyBatis
tags: Java面试题
layout: post
---

## 一、Servlet

* ### Tomcat的默认端口是多少，如何修改？

　　默认端口是`8080`，可以在`conf/server.xml`中修改。

* ### 描述一下Servlet的生命周期

　　Servlet的生命周期分为三部分：

　　1、**初始化**：当启动Tomcat容器后，容器会读取配置信息，加载并实例化Servlet，然后调用Servlet中的`init()`方法。

　　2、**运行**：浏览器每发出一次请求，容器就会为该请求创建一个ServletRequest对象和ServletResponse对象，并将它们以参数的形式传进`service()`方法内，调用该方法对请求进行处理，最后对响应信息进行包装，返回浏览器。

　　3、**销毁**：当容器关闭或移除Servlet实例时，会调用`destroy()`方法。

* ### ServletConfig和ServletContext的作用范围分别是什么？

　　ServletConfig的作用范围是Servlet实例，每个Servlet实例都有一个ServletConfig；ServletContext的作用范围是Web应用，应用内的所有Servlet实例共享一个ServletContext。

* ### 简述GET和POST的区别

　　**GET**：请求参数通过`?`拼接在URL后面，大小有限制，不能放敏感信息。

　　**POST**：请求参数放在请求体中，大小没有限制，可以放敏感信息。

* ### 简述转发和重定向的区别

　　**转发**：转发指的是浏览器请求一个Servlet，这个Servlet又去请求另一个Servlet。转发是服务器内部的行为，一次转发中的ServletRequest和ServletReponse对象都是同一个。转发对浏览器是透明的。

　　**重定向**：重定向指的是浏览器请求一个Servlet，这个Servlet返回一个302响应和URL，让浏览器去请求另一个Servlet。重定向是浏览器的行为，重定向前后的ServletRequest和ServletReponse对象是不同的。重定向之后，浏览器的URL栏会改变。

* ### 介绍一下Cookie和Session以及它们的区别

　　**Cookie**：Cookie是用来跟踪浏览器用户身份的一种机制。浏览器访问服务器时，服务器可以返回给浏览器一个或者多个Cookie对象，每个Cookie对象只能存放一个String-String类型的键值对。Cookie存储在浏览器中，当浏览器再次访问服务器时，可以携带Cookie来验证自己的身份。

　　**Session**：浏览器访问服务器时，服务器会为每个浏览器创建一个SessionId和对应的HttpSession对象，并将其保存在服务器中，同时将“JSESSIONID”字符串和SessionId分别作为一个Cookie对象的键和值，返回给浏览器。这个Cookie存储在浏览器中，当浏览器再次访问服务器时，会通过SessionId找到对应的HttpSession对象来验证自己的身份。

　　**区别**：

　　1、Cookie只能存放一个String-String键值对，而Session可以存放多个String-Object键值对；

　　2、Cookie存放在浏览器，Session存放在服务器，因此Session更加安全；

　　3、浏览器对Cookie的大小和数量有限制，但是服务器对Session的大小和数量没有限制。

## 二、JDBC

* ### 简述JDBC操作数据库的步骤

　　1、注册数据库驱动，数据库驱动就是数据库厂商提供的实现了JDBC接口的实现类。

　　2、获取Connection，核心代码是静态方法`DriverManager.getConnection(url, username, password)`。

　　3、创建Statement对象，通过它来操作数据库，核心代码是`connection.createStatement()`。

　　4、执行sql语句。

　　5、关闭Connection。

* ### 如何防止sql注入？

　　使用PreparedStatement代替Statement来操作数据库，通过占位符`?`来写入参数。

* ### 介绍一下数据库连接池

　　JDBC操作数据库时，频繁地创建、销毁Connection对象会浪费资源，我们可以利用数据库连接池复用已有的Connection。数据库连接池的接口是`javax.sql.DataSource`，常见的实现类有HikariCP、Druid等等。数据库连接池内维护了若干个Connection实例，如果调用了`getConnection()`，就选择一个空闲连接，把它标记为“正在使用”然后返回，如果关闭连接，就把它标记为“空闲”等待下次使用。

## 三、MyBatis

* ### 简单介绍一下MyBatis

　　MyBatis是一款持久层框架，它对JDBC进行了封装，开发人员不用再花费精力去处理加载驱动、创建连接、创建statement等繁琐的过程，只需要专注于SQL本身，提高了开发效率。

　　MyBatis的使用步骤是：

　　1、创建SqlSessionFactoryBuilder；

　　2、通过SqlSessionFactoryBuilder**创建SqlSessionFactory**；

　　3、通过SqlSessionFactory**创建SqlSession**；

　　4、通过SqlSession**获取Mapper代理对象**；

　　5、通过Mapper代理对象来**操作数据库**；

　　6、通过SqlSession提交事务。

* ### MyBatis有哪些常用标签？

　　SQL语句标签：**select、update、insert、delete**。

　　动态SQL标签：**（trim、where、set，去除多余符号）、(if、choose-when-otherwise，条件判断)、(foreach，遍历集合)、(bind，拼接字符串)**。

　　常见用法有：

```xml
<where>
    <choose>
        <when test="id==1"> and id=1</when>
        <when test="id==2"> and id=2</when>
        <otherwise> and id=3</otherwise>
    </choose>
</where>
```

```xml
<set>
    <if test="name != null">name=#{name},</if>
    <if test="age != null">age=#{age},</if>
</set>
```

```xml
<foreach collection="list" item="student" index="index" open="(" separator="," close=")">
    #{student.id}
</foreach>
```

* ### #{}和${}的区别是什么？

　　`#{}`是预编译处理，`${}`是字符串替换。MyBatis在处理`#{}`时，会用`?`替换它，然后调用PreparedStatement的set方法来传入参数，因此可以防止SQL注入。

* ### 介绍一下MyBatis的延迟加载

　　MyBatis的延迟加载指的是进行多表关联查询时(关联的表必须在不同的标签中)，只对主加载对象进行查询，延迟对关联对象的查询。延迟加载分为两种：**侵入式延迟加载和深度延迟加载**。它们的区别是：侵入式延迟加载指的是，只有当访问主加载对象属性的时候才会去查询关联对象，而深度延迟加载指的是，只有当访问关联对象属性的时候才会去查询关联对象。

　　延迟加载的开关是：

```xml
<settings>
    <setting name="lazyLoadingEnabled" value="true"/>  <!-- 延迟加载总开关 -->
    <setting name="aggressiveLazyLoading" value="true"/> <!--  true代表开启侵入式延迟加载,false代表开启深度延迟加载 -->
</settings>
```

* ### 介绍一下MyBatis的缓存

　　MyBatis自带一级缓存和二级缓存，它们可以减轻数据库的压力。

　　**一级缓存**：一级缓存默认开启且无法关闭，**它的作用范围是SqlSession**。它的底层原理是：每一个SqlSession都持有一个Map，它的key是和SQL语句相关的hash值，它的value是查询结果。当SqlSession执行了更新操作，就会清空一级缓存。

　　**二级缓存**：二级缓存的开启方法是在Mapper.xml映射文件中加上`<cache/>`标签，**它的作用范围是SqlSessionFactory+命名空间**，底层原理和一级缓存类似。当SqlSessionFactory执行了更新操作，就会清空二级缓存。JavaBean必须实现Serializable接口才能使用二级缓存。如果要对某个SQL语句单独设置二级缓存，可以在标签中加入下面的属性：

```xml
<update ... useCache="true" flushCache="false"> <!--  使用二级缓存,更新时不清空缓存 -->
```

　　如果要使用第三方缓存，可以修改`<cache/>`标签：

```xml
<cache type="com.leven.mybatis.core.cache.MybatisRedisCache"/> <!-- 使用Redis缓存  -->
```

