---
title: Java面试题——Spring-IOC & AOP & 事务 & SpringMVC & SpringBoot & 常用注解 & 设计模式
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
@Scope("prototype") //原型。每次调用getBean()方法都会产生新的Bean。
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

　　3、**REPEATABLE READ(可重复读，mysql默认隔离级别)**：事务A不会读取到事务B中还没有提交的数据，并且如果事务A分别在事务B的前后进行读取，两次读取的数据是一致的，事务B的修改对事务A不可见，但是事务A提交前后读取到的数据会不一致，即**幻读**。这种隔离级别的本质是**不允许写入时读取，允许读取时写入，但是其它事务的写入对当前事务不可见**。

　　4、**SERIALIZABLE(序列化)**：这是最高的隔离级别，可以避免脏读、不可重复读、幻读。这种隔离级别的本质是**不允许写入时读取，也不允许读取时写入**。

## 四、SpringMVC

* ### 简单介绍一下SpringMVC

　　MVC是一种设计模式，**M(Model)**指的是模型，**V(View)**指的是视图，**C(Controller)**指的是控制器。模型用来封装用户的输入输出数据，视图用来显示最终的结果，控制器负责前台和后台的交互。这种层次分明的开发模式被称为MVC模式。SpringMVC是Spring提供的一个基于MVC模式的轻量级Web开发框架。

* ### SpringMVC的执行流程是什么？

　　1、SpringMVC的核心是**DispatcherServlet**，当Web容器启动后，首先会加载、实例化DispatcherServlet(如果定义了过滤器，还会初始化过滤器)，然后执行`init()方法`，在`init()`方法中会创建IOC容器以及由容器管理的Bean实例，这些实例不仅包括普通Bean实例，还包括**Interceptor(拦截器)、Controller(控制器)、HandlerAdapter(处理器适配器)、HandlerExceptionResolver(异常处理器)、ViewResolver(视图解析器)等实例**。

　　2、`init()`方法执行完之后，会先执行Filter链的`doFilter()`方法，然后执行DispatcherServlet的`service()`方法。在service()方法中，会先根据请求url去寻找目标Controller和目标方法，然后执行Interceptor链的`preHandle()`方法，再通过HandlerAdapter将参数绑定给目标方法，并执行目标方法，获得返回值，然后执行Interceptor链的`postHandle()`方法，最后ViewResolver对返回值进行解析，将渲染后的视图写入到响应中。`service()`方法结束后又回到Filter链的`doFilter()`方法，执行完后续的语句后程序执行流程结束。

　　执行流程图如下所示：

![SpringMVC执行流程](/assets/img/java/SpringMVC执行流程.png)

## 五、SpringBoot

* ### 简单介绍一下SpringBoot

　　SpringBoot是一个基于Spring的套件，它可以帮助我们快速开发Spring应用，但是不提供核心功能。SpringBoot的核心思想是**约定大于配置**，使用大量默认配置代替人为配置，并允许人为调整默认配置，以提高开发效率。

* ### 简述SpringBoot自动配置的原理

　　1、SpringBoot将企业应用开发的各种场景都抽取出来，做成一个个**启动器(starter)**，启动器整合了该场景下各种可能用到的依赖，用户只需要在Maven文件中引入starter依赖，SpringBoot就能自动扫描到要加载的信息并启动相应的默认配置；

　　2、在starter的自动配置包下，可能会存在一个`/META-INF/spring.factories`文件，该文件中会有一个名为`org.springframework.boot.autoconfigure.EnableAutoConfiguration`的属性，属性值就是一个个默认的自动配置类；

　　3、SpringBoot的启动类上有一个`@SpringBootApplication`注解，这个注解中又定义了一个`@EnableAutoConfiguration`注解，它的作用就是开启自动配置，它会自动扫描项目中需要的默认配置类，然后交给IOC容器去装配。假如开发者想修改默认配置，可以在`application.properties/yml`文件中进行修改，默认配置类会自动读取文件中的配置信息。

## 六、常用注解

