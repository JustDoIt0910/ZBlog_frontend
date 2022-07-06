# SpringBoot 简单个人博客(前端部分)

### 后端使用 SpringBoot框架， 采用 SpringSecurity 作权限控制, 前端使用 vue

#### 博客前台采用的是 [fengziy](https://gitee.com/fengziy) 大佬的 [Gblog 一款nice的基于 vue 的博客模板](https://gitee.com/fengziy/Gblog.git) 
#### 这里特别感谢

#### [后端部分的仓库地址](https://github.com/JustDoIt0910/ZBlog)

### Zblog 项目结构
- backend  --- 博客后端
    - config --- SpringSecurity 配置, redis 配置, MP分页拦截器, 跨域配置
    - controller --- 控制器
    - dto --- 数据传输用的 Bean
    - filter --- jwt 过滤器
    - mapper --- dao 层
    - pojo --- 实体类
    - service --- service 层
    - utils --- jwt, redis, 七牛云等工具类
- frontend --- 前端
    - admin --- 管理页面
    - blog --- 博客前台

[部署地址](http://asilentboy.cn)

![img1](https://github.com/JustDoIt0910/MarkDownPictures/blob/main/zblog1.jpg)

![img2](https://github.com/JustDoIt0910/MarkDownPictures/blob/main/zblog2.jpg)

![img3](https://github.com/JustDoIt0910/MarkDownPictures/blob/main/zblog3.jpg)