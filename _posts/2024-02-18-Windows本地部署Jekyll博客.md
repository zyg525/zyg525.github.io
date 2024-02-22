---
layout: post
title: Windows本地部署Jekyll博客
tags: 软件安装
categories: 十、软件安装
---



## 1、安装 Ruby + DevKit

　　安装网址：https://rubyinstaller.org/downloads/，安装最新版本即可，安装过程中保持默认设置。

## 2、安装Jekyll

　　打开CMD命令行，更换gem源

```shell
gem sources --remove https://rubygems.org/
gem sources -a https://gems.ruby-china.org
gem sources -l
gem sources -u
```

　　安装Jekyll

```shell
gem install Jekyll
```

　　输入`Jekyll -v`确认安装完成。

## 3、启动调试

　　进入你博客所在的文件夹，打开配置文件`_config.yml`，找到  `plugins: [jekyll-paginate-v2....]`，打开CMD命令行依次安装所有插件

```shell
gem install jekyll-paginate-v2
...
```

　　启动项目

```
jekyll s
```

　　访问https://127.0.0.1:4000查看博客。

　

参考链接：

1、[Windows下本地调试:基于GitHub Pages + Jekyll 创建的个人博客](https://destinyenvoy.github.io/2020/01/16/Windows%E4%B8%8B%E6%9C%AC%E5%9C%B0%E8%B0%83%E8%AF%95%E5%8D%9A%E5%AE%A2/)