* ### IOC注解

　　1、**`@Component`**：标注在类上，IOC容器会创建、维护该类的实例。`@Repository`、`@Service`、`@Controller`和`@Component`的作用一样，只是分别用于MVC开发模式中的dao层、service层、controller层。

　　2、**`@Scope`**：和`@Component`或者`@Bean`配合使用，作用是指定Bean的作用域。

```java
@Component
@Scope("singleton") //单例模式
//@Scope("prototype") //原型模式
```

　　3、**`@Value`**：标注在Bean的一般属性上，作用是给属性注入值，可以直接注入，也可以配合`@PropertySource`注解，读取配置文件中的属性值后再注入。`@Value`也可以读取Bean的属性。

```java
@Value("张三") //直接注入
private String name;

@Value("${student.name}") //读取配置文件中student.name的值后注入
private String name;

@Value("#{student.name}") //读取名为student的Bean实例中的name属性后注入
private String name;
```

　　4、**`@PropertySource`**：标注在类上，作用是读取`.properties`文件中的属性值。

```java
@PropertySource("config.properties") //读取类路径下的config.properties文件
public class Student {...}
```

　　5、**`@Autowired`**：标注在Bean的对象属性或者方法参数上，作用是给属性或参数注入值，默认通过类型注入，也可以配合@Qualifier来通过实例名注入。

```java
@Autowired
@Qualifier("teacherLi") //会给该属性注入一个名为teacherLi的实例
private Teacher teacher;
```

　　6、**`@Resource`**：和`@Autowired`+`@Qualifier`的作用相同，区别是`@Resource`由JDK提供，而另外两个由Spring提供。

　　7、**`@ComponentScan`**：标注在类上，当通过该类创建IOC容器时，会自动扫描该类所在包以及所有子包中的Bean，然后注册到容器中。也可以自行指定要扫描的包。

　　8、**`@Configuration`**：标注在类上，它不但拥有`@Component`的功能，而且被标注的类会被声明为配置类。

　　9、**`@Bean`**：标注在配置类中的方法上，方法的返回值会作为Bean被注册到容器中，Bean的实例名默认是方法名，也可以自己指定实例名。当一个Bean类不在我们的管理范围之内，就可以使用`@Bean`来进行注册。

```java
@Bean("student") //向容器中注册一个名为student的Bean实例
Student getStudent() {
    return new Student();
}
```

* ### AOP注解

　　1、**`@Aspect`**：标注在Bean类上，作用是声明该类为切面类。

　　2、**`@Before`**：标注在切面类的方法上，作用是声明该方法为前置通知方法，与它类似的还有`@After`、`@Around`、`@AfterReturning`、`@AfterThrowing`，分别代表了后置通知、环绕通知、返回通知、异常通知。@Before可以配合execution表达式或者注解来向切入点织入通知。

```java
@Before("execution(public * com.zyg.user.printUser(..))") //向printUser()方法织入通知
@Before("@annotation(userLog)") //向所有Bean中标注了UserLog注解的方法织入通知
```

　　3、**`@EnableAspectAutoProxy`**：标注在类上，当通过该类创建IOC容器时，会自动查找切面类，并将通知方法织入到特定的位置。可以指定实现AOP的代理方式。

```java
@EnableAspectAutoProxy(proxyTargetClass = true) //true代表使用CGLIB动态代理，false(默认)代表使用JDK动态代理
@Configuration
public class MyConfig {...}
```

　　4、**`@Transactional`**：标注在类或方法上，在SpringBoot中可以直接为该方法开启事务，标注在类上可以为所有方法开启事务，可以指定事务传播行为和对哪些异常进行回滚。

```java
//事务传播行为是REQUIRED(默认)，当发生指定异常时回滚事务
@Transactional(propagation = Propagation.REQUIRED, rollbackFor = {Exception1.class,Exception2.class})
public void updateStudent() {...} //事务方法必须是public类型的非静态方法
```

* ### MVC注解

