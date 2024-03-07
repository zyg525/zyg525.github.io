---
title: Spring框架之SpringCloud
categories: 四、Spring框架
tags: Spring框架
layout: post
---



## 一、概述

### 微服务简介

* #### 集中式系统与分布式系统

　　在系统架构与设计的实践中，经历了两个阶段，一个阶段是早些年常见的集中式系统，一个阶段是近年来流行的分布式系统。**集中式系统也叫单体应用，就是把所有的程序、功能、模块都集中到一个项目中，部署在一台服务器上，从而对外提供服务；分布式系统就是把所有的程序、功能拆分成不同的子系统，部署在多台不同的服务器上，这些子系统相互协作共同对外提供服务**，而对用户而言他并不知道后台是多个子系统和多台服务器在提供服务，在使用上和集中式系统一样。

　　产品或者网站初期，通常功能较少，用户量也不多，所以一般按照单体应用进行设计和开发，按照经典的MVC三层架构设计。随着业务的发展，应用功能的增加，访问用户的增多，传统的采用集中式系统进行开发的方式就不再适用了，因为在这种情况下，集中式系统就会逐步变得非常庞大，很多人维护这么一个系统，开发、测试、上线都会造成很大问题，比如代码冲突，代码重复，逻辑错综混乱，代码逻辑复杂度增加，响应新需求的速度降低，隐藏的风险增大。所以需要按照业务维度进行应用拆分，采用分布式开发，每个应用专职于做某一些方面的事情，比如将一个集中式系统拆分为用户服务、订单服务、产品服务、交易服务等，各个应用服务之间通过相互调用完成某一项业务功能。

* #### 微服务架构

　　分布式强调系统的拆分，微服务也是强调系统的拆分，微服务架构属于分布式架构的范畴。简单地说， **微服务是系统架构上的一种设计风格， 它的主旨是将一个原本独立的系统拆分成多个小型服务，这些小型服务都在各自独立的进程中运行，服务之间通过基于HTTP的RESTful API进行通信协作**。被拆分后的每一个小型服务都围绕着系统中的某一项业务功能进行构建， 并且每个服务都是一个独立的项目，可以进行独立的测试、开发和部署等。由于各个独立的服务之间使用的是基于HTTP的JSON作为数据通信协作的基础，所以这些微服务可以使用不同的语言来开发。

　　微服务架构的优缺点：

| 优点                                                         | 缺点                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| 1、我们知道微服务架构是将系统中的不同功能模块拆分成多个不同的服务，这些服务进行独立地开发和部署，每个服务都运行在自己的进程内，这样每个服务的更新都不会影响其他服务的运行;<br />2、由于每个服务是独立部署的，所以我们可以更准确地监控每个服务的资源消耗情况，进行性能容量的评估，通过压力测试，也很容易发现各个服务间的性能瓶颈所在;<br />3、由于每个服务都是独立开发，项目的开发也比较方便，减少代码的冲突、代码的重复，逻辑处理流程也更加清晰，让后续的维护与扩展更加容易;<br />4、微服务可以使用不同的编程语言进行开发。 | 1、微服务架构增加了系统维护、部署的难度，导致一些功能模块或代码无法复用;<br />2、随着系统规模的日渐增长，微服务在一定程度上也会导致系统变得越来越复杂，增加了集成测试的复杂度;<br />3、随着微服务的增多，数据的一致性问题，服务之间的通信成本等都凸显了出来。 |

　　所以在系统架构时也要提醒自己：**不要为了微服务而微服务**。

* #### Spring Cloud是什么

　　1、Spring Cloud是一个一站式的开发分布式系统的框架，为开发者提供了一系列的构建分布式系统的工具集；

　　2、Spring Cloud为开发人员提供了快速构建分布式系统中一些常见模式的工具(比如：配置管理，服务发现，断路器，智能路由、微代理、控制总线、全局锁、决策竞选、分布式会话和集群状态管理等)；

　　3、开发分布式系统都需要解决一系列共同关心的问题，而使用Spring Cloud可以快速地实现这些分布式开发共同关心的问题，并能方便地在任何分布式环境中部署与运行；

　　4、Spring Cloud这个一站式地分布式开发框架，被近年来流行的“微服务”架构所大力推崇，成为目前进行微服务架构的优先选择工具。

