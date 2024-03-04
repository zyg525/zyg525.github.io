---
title: Spring框架之SpringBoot
categories: 四、Spring框架
tags: Spring框架
layout: post
---



## 一、SpringBoot原理

### 概述

　　Spring Boot是一个基于Spring的套件，它帮我们预组装了Spring的一系列组件，以便以尽可能少的代码和配置来开发基于Spring的Java应用程序。

### 第一个SpringBoot程序

　　创建一个简单的SpringBoot程序的步骤：

　　1、添加项目父依赖、SpringBoot起步依赖、其它必要依赖

```xml
<!-- 项目父依赖 -->
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.3.0.RELEASE</version>
</parent>

<dependencies>
    <!-- SpringBoot起步依赖 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <!-- 数据库驱动依赖 -->
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
</dependencies>
```

　　2、在项目类路径下创建配置文件`application.yml`，配置数据库的属性

```yml
spring:
  datasource:
    url: jdbc:mysql://192.168.220.128:3306/test?useSSL=false&characterEncoding=utf8&serverTimezone=Asia/Shanghai
    username: root
    password: 123456
```

　　3、在包路径下创建启动类

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication
public class Main {
    public static void main(String[] args) throws Exception {
        SpringApplication.run(Main.class, args);
    }
}
```

　　4、运行启动类，就可以开启一个SpringBoot-Web应用。

### 父依赖和起步依赖

* #### 父依赖

　　SpringBoot项目中引入了一个父依赖`spring-boot-starter-parent`，它主要提供了以下特性：默认 JDK 版本、默认字符集（UTF-8）、依赖管理功能、资源过滤、默认插件配置、识别 `application.properties` 和 `application.yml` 类型的配置文件。

* #### 起步依赖

　　Spring Boot 将日常企业应用研发中的各种场景都抽取出来，做成一个个的 starter（启动器），starter 中整合了该场景下各种可能用到的依赖，用户只需要在 Maven 中引入 starter 依赖，SpringBoot 就能自动扫描到要加载的信息并启动相应的默认配置。starter 提供了大量的自动配置，让用户摆脱了处理各种依赖和配置的困扰。所有这些 starter 都遵循着约定俗成的默认配置，并允许用户调整这些配置，即遵循“**约定大于配置**”的原则。

### 自动配置原理

　　在传统的Spring项目中，我们需要手动创建数据源、声明式事务、JdbcTemplate等组件，但在SpringBoot项目中，这些组件不需要手动创建，SpringBoot会自动帮我们创建并配置这些组件，这就是自动配置。SpringBoot实现自动配置的过程如下：

　　1、spring boot会根据开发者添加的依赖判断是否使用了某个技术，比如在依赖中有DispatcherServlet，那就说明使用了spring mvc技术。

　　2、spring boot判断出开发者所使用的技术之后，会从自动配置（AutoConfigure）相关的包下找到该技术相关的配置类。

　　3、spring boot会加载这些配置类，如果配置文件有写相关的配置信息的话会将该信息读取到配置类的对象中，然后加载到spring容器中，这样就完成了自动配置了。如果自动配置AutoConfigure包下没有这些配置类，我们需要手动配置。

### 实现一个druid数据源的自动配置

　　1、创建一个Maven项目，添加SpringBoot起步依赖、druid依赖、数据库驱动依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <version>2.3.0.RELEASE</version>
</dependency>
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.2.6</version>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.49</version>
</dependency>
```

　　2、创建自动配置类`MyDataSourceAutoConfiguration`，在自动配置类中创建`DataSource`对象

```java
@Configuration
// 当DataSource类存在时，配置类才生效
@ConditionalOnClass({DataSource.class})
// 启用@ConfigurationProperties注解，用于读取application.yml配置文件中的配置，并注入到MyDataSourceProperties类中
@EnableConfigurationProperties(MyDataSourceProperties.class)
public class MyDataSourceAutoConfiguration {

    @Bean
    DruidDataSource druidDataSource(MyDataSourceProperties myDataSourceProperties) {
        DruidDataSource druidDataSource = new DruidDataSource();
        druidDataSource.setUrl(myDataSourceProperties.getUrl());
        druidDataSource.setUsername(myDataSourceProperties.getUsername());
        druidDataSource.setPassword(myDataSourceProperties.getPassword());
        return druidDataSource;
    }
}
```

　　3、创建配置属性类`MyDataSourceProperties`，属性类中定义了数据源的常用配置，比如url、username、password，这些配置可以从`application.yml`文件中读取

```java
@ConfigurationProperties(prefix = "mydatasource")
public class MyDataSourceProperties {
    private String url;
    private String username;
    private String password;
    // 省略getter、setter
}
```

　　4、在类路径/META-INF下创建`spring.factories`文件，文件中指定了自动配置类的全限定名

```factories
# Auto Configure
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
com.zyg.config.MyDataSourceAutoConfiguration
```

　　5、编译、打包项目，如果想在其它SpringBoot项目中使用druid数据源，只需要引入该jar包，然后在`application.yml`中进行配置即可：

```yml
mydatasource:
  url: jdbc:mysql://192.168.220.128:3306/test?useSSL=false&characterEncoding=utf8&serverTimezone=Asia/Shanghai
  username: root
  password: 123456
```

