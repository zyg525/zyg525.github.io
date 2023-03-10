---
title: Java面试题——Spring-IOC & AOP & 事务
tags: Java面试题
---

## 一、IOC

* ### 什么是IOC和DI？

　　**IOC(Inversion Of Control，控制反转)**，即将创建对象的操作权交给Spring容器，调用者不需要手动通过new关键字创建对象，只需要从容器中获取创建好的对象即可。

　　**DI(Dependency Injection，依赖注入)**，指的是容器在创建对象时，将该对象依赖的其它对象注入给它。依赖注入有两种方式：**setter方法注入和构造方法注入**。

　　IOC最重要的作用是将对象的创建和使用分离开，即**解耦**，并且降低了代码量。

* ### ApplicationContext和BeanFactory的区别是什么？

　　ApplicationContext在创建容器对象后，就创建好了所有Bean，而BeanFactory只有当调用`getBean()`方法时才会创建Bean，即懒加载。

* ### Bean的作用域有哪些？

　　可以使用`@Scope`注解来配置Bean的作用域：

```java
@Scope("singleton") //单例。一个容器中同一类型的Bean只能有一个。
@Scope("singleton") //原型。每次调用getBean()方法都会产生新的Bean。
```

* ### @Autowired+@Qualifier和@Resource的区别是什么？

　　`@Autowired`会先通过类型注入，如果相同类型的Bean有多个，会通过属性名进行注入，如果没有和属性名同名的Bean，就需要配合`@Qualifier`来指定Bean的名称来进行注入。

　　`@Resource`的作用相当于`@Autowired`+`@Qualifier`，它也可以通过指定的Bean名称进行注入。

## 二、AOP

* ### 什么是AOP？

　　**AOP(Aspect Oriented Programming，面向切面编程)**，指的是把系统分解为不同的关注点(即切面，Aspect)，然后将一些类似于日志、事务等重复使用的代码抽取到独立的模块中，最后将这些代码自动织入到切面中。AOP减少了代码量，让业务逻辑变得更加清晰。

* ### 解释一下AOP的几个专用术语

　　**JointPoint(连接点)**：可以被拦截到的方法。

　　**PointCut(切入点)**：被拦截的方法。

　　**Advice(通知)**：对切入点进行增强的代码。

　　**Aspect(切面)**：切入点+通知。

　　**Weaving(织入)**：对切入点进行增强的过程。

* ### AOP有哪些通知方式？

　　有5种通知方式：`@Before`(前置通知)、`@After`(后置通知)、`@Around`(环绕通知)，`@AfterReturning`(返回后通知)、`@AfterThrowing`(异常通知)。

* ### 介绍一下AOP的使用步骤

　　1、创建被代理类，添加`@Component`交给IOC容器管理；

　　2、创建切面类，添加`@Component`、`@Aspect`，声明切面类并交给IOC容器管理，然后在切面类中定义通知；

　　3、在配置类上添加`@EnableAspectAutoProxy`，让IOC容器去寻找带有@Aspect的切面类，将通知方法织入到特定的位置。

* ### JDK动态代理和CGLIB动态代理的区别是什么？

　　Spring的AOP是通过动态代理实现的，具体分为JDK动态代理和CGLIB动态代理。JDK动态代理只能基于接口生成代理，因此被代理类必须至少实现一个接口，而CGLIB动态代理不需要被代理类实现接口。

　　可以指定动态代理方式：

```java
@EnableAspectAutoProxy(proxyTargetClass = true) //使用CGLIB动态代理
```

* ### SpringAOP和AspectJ的区别是什么？

　　SpringAOP属于**运行时增强**，即动态代理，具体的实现方式有JDK动态代理和CGLIB动态代理；而AspectJ属于**编译时增强**，即静态代理。SpringAOP只是使用了AspectJ中一些好用的注解，两者的底层实现完全不同。

## 三、事务

* ### 介绍一下Spring的声明式事务

　　Spring的声明式事务的最细粒度可以达到方法级别，它的原理是关闭数据库的自动提交，然后通过AOP对事务方法进行增强，如果成功就提交，如果发生异常就回滚。

　　在SpringBoot中使用声明式事务的方法是：

```java
//@Transactional中可以指定事务传播行为，以及回滚异常
@Transactional(propagation = Propagation.REQUIRED, rollbackFor = {Exception1.class, Exception2.class})
public method(..) {...} //事务方法必须是public类型
```

* ### 介绍一下数据库事务的隔离级别

　　数据库事务有4种隔离级别，从低到高分别是：

　　1、**READ UNCOMMITTED(读未提交)**：顾名思义，即事务A可能会读取到事务B中还没有提交的数据，即**脏读**。这种隔离级别的本质是**允许写入时读取**。

　　2、**READ COMMITTED(读已提交)**：事务A不会读取到事务B中还没有提交的数据，但是如果事务A分别在事务B的前后进行读取，两次读取的数据会不一致，即**不可重复读**。这种隔离级别的本质是**不允许写入时读取，但是允许读取时写入**。

　　3、**REPEATABLE READ(可重复读，mysql默认隔离级别)**：事务A不会读取到事务B中还没有提交的数据，并且如果事务A分别在事务B的前后进行读取，两次读取的数据是一致的，事务B的修改对事务A不可见，但是当事务A提交前后读取到的数据会不一致，即**幻读**。这种隔离级别的本质是**不允许写入时读取，允许读取时写入，但是其它事务的写入对当前事务不可见**。

　　4、**SERIALIZABLE(序列化)**：这是最高的隔离级别，可以避免脏读、不可重复读、幻读。这种隔离级别的本质是**不允许写入时读取，也不允许读取时写入**。

## 四、SpringMVC

* ### SpringMVC的执行流程是什么？

　　1、SpringMVC的核心是**DispatcherServlet**，当Web容器启动后，首先会加载、实例化DispatcherServlet(如果定义了过滤器，还会初始化过滤器)，然后执行`init()方法`，在`init()`方法中会创建IOC容器以及由容器管理的Bean实例，这些实例不仅包括普通Bean实例，还包括**Inteceptor(拦截器)、Controller(控制器)、HandlerAdapter(处理器适配器)、HandlerExceptionResolver(异常处理器)、ViewResolver(视图解析器)等实例**。

　　2、`init()`方法执行完之后，会先执行Filter链的`doFilter()`方法，然后执行DispatcherServlet的`service()`方法。在service()方法中，会先根据请求url去寻找目标Controller和目标方法，然后执行Inteceptor链的`preHandle()`方法，再通过HandlerAdapter将参数绑定给目标方法，并执行目标方法，获得返回值，然后执行Inteceptor链的`postHandle()`方法，最后ViewResolver对返回值进行解析，将渲染后的视图写入到响应中。`service()`方法结束后又回到Filter链的`doFilter()`方法，执行完后续的语句后程序执行流程结束。

　　执行流程图如下所示：

![SpringMVC执行流程](/assets/img/java/SpringMVC执行流程.png)