* #### 为什么选择Spring Cloud构建微服务

　　整个微服务架构是由大量的技术框架和方案构成，比如：

| 服务基础开发   | Spring MVC、Spring、SpringBoot                               |
| -------------- | ------------------------------------------------------------ |
| 服务注册与发现 | Netflix的Eureka、Apache的ZooKeeper等                         |
| 服务调用       | RPC调用有阿里巴巴的Dubbo，Rest方式调用有当当网Dubbo基础上扩展的Dubbox、 还有其他方式实现的Rest，比如Ribbon、Feign |
| 分布式配置管理 | 百度的Disconf、360的QConf、淘宝的Diamond、Netflix的Archaius等 |
| 负载均衡       | Ribbon                                                       |
| 服务熔断       | Hystrix                                                      |
| API网关        | Zuul                                                         |
| 批量任务       | 当当网的Elastic-Job、Linkedln的Azkaban                       |
| 服务跟踪       | 京东的Hydra、Twitter的Zipkin等                               |

　　但是在微服务架构上，几乎大部分的开源组件都只能解决某一个场景下的问题，所以这些实施微服务架构的公司也是整合来自不同公司或组织的诸多开源框架，并加入针对自身业务的一些改进，没有一个统一的架构方案。所以当我们准备实施微服务架构时，我们要整合各个公司或组织的开源软件，而且某些开源软件又有多种选择，这导致在做技术选型的初期，需要花费大量的时间进行预备研、分析和实验，这些方案的整合没有得到充分的测试，可能在实践中会遇到各种各样的问题。

　　Spring Cloud的出现，可以说是为微服务架构迎来一缕曙光，有SpringCloud社区的巨大支持和技术保障，让我们实施微服务架构变得异常简单了起来，它不像我们之前所列举的框架那样，只是解决微服务中的某一个问题，而是一个解决微服务架构实施的综合性解决框架，它整合了诸多被广泛实践和证明有效的框架作为实施的基础组件，又在该体系基础上创建了一些非常优秀的边缘组件将它们很好地整合起来。加之Spring Cloud 有其Spring 的强大技术背景，极高的社区活跃度，也许未来Spring Cloud会成为微服务的标准技术解决方案。

### CAP原则

　　CAP 原则又称 CAP 定理，指的是在一个分布式系统中具有以下其中两个特性：

- **Consistency （一致性）**
- **Availability （可用性）**
- **Partition tolerance（分区容错性）**

　　CAP 由 Eric Brewer 在 2000 年 PODC 会议上提出。该猜想在提出两年后被证明成立，成为我们熟知的 CAP 定理。**CAP 三者不可兼得。**

| 特性                | 定理                                                         |
| :------------------ | :----------------------------------------------------------- |
| Consistency         | 也叫做数据原子性，系统在执行某项操作后仍然处于一致的状态。在分布式系统中，更新操作执行成功后所有的用户都应该读到最新的值，这样的系统被认为是具有强一致性的。等同于所有节点访问同一份最新的数据副本。 |
| Availability        | 每一个操作总是能够在一定的时间内返回结果，这里需要注意的是"一定时间内"和"返回结果"。一定时间内指的是，在可以容忍的范围内返回结果，结果可以是成功或者是失败。 |
| Partition tolerance | 在网络分区的情况下，被分隔的节点仍能正常对外提供服务(分布式集群，数据被分布存储在不同的服务器上，无论什么情况，服务器都能正常被访问)。 |

　　现如今，对于多数大型互联网应用的场景，主机众多、部署分散，而且现在的集群规模越来越大，节点只会越来越多，所以节点故障、网络故障是常态，因此分区容错性也就成为了一个分布式系统必然要面对的问题。那么就只能在 C 和 A 之间进行取舍。但对于传统的项目就可能有所不同，拿银行的转账系统来说，涉及到金钱的对于数据一致性不能做出一丝的让步，C 必须保证，出现网络故障的话，宁可停止服务，可以在 A 和 P 之间做取舍。

　　总而言之，没有最好的策略，好的系统应该是根据业务场景来进行架构设计的，只有适合的才是最好的。

## 二、SpringCloud Netflix