　　1、**`@RequestMapping`**：标注在类或方法上，作用在类上时，表示该类中所有响应请求的方法都以该地址为父路径，作用在方法上时，负责将请求映射到对应的方法上。它还有一些常用属性。

```java
@RequestMapping(value = "/login",                 //请求路径
                method = RequestMethod.GET,        //请求类型
                params = {"id=1","name=张三"},      //请求中必须携带的参数(在url后显式拼接)
                headers = {"Host=localhost:8080"}, //必须携带的请求头
                consumes = "application/json",     //请求提交的内容类型(即body的内容类型)
                produces = "text/html")            //响应返回的内容类型
public String login(User user) {...}
```

　　2、**`@PathVariable`**：标注在方法参数上，作用是读取url路径值并赋值给参数。

```java
@RequestMapping("/login/{path1}/{path2}")
//读取{path1}、{path2}的值，赋值给参数p1、p2
public String login(@PathVariable p1, @PathVariable p2) {...}
```

　　3、**`@RequestParam`**：标注在方法参数上，作用是当请求中参数名称和方法参数名称不同时，可以通过它进行绑定。

```java
@RequestMapping("/login")
//将请求中username的值赋值给方法参数name，请求中如果没有username，就把默认值"Tom"赋值给name
public String login(@RequestParam(value="username", required=true, defaultValue="Tom") String name) {...}
```

　　4、**`@RequestBody`**：标注在方法参数上，作用是将JSON格式的请求参数绑定到参数对象上。

```java
@RequestMapping("/login")
//将JSON数据绑定到user上
public String login(@RequestBody User user) {...}
```

　　5、**`@ResponseBody`**：标注在方法上，作用是将返回的对象转换为JSON格式，响应给客户端。

```java
@RequestMapping("/login")
@ResponseBody //将new User()转换为JSON格式响应给客户端
public String login(@RequestBody User user) {
    return new User();
}
```

　　6、**`@RestController`**：标注在类上，作用是相当于给该类的所有方法都加上了`@ResponseBody`。

　　7、**`@ExceptionHandler`**：标注在方法上，作用是声明该方法为异常处理方法，当前Controller类的其它方法只要发生了异常，就会执行这个方法。

```java
@ExceptionHandler({Exception1.class, Exception2.class}) //只要当前Controller中的方法抛出指定异常，就会执行这个方法
public void handleException() {...}
```

* ### SpringBoot注解

　　1、**`@ConfigurationProperties`**：标注在类上，作用是读取SpringBoot项目中的配置文件(`application.properties/yml`)，根据指定的前缀向类中的属性注入值，有点类似于`@PropertySource`。

```java
@Component
@ConfigurationProperties(prefix = "stu") 
public class Student {
    private int id;      //将配置文件中的stu.id赋值给id属性
    private String name; //将配置文件中的stu.name赋值给name属性
    //省略getter、setter...
}
```

　　2、**`@EnableConfigurationProperties`**：标注在配置类上，作用是将标注了`@ConfigurationProperties`的指定类注册为Bean(假如该类没有添加`@Component`)。

```java
@Configuration
@EnableConfigurationProperties({Student.class}) //将标注了@ConfigurationProperties的Student注册为Bean
public class MyConfig {...}
```

　　3、**`@Import`**：标注在配置类上，作用是将指定类注册为Bean(假如该类没有添加`@Component`)。

```java
@Configuration
@Import({Student.class}) //将Student注册为Bean
public class MyConfig {...}
```

　　4、**`@Conditional`**：标注在配置类上，作用是当指定Condition类中的方法返回值是true时配置类才会生效。

```java
public class MyCondition implements Condition {
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        return false; //返回true代表生效，false代表不生效
    }
}

@Configuration
@Conditional({MyCondition.class}) //该配置类不会生效
public class MyConfig {...}
```

　　5、**`@ConditionalOnBean`**：标注在配置类上，作用是当容器中存在指定Bean时配置类才会生效。

```java
@Configuration
@ConditionalOnBean({Student.class}) //当容器中存在Student类型的Bean时，该配置类才会生效
public class MyConfig {...}
```

