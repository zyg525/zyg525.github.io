---
title: Java面试题——Servlet
tags: Java面试题
---

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

　　**GET**：请求参数通过?拼接在URL后面，大小有限制，不能放敏感信息。

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