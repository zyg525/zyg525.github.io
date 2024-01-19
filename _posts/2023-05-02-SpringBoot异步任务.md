---
title: SpringBoot异步任务
tags: 开发工具
layout: post
---

　　一般情况下，代码中的方法都是顺序执行，下一行代码的方法调用(method B)必须等上一行的方法(method A)执行完成之后才会执行，但是如果method A的执行耗时很长，而且其结果又不对后续的方法产生影响，则可以通过异步调用的方式来执行它，使得整个方法流程不必因等待method A而造成阻塞，在Spring Boot中，提供`@Async`注解来让开发者可以快捷高效地使用该异步调用。

　　**Spring异步任务的原理是将多个异步任务交给多个线程去执行**。

　　使用异步任务的步骤如下：

　　1、配置异步线程池(这一步可以省略，使用默认线程池)

```java
@Configuration
public class TaskExecutorConfig {

    @Bean
    public TaskExecutor taskExecutor(){
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(50);
        return executor;
    }
}
```

　　2、创建异步任务类，用`@Async`标注要执行的异步任务

```java
@Component
public class MyTask {
    /**
     * 没有返回值的异步任务
     * @return
     * @throws Exception
     */
    @Async("taskExecutor")
    public void doTask1() throws Exception{
        Thread.sleep(5000);
        System.out.println("doTask1:"+Thread.currentThread().getName());
        return new AsyncResult<>("1");
    }
    
    /**
     * 有返回值的异步任务
     * @return
     * @throws Exception
     */
    @Async("taskExecutor")
    public Future<String> doTask2() throws Exception{
        Thread.sleep(5000);
        System.out.println("doTask2:"+Thread.currentThread().getName());
        return new AsyncResult<>("2");
    }
    
    /**
     * 有返回值的异步任务
     * @return
     * @throws Exception
     */
    @Async("taskExecutor")
    public Future<String> doTask3() throws Exception{
        Thread.sleep(5000);
        System.out.println("doTask3:"+Thread.currentThread().getName());
        return new AsyncResult<>("3");
    }
}
```

　　3、在启动类上标注`@EnableAsync`，启动异步任务

```java
@SpringBootApplication
@EnableAsync
public class SpringBoot3Application {
    public static void main(String[] args) {
        SpringApplication.run(SpringBoot3Application.class,args);
    }
}
```

　　4、在测试方法中执行异步任务

```java
@SpringBootTest(classes = SpringBoot3Application.class)
public class MyTest {
    @Autowired
    MyTask myTask;
    
    @Test
    public void testAsync() throws Exception{
        long l1 = System.currentTimeMillis();
        future1 = myTask.doTask1();
        Future<String> future2 = myTask.doTask2();
        Future<String> future3 = myTask.doTask3();
        //对于有返回值的异步任务，调用get()方法会导致主线程阻塞
        System.out.println(future2.get());
        System.out.println(future3.get());
        long l2 = System.currentTimeMillis();
        System.out.println("耗时:"+(l2-l1));
    }
}
```