　　6、**`@ConditionalOnMissingBean`**：标注在配置类上，作用是当容器中不存在指定Bean时配置类才会生效。

　　7、**`@ConditionalOnClass`**：标注在配置类上，作用是当系统中存在指定类时配置类才会生效。

```java
@Configuration
@ConditionalOnClass(name = {"com.zyg.Student"}) //当系统中存在com.zyg.Student类时，该配置类才会生效
public class MyConfig {...}
```

　　8、**`@ConditionalOnMissingClass`**：标注在配置类上，作用是当系统中不存在指定类时配置类才会生效。

```java
@Configuration
@ConditionalOnMissingClass({"com.zyg.Student"}) //当系统中不存在com.zyg.Student类时，该配置类才会生效
public class MyConfig {...}
```

　　9、**`@ConditionalOnProperty`**：标注在配置类上，作用是当配置文件中存在指定属性时配置类才会生效。

```java
@Configuration
//当配置文件中"stu.id"的值是"张三"时，该配置类才会生效，如果没有"stu.id"字段，配置类也会生效
@ConditionalOnProperty(name = "stu.name", havingValue = "张三", matchIfMissing = true)
public class MyConfig {...}
```

　　10、**`@EnableAutoConfiguration`**：标注在启动类上，作用是禁用指定的自动配置类。

```java
@SpringBootApplication
@EnableAutoConfiguration(exclude = {DataSourceAutoConfiguration.class}) //禁用数据库连接池的自动配置类
public class MyApplication {...}
```

　　11、**`@Profile`**：标注在Bean类上，作用是当指定的配置文件和激活的配置文件相同时该Bean才会被注册到容器中。

```yml
#主配置文件
spring:
	profiles:
		active: dev #激活dev配置文件
```

```java
@Component
@Profile("dev") //当dev配置文件被激活后，该Bean才会被注册到容器中
public class Student {...}
```

## 七、Spring中的设计模式

* ### 工厂模式

　　Spring使用工厂模式，可以通过BeanFactory或ApplicationContext来创建Bean对象。

* ### 单例模式

　　Spring中Bean的默认作用域就是单例的。

* ### 代理模式

　　Spring中的AOP就是通过代理模式(动态代理)实现的。

* ### 适配器模式

　　SpringMVC中使用到了适配器模式。在SpringMVC中，处理器(Handler)可能有多种类型，比如Controller、Servlet、HttpRequestHandler等等，不同类型的处理器有不同的执行方式，最简单的实现方法就是用`if...else`多重判断+`instanceof`直接执行：

```java
if(handler instanceof Controller) {调用handler...}
else if(handler instanceof Servlet) {调用handler...}
else if(handler instanceof HttpRequestHandler) {调用handler...}
...
```

　　但是这种方法有一个缺点，当新增一个处理器类型时，需要再增加一个`else...if`，违反了开闭原则(对扩展开放，对修改关闭)。更好的方法是使用适配器模式，将不同类型的Handler包装成具有统一接口、不同实现的适配器，执行处理器时，通过统一的方法名执行。

　　SpringMVC中为我们提供了4种适配器，它们都继承了HandlerAdapter接口，这个接口有两个重要的方法：

```java
//判断当前适配器是否支持当前Handler
boolean supports(Object handler);
//执行Handler
ModelAndView handle(HttpServletRequest request, HttpServletResponse response, Object handler);
```

　　根据不同类型的Handler，这4种适配器对`supports()`和`handle()`方法有不同的实现。当要执行一个Handler时，首先会根据`supports()`方法来为它选择一个合适的适配器，然后再统一通过适配器的`handler()`方法执行。这样，即使新增一种Handler，也无需修改原代码，只需要新增一个适配器即可。

* ### 模板方法

　　<font color='red'>JdbcTemplate。</font>

* ### 装饰者模式

　　<font color='red'>DataSource。</font>

* ### 观察者模式

　　Spring的监听器(Listener)使用了观察者模式。

