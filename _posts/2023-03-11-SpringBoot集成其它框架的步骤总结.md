---
title: SpringBoot集成其它框架的步骤总结
tags: Spring
---

　　本文基于`SpringBoot-2.3.0`，项目父依赖是：

```pom
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.3.0.RELEASE</version>
</parent>
```

## 一、集成MyBatis

* ### 添加项目依赖

```pom
<!-- Web项目起步依赖 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<!-- mysql数据库驱动 -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
<!-- mybatis起步依赖 -->
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.1.0</version>
</dependency>
```

* ### 配置数据源

　　SpringBoot自带Hikari数据源，配置文件的写法是：

```yml
spring:
  datasource:
    url: jdbc:mysql://192.168.154.130:3306/test?useSSL=false&characterEncoding=utf8&serverTimezone=Asia/Shanghai
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
```

　　如果要切换为其它数据源，比如Druid，需要先引入Druid起步依赖：

```pom
<!-- Druid起步依赖 -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid-spring-boot-starter</artifactId>
    <version>1.2.14</version>
</dependency>
```

　　然后修改配置文件(这一步可以省略，SpringBoot会自动使用引入的Druid数据源)：

```yml
spring:
  datasource:
    type: com.alibaba.druid.spring.boot.autoconfigure.DruidDataSourceWrapper
```

* ### 编写映射器

　　创建映射器接口，并在接口上标注`@Mapper`，SpringBoot项目启动后，会自动扫描带有`@Mapper`的接口，为它们生成代理。

```java
@Mapper
public class StudentMapper {...}
```

　　也可以在配置类上标注`@MapperScan`，指定映射器接口所在的包，SpringBoot会为包内的所有接口生成代理：

```java
@Configuration
@MapperScan({"com.zyg.mapper"})
public class MyConfig {...}
```

　　创建好映射器接口后，可以通过注解的方式直接将SQL语句写在接口方法上：

```java
@Mapper
public class StudentMapper {
    @Select("SELECT id,name,age FROM t_student WHERE id=#{id}")
    Student selectStudent(int id);
}
```

　　也可以将SQL写到`Mapper.xml`文件中，然后在配置文件中指定`Mapper.xml`文件的位置：

```yml
mybatis:
  mapper-locations:
    - classpath:mapper/*.xml #类路径下mapper目录中的所有xml文件
    - classpath:*.xml #类路径下的所有xml文件
```

## 二、集成日志

　　SpringBoot默认使用`slf4j`+`logback`记录日志，我们只需要添加一个`logback.xml`配置文件就可以开启日志了。更好的方法是将`logback.xml`更名为`logback-spring.xml`，这样就可以使用SpringBoot的Profile特性了，实现在不同的环境下输出不同格式的日志：

```xml
<configuration scan="false" scanPeriod="60 seconds" debug="false">
    ......
    <appender name="stdout" class="ch.qos.logback.core.ConsoleAppender">
       <layout class="ch.qos.logback.classic.PatternLayout">
            <!--开发环境 日志输出格式-->
            <springProfile name="dev">
                <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} ----> [%thread] ---> %-5level %logger{50} - %msg%n</pattern>
            </springProfile>
            <!--非开发环境 日志输出格式-->
            <springProfile name="!dev">
                <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} ==== [%thread] ==== %-5level %logger{50} - %msg%n</pattern>
            </springProfile>
        </layout>
    </appender>
    ......
</configuration> 
```

## 三、集成Redis

　　首先要引入Redis的起步依赖：

```pom
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

　　然后修改配置文件：

```yml
spring:
  redis:
    host: 192.168.154.130
    port: 6379
    database: 0 #数据库索引
    password:
    timeout: 300ms #连接超时时间
```

　　最后就可以通过RedisTemplate操作数据库了。

## 四、集成RabbitMq

## 五、集成Kafka

## 六、集成ElasticSearch