## 二、SpringBoot打包

### Maven打包插件

　　Spring Boot自带一个简单的`spring-boot-maven-plugin`插件用来打包，我们只需要在`pom.xml`中加入以下配置：

```xml
<project ...>
    ...
    <build>
        <!-- 生成的包名 -->
        <finalName>MyApp</finalName>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

　　无需任何配置，Spring Boot的这款插件会自动定位应用程序的入口Class，我们执行以下Maven命令即可打包：

```shell
mvn clean package
```

　　以`springboot-exec-jar`项目为例，打包后我们在`target`目录下可以看到两个jar文件：

```
springboot-exec-jar-1.0-SNAPSHOT.jar
springboot-exec-jar-1.0-SNAPSHOT.jar.original
```

　　其中，`springboot-exec-jar-1.0-SNAPSHOT.jar.original`是Maven标准打包插件打的jar包，它只包含我们自己的Class，不包含依赖，而`springboot-exec-jar-1.0-SNAPSHOT.jar`是Spring Boot打包插件创建的包含依赖的jar，可以直接运行：

```shell
java -jar springboot-exec-jar-1.0-SNAPSHOT.jar
```

　　这样，部署一个Spring Boot应用就非常简单，无需预装任何服务器，只需要上传jar包即可。

### jar包瘦身工具

* #### 原理

　　jar包虽然可以直接运行，但缺点是包太大了，动不动几十MB，在网速不给力的情况下，上传服务器非常耗时。并且，其中我们引用到的Tomcat、Spring和其他第三方组件，只要版本号不变，这些jar就相当于每次都重复打进去，再重复上传了一遍。所以问题来了：如何只打包我们自己编写的代码，同时又自动把依赖包下载到某处，并自动引入到classpath中。解决方案就是使用`spring-boot-thin-launcher`。

　　实际上`spring-boot-thin-launcher`这个插件改变了`spring-boot-maven-plugin`的默认行为。它输出的jar包只包含我们自己代码编译后的class，一个很小的`ThinJarWrapper`，以及解析`pom.xml`后得到的所有依赖jar的列表。运行的时候，入口实际上是`ThinJarWrapper`，它会先在指定目录搜索看看依赖的jar包是否都存在，如果不存在，先从Maven中央仓库下载到本地，然后，再执行我们自己编写的`main()`入口方法。

* #### 基本使用

　　使用`spring-boot-thin-launcher`的步骤是：

　　1、在要打包的项目中添加依赖，并修改打包插件的配置：

```xml
<dependencies>
	<dependency>
        <groupId>org.springframework.boot.experimental</groupId>
        <artifactId>spring-boot-thin-layout</artifactId>
        <version>1.0.27.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot.experimental</groupId>
        <artifactId>spring-boot-thin-launcher</artifactId>
        <classifier>exec</classifier>
        <version>1.0.27.RELEASE</version>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <finalName>MyApp</finalName>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <dependencies>
                <dependency>
                    <groupId>org.springframework.boot.experimental</groupId>
                    <artifactId>spring-boot-thin-layout</artifactId>
                    <version>1.0.27.RELEASE</version>
                </dependency>
            </dependencies>
        </plugin>
    </plugins>
</build>
```

　　2、输入下面的命令启动jar包，在系统属性中指定jar包搜索和下载的地址，这里配置成本地Maven仓库路径

```shell
java  -Dthin.root=D:\Software\java\Maven-3.8 -jar MyApp-1.0-SNAPSHOT.jar
```

* #### 预热

　　第一次在服务器上运行`awesome-app.jar`时，仍需要从Maven中央仓库下载大量的jar包，所以，`spring-boot-thin-launcher`还提供了一个`dryrun`选项，专门用来下载依赖项而不执行实际代码：

```shell
java -Dthin.dryrun=true -Dthin.root=. -jar MyApp-1.0-SNAPSHOT.jar
```

　　执行上述代码会在当前目录创建`repository`目录，并下载所有依赖项，但并不会运行我们编写的`main()`方法。此过程称之为“预热”（warm up）。如果服务器由于安全限制不允许从外网下载文件，那么可以在本地预热，然后把`MyApp-1.0-SNAPSHOT.jar`和`repository`目录上传到服务器。只要依赖项没有变化，后续改动只需要上传`MyApp-1.0-SNAPSHOT.jar`即可。

## 三、SpringBoot其它功能

### 加载配置文件

* #### @Value

　　在SpringBoot中也可以使用`@Value`加载配置文件。

　　`application.yml`：

```yml
server:
  port: 8082
```

　　`DataSourceConfig.java`：

```java
@Component
public class DataSourceConfig {
    // 默认值是8080
    @Value("${server.port:8080}")
    private String port;
}
```

* #### @ConfigurationProperties

　　加载配置文件更好的方式是使用`@ConfigurationProperties`。

　　`application.yml`：

```yml
server:
  port: 8082
```

　　`DataSourceConfig.java`：

```java
@Configuration
@ConfigurationProperties("server")
public class DataSourceConfig {
    private String port;
}
```

### 禁用自动配置

　　禁用自动配置的方法：

```java
@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
public class MyApplication {
    ...
}
```

