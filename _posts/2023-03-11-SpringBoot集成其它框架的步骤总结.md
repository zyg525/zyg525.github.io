---
title: SpringBoot集成其它框架的步骤总结
tags: Spring
---

　　本文基于`SpringBoot-2.7.5`，项目父依赖是：

```pom
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.7.5</version>
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

* ### 配置Redis

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
    lettuce:
      pool:
        max-active: 8 #连接池最大连接数，负数代表没有限制
        max-wait: -1 #连接池最大阻塞等待时间，负数代表没有限制
```

　　最后就可以通过RedisTemplate操作数据库了。

* ### 使用RedisTemplate

　　SpringBoot会帮我们自动配置RedisTemplate，我们也可以定制自己的RedisTemplate，比如修改数据的序列化方式：

```java
@Configuration
public class MyRedisConfig {
    @Bean
    RedisTemplate redisTemplate(LettuceConnectionFactory lettuceConnectionFactory) {
        RedisTemplate<String, Serializable> redisTemplate = new RedisTemplate<>();
		redisTemplate.setKeySerializer(new StringRedisSerializer());
		redisTemplate.setValueSerializer(new GenericJackson2JsonRedisSerializer());
		redisTemplate.setConnectionFactory(connectionFactory);
		return redisTemplate;
    }
}
```

　　如果要序列化Java对象，对象需要实现Serializable接口。然后就可以使用RedisTemplate操作数据库了：

```java
ValueOperations valueOperations = redisTemplate.opsForValue(); //操作string
ListOperations listOperations = redisTemplate.opsForList(); //操作list
HashOperations hashOperations = redisTemplate.opsForHash(); //操作hash
SetOperations setOperations = redisTemplate.opsForSet(); //操作set
ZSetOperations zSetOperations = redisTemplate.opsForZSet(); //操作zset
GeoOperations geoOperations = redisTemplate.opsForGeo(); //操作Geo
```

## 四、集成RabbitMQ

* ### 添加依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```

* ### 配置文件

```yml
spring:
  rabbitmq:
    port: 5672
    host: 192.168.154.130
    username: test1
    password: test1
    virtual-host: /virtualhost1
```

* ### 生产者

　　1、配置队列、交换器

```java
@Configuration
public class RabbitmqConfig {
    //队列名称
    private static final String QUEUE_NAME = "queue1";
    //交换器名称
    private static final String EXCHANGE_NAME = "exchange1";

    /**
     * 声明队列
     */
    @Bean
    Queue queue(){
        return QueueBuilder.durable(QUEUE_NAME)
                .build();
    }

    /**
     * 声明交换器
     */
    @Bean
    DirectExchange directExchange(){
        return ExchangeBuilder.directExchange(EXCHANGE_NAME)
                .durable(true)
                .build();
    }

    /**
     * 绑定队列和交换器，绑定键是key1
     */
    @Bean
    Binding binding(){
        return BindingBuilder.bind(queue())
                .to(directExchange())
                .with("key1");
    }
    
    /**
     * 序列化工具，可以将Java对象自动序列化为JSON并以文本消息传递
     */
    @Bean
    MessageConverter createMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
```

　　2、通过`RabbitTemplate`发送消息到队列

```java
@RunWith(SpringRunner.class)
@SpringBootTest
public class MySenderTest {
    //使用RabbitTemplate发送消息
    @Autowired
    RabbitTemplate rabbitTemplate;
    
    @Test
    public void send(){
        rabbitTemplate.convertAndSend("exchange1","key1","你好");
    }
}
```

* ### 消费者

　　使用`@RabbitListener`注解监听队列：

```java
@RunWith(SpringRunner.class)
public class MyConsumer {
    @RabbitListener(queues = {"queue1"})
    public void handler1(String msg){
        System.out.println("msg："+msg);
    }
}
```

## 五、集成Kafka

* ### 添加依赖

```xml
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>
```

* ### 配置文件

```yml
spring:
  kafka:
    bootstrap-servers: 192.168.154.130:9092 #服务地址
    producer:
      retries: 0 #重试次数
      acks: 1 #应答级别:多少个分区副本备份完成时向生产者发送ack确认(可选0、1、all/-1)
      batch-size: 16384 #批量大小
      buffer-memory: 33554432 #生产端缓冲区大小
      key-serializer: org.apache.kafka.common.serialization.StringSerializer #key序列化器
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer #value序列化器

    consumer:
      group-id: group1 #默认的消费组ID
      enable-auto-commit: true #是否自动提交offset
      auto-commit-interval: 100  #提交offset延时(接收到消息后多久提交offset)

      # earliest:当各分区下有已提交的offset时，从提交的offset开始消费；无提交的offset时，从头开始消费
      # latest:当各分区下有已提交的offset时，从提交的offset开始消费；无提交的offset时，消费新产生的该分区下的数据
      # none:topic各分区都存在已提交的offset时，从offset后开始消费；只要有一个分区不存在已提交的offset，则抛出异常
      auto-offset-reset: earliest
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer #key反序列化器
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer #value反序列化器
      properties:
        spring:
          json:
            trusted:
              packages: '*' #配合JsonSerializer使用
```

* ### 生产者

```java
@RunWith(SpringRunner.class)
@SpringBootTest
public class MySenderTest {
    //使用KafkaTemplate发送消息
    @Autowired
    KafkaTemplate<String,Student> kafkaTemplate;
    
    @Test
    public void kafkaSender(){
        kafkaTemplate.send("mykafka","1",new Student("张三",30,99)); //Topic、key、value
    }
}
```

* ### 消费者

```java
@RunWith(SpringRunner.class)
public class MyConsumer {
    @KafkaListener(topics = {"mykafka"},groupId = "group1")
    public void kafkaHandler1(Student student){
        System.out.println("student="+student);
    }
}
```

## 六、集成ElasticSearch