### Eureka注册中心

* #### 简介

　　Eureka 是 Netflix 开发的服务发现组件，本身是一个基于 REST 的服务。Spring Cloud 将它集成在其子项目 Spring Cloud Netflix 中，实现 Spring Cloud 的服务注册与发现，同时还提供了负载均衡、故障转移等能力。

　　Eureka的架构图如下：

<img src="./../assets/img/java/Eureka架构图.jfif" alt="Eureka架构图" style="zoom:67%;" />

* #### 案例

参考链接：

1、[Spring Cloud 系列之 Netflix Eureka 注册中心（一） ](https://www.cnblogs.com/mrhelloworld/p/eureka1.html)

2、[Spring Cloud 系列之 Netflix Eureka 注册中心（二）](https://www.cnblogs.com/mrhelloworld/p/eureka2.html)

### Consul注册中心

* #### 简介

　　Consul 是 HashiCorp 公司推出的开源工具，用于实现分布式系统的服务发现与配置。与其它分布式服务注册与发现的方案，Consul 的方案更“一站式”，内置了服务注册与发现框架、分布一致性协议实现、健康检查、Key/Value 存储（配置中心）、多数据中心方案，不再需要依赖其它工具（比如 ZooKeeper 等），使用起来也较为简单。

　　Consul 使用 Go 语言编写，因此具有天然可移植性（支持Linux、Windows 和 Mac OS）；安装包仅包含一个可执行文件，方便部署，与 Docker 等轻量级容器可无缝配合。

* #### 案例

1、[Spring Cloud 系列之 Consul 注册中心（一）](https://www.cnblogs.com/mrhelloworld/p/consul1.html)

### Ribbon负载均衡

* #### 简介

　　Ribbon 是一个基于 HTTP 和 TCP 的 **客户端负载均衡工具**，它是基于 Netflix Ribbon 实现的。它不像 Spring Cloud 服务注册中心、配置中心、API 网关那样独立部署，但是它几乎存在于每个 Spring Cloud 微服务中。包括 Feign 提供的声明式服务调用也是基于该 Ribbon 实现的。Ribbon 默认提供很多种负载均衡算法，例如轮询、随机等等。甚至包含自定义的负载均衡算法。

　　目前业界主流的负载均衡方案可分成两类：

- 集中式负载均衡（服务器负载均衡），即在 consumer 和 provider 之间使用独立的负载均衡设施(可以是硬件，如 F5，也可以是软件，如 nginx)，由该设施负责把访问请求通过某种策略转发至 provider；
- 进程内负载均衡（客户端负载均衡），将负载均衡逻辑集成到 consumer，consumer 从服务注册中心获知有哪些地址可用，然后自己再从这些地址中选择出一个合适的 provider。Ribbon 属于后者，它只是一个类库，集成于 consumer 进程，consumer 通过它来获取 provider 的地址。

* #### 案例

参考链接：

1、[Spring Cloud 系列之 Netflix Ribbon 负载均衡](https://www.cnblogs.com/mrhelloworld/p/ribbon.html)

### Feign服务调用

* #### 简介

　　Feign 是 Spring Cloud Netflix 组件中的一个轻量级 RESTful 的 HTTP 服务客户端，实现了负载均衡和 Rest 调用的开源框架，**封装了 Ribbon 和 RestTemplate**，实现了 WebService 的面向接口编程，进一步降低了项目的耦合度。Feign 本身并不支持 Spring MVC 的注解，它有一套自己的注解，为了更方便的使用，Spring Cloud 孵化了 OpenFeign，OpenFeign 是 Spring Cloud 在 Feign 的基础上支持了 Spring MVC 的注解，如 `@RequesMapping`、`@Pathvariable` 等等。。

　　Feign 旨在使编写 JAVA HTTP 客户端变得更加容易，Feign 简化了 RestTemplate 代码，实现了 Ribbon 负载均衡，使代码变得更加简洁，也少了客户端调用的代码，使用 Feign 实现负载均衡是首选方案。**只需要你创建一个接口，然后在上面添加注解即可。**

　　Feign 是声明式服务调用组件，其核心就是：**像调用本地方法一样调用远程方法，无感知远程 HTTP 请求。**

- 它解决了让开发者调用远程接口就跟调用本地方法一样的体验，开发者完全感知不到这是远程方法，更感知不到这是个 HTTP 请求。无需关注与远程的交互细节，更无需关注分布式环境开发。
- 它像 Dubbo 一样，Consumer 直接调用 Provider 接口方法，而不需要通过常规的 Http Client 构造请求再解析返回数据。

　　Feign 的使用方式是：使用 Feign 的注解定义接口，调用这个接口，就可以调用服务注册中心的服务。

* #### 案例

1、[Spring Cloud 系列之 Feign 声明式服务调用（一）](https://www.cnblogs.com/mrhelloworld/p/feign1.html)

### Hystrix服务容错

* #### 简介

　　在微服务架构中，一个请求需要调用多个服务是非常常见的。如客户端访问 A 服务，而 A 服务需要调用 B 服务，B 服务需要调用 C 服务，由于网络原因或者自身的原因，如果 B 服务或者 C 服务不能及时响应，A 服务将处于阻塞状态，直到 B 服务 C 服务响应。此时若有大量的请求涌入，容器的线程资源会被消耗完毕，导致服务瘫痪。服务与服务之间的依赖性，故障会传播，造成连锁反应，会对整个微服务系统造成灾难性的严重后果，这就是服务故障的**“雪崩”效应**。

　　雪崩是系统中的蝴蝶效应导致，其发生的原因多种多样，从源头我们无法完全杜绝雪崩的发生，但是雪崩的根本原因来源于服务之间的强依赖，所以我们可以提前评估做好服务容错。解决方案大概可以分为以下几种：

- 请求缓存：支持将一个请求与返回结果做缓存处理；
- 请求合并：将相同的请求进行合并然后调用批处理接口；
- 服务隔离：限制调用分布式服务的资源，某一个调用的服务出现问题不会影响其他服务调用；
- 服务熔断：牺牲局部服务，保全整体系统稳定性的措施；
- 服务降级：服务熔断以后，客户端调用自己本地方法返回缺省值。

* #### 案例

1、[Spring Cloud 系列之 Netflix Hystrix 服务容错（一）](https://www.cnblogs.com/mrhelloworld/p/hystrix1.html)

2、[Spring Cloud 系列之 Netflix Hystrix 服务容错（二）](https://www.cnblogs.com/mrhelloworld/p/hystrix2.html)

3、[Spring Cloud 系列之 Netflix Hystrix 服务容错（三）](https://www.cnblogs.com/mrhelloworld/p/hystrix3.html)

### Hystrix服务监控

　　Hystrix 除了可以实现服务容错之外，还提供了近乎实时的监控功能，将服务执行结果和运行指标，请求数量成功数量等等这些状态通过 `Actuator` 进行收集，然后访问 `/actuator/hystrix.stream` 即可看到实时的监控数据。

　　具体案例见：[Spring Cloud 系列之 Netflix Hystrix 服务监控](https://www.cnblogs.com/mrhelloworld/p/hystrix-dashboard.html)

### Zuul服务网关

* #### 简介

　　微服务的应用可能部署在不同机房，不同地区，不同域名下。此时客户端（浏览器/手机/软件工具）想要请求对应的服务，都需要知道机器的具体 IP 或者域名 URL，当微服务实例众多时，这是非常难以记忆的，对于客户端来说也太复杂难以维护。此时就有了网关，客户端相关的请求直接发送到网关，由网关根据请求标识解析判断出具体的微服务地址，再把请求转发到微服务实例。这其中的记忆功能就全部交由网关来操作了。

　　网关具有身份认证与安全、审查与监控、动态路由、负载均衡、缓存、请求分片与管理、静态响应处理等功能。当然最主要的职责还是与“外界联系”。

　　Zuul 是 Netflix 开源的微服务网关，它可以和 Eureka、Ribbon、Hystrix 等组件配合使用。Zuul 的核心是一系列的过滤器，包含了对请求的**路由**和**过滤**两个最主要的功能。由于 Zuul 本身的设计是基于单线程的接收请求和转发处理，是阻塞 IO，不支持长连接。目前来看 Zuul 就显得很鸡肋，随着 Zuul 2.x 一直跳票（2019 年 5 月发布了 Zuul 2.0 版本），Spring Cloud 推出自己的 Spring Cloud Gateway。大意就是：Zuul 已死，Spring Cloud Gateway 永生（手动狗头）。

> info "提示"
>
> 常用网关解决方案有：
>
> `Nginx + Lua`、`Kong`、`Traefik`、`Spring Cloud Netflix Zuul`、`Spring Cloud Gateway`等。

* #### 案例

1、[Spring Cloud 系列之 Netflix Zuul 服务网关（一）](https://www.cnblogs.com/mrhelloworld/p/zuul1.html)

2、[Spring Cloud 系列之 Netflix Zuul 服务网关（二）](https://www.cnblogs.com/mrhelloworld/p/zuul2.html)

3、[Spring Cloud 系列之 Netflix Zuul 服务网关（三）](https://www.cnblogs.com/mrhelloworld/p/zuul3.html)

4、[Spring Cloud 系列之 Netflix Zuul 服务网关（四）](https://www.cnblogs.com/mrhelloworld/p/zuul4.html)

### Gateway服务网关

* #### 简介

　　Spring Cloud Gateway 作为 Spring Cloud 生态系统中的网关，目标是替代 Netflix Zuul，其不仅提供统一的路由方式，并且还基于 Filter 链的方式提供了网关基本的功能。

* #### 案例

1、[Spring Cloud 系列之 Gateway 服务网关（一）](https://www.cnblogs.com/mrhelloworld/p/gateway1.html)

2、[Spring Cloud 系列之 Gateway 服务网关（二）](https://www.cnblogs.com/mrhelloworld/p/gateway2.html)

3、[Spring Cloud 系列之 Gateway 服务网关（三）](https://www.cnblogs.com/mrhelloworld/p/gateway3.html)

4、[Spring Cloud 系列之 Gateway 服务网关（四）](https://www.cnblogs.com/mrhelloworld/p/gateway4.html)

### Sleuth链路追踪

* #### 简介

　　随着微服务架构的流行，服务按照不同的维度进行拆分，一次请求往往需要涉及到多个服务。互联网应用构建在不同的软件模块集上，这些软件模块，有可能是由不同的团队开发、可能使用不同的编程语言来实现、有可能布在了几千台服务器，横跨多个不同的数据中心。因此，就需要一些可以帮助理解系统行为、用于分析性能问题的工具，以便发生故障的时候，能够快速定位和解决问题。**在复杂的微服务架构系统中，几乎每一个前端请求都会形成一个复杂的分布式服务调用链路**。

　　随着业务规模不断增大、服务不断增多以及频繁变更的情况下，面对复杂的调用链路就带来一系列问题：

- 如何快速发现问题？
- 如何判断故障影响范围？
- 如何梳理服务依赖以及依赖的合理性？
- 如何分析链路性能问题以及实时容量规划？

　　**而链路追踪的出现正是为了解决这种问题，它可以在复杂的服务调用中定位问题，还可以在新人加入后台团队之后，让其清楚地知道自己所负责的服务在哪一环。**

　　除此之外，如果某个接口突然耗时增加，也不必再逐个服务查询耗时情况，我们可以直观地分析出服务的性能瓶颈，方便在流量激增的情况下精准合理地扩容。

　　Spring Cloud Sleuth 为 Spring Cloud 实现了分布式跟踪解决方案。兼容 Zipkin，HTrace 和其他基于日志的追踪系统，例如 ELK（Elasticsearch 、Logstash、 Kibana）。

* #### 案例

　　Spring Cloud Sleuth的原理和案例参考以下链接：

1、[Spring Cloud 系列之 Sleuth 链路追踪（一）](https://www.cnblogs.com/mrhelloworld/p/sleuth1.html)

### Stream消息驱动

* #### 简介

　　在实际开发过程中，服务与服务之间通信经常会使用到消息中间件，消息中间件解决了应用解耦、异步处理、流量削锋等问题，实现高性能，高可用，可伸缩和最终一致性架构。不同中间件内部实现方式是不一样的，这些中间件的差异性导致我们实际项目开发给我们造成了一定的困扰，比如项目中间件为 Kafka，如果我们要替换为 RabbitMQ，这无疑就是一个灾难性的工作，一大堆东西都要重做，因为它跟我们系统的耦合性非常高。**这时我们可以使用 Spring Cloud Stream 来整合我们的消息中间件，降低系统和中间件的耦合性。**

　　Spring Cloud Stream 是用于构建消息驱动微服务应用程序的框架。该框架提供了一个灵活的编程模型，该模型建立在已经熟悉 Spring 习惯用法的基础上，它提供了来自多家供应商的中间件的合理配置，包括 publish-subscribe，消息分组和消息分区处理的支持。

　　Spring Cloud Stream 解决了开发人员无感知的使用消息中间件的问题，因为 Stream 对消息中间件的进一步封装，可以做到代码层面对中间件的无感知，甚至于动态的切换中间件，使得微服务开发的高度解耦，服务可以关注更多自己的业务流程。

* #### 案例

1、[Spring Cloud 系列之 Stream 消息驱动（一）](https://www.cnblogs.com/mrhelloworld/p/stream1.html)

### Config配置中心

* #### 简介

　　随着微服务系统的不断迭代，整个微服务系统可能会成为一个**「网状结构」**，这个时候就要考虑整个微服务系统的**「扩展性、伸缩性、耦合性」**等等。其中一个很重要的环节就是**「配置管理」**的问题。

　　常规配置管理解决方案的缺点是：

- 硬编码（需要修改代码、繁琐、风险大）
- properties 或者 yml（集群环境下需要替换和重启）
- xml（重新打包和重启）

　　由于常规配置管理有很大的缺点，所以采用 Spring Cloud Config **「集中式」**的配置中心来管理**「每个服务」**的配置信息。Spring Cloud Config 在微服务分布式系统中，采用 **「Server 服务端」**和 **「Client 客户端」**的方式来提供可扩展的配置服务。服务端提供配置文件的存储，以接口的形式将配置文件的内容提供出去；客户端通过接口获取数据、并依据此数据初始化自己的应用。配置中心负责**「管理所有服务」**的各种环境配置文件，默认采用 `Git` 的方式存储配置文件，因此我们可以很容易的部署和修改，有助于环境配置进行版本管理。

* #### 案例

1、[Spring Cloud 系列之 Config 配置中心（一）](https://www.cnblogs.com/mrhelloworld/p/config1.html)

2、[Spring Cloud 系列之 Config 配置中心（二）](https://www.cnblogs.com/mrhelloworld/p/config2.html)

3、[Spring Cloud 系列之 Config 配置中心（三）](https://www.cnblogs.com/mrhelloworld/p/config3.html)

### Consul配置中心

* #### 简介

　　Spring Cloud Config 虽然提供了配置中心的功能，但是需要配合 git、svn 或外部存储（例如各种数据库），且需要配合 Spring Cloud Bus 实现配置刷新。

　　Spring Cloud Consul 作为 Spring Cloud 官方推荐替换 Eureka 注册中心的方案，可以使用 Consul 提供的配置中心功能，并且不需要额外的 git 、svn、数据库等配合，且无需配合 Bus 即可实现配置刷新。

* #### 案例

1、[Spring Cloud 系列之 Consul 配置中心](https://www.cnblogs.com/mrhelloworld/p/consul-config.html)

### Bus消息总线

* #### 简介

　　Spring Cloud Bus 是 Spring Cloud 体系内的消息总线，用来连接分布式系统的所有节点。

　　Spring Cloud Bus 将分布式的节点用轻量的消息代理（RibbitMQ、Kafka）连接起来。可以通过消息代理广播配置文件的更改，或服务之间的通讯，也可以用于监控。解决了微服务数据变更，及时同步的问题。

　　微服务一般都采用集群方式部署，而且在高并发下经常需要对服务进行扩容、缩容、上线、下线的操作。比如我们需要更新配置，又或者需要同时失效所有服务器上的某个缓存，需要向所有相关的服务器发送命令，此时就可以选择使用 Spring Cloud Bus 了。总的来说，就是在我们需要把一个操作散发到所有后端相关服务器的时候，就可以选择使用 Spring Cloud Bus 了。

* #### 案例

1、[Spring Cloud 系列之 Bus 消息总线](https://www.cnblogs.com/mrhelloworld/p/bus.html)