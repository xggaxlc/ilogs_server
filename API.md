**API服务器返回JSON格式数据**

**header || query || body || params 携带正确的 token 值表示用户已经登陆(推荐在header设置token)**

````
//header
{
  "token": "",
  "Content-Type": "application/json;utf-8"
}
````
---
必须登录 &&

登陆可选（返回内容可能不同） ||

**只要登陆就会进行API权限检测**
**master用户不会检测权限**

---
## 状态码
* 201 已创建，用于创建了新资源
* 204 无内容, 用于删除成功
* 401 需要登录
* 403 没有权限
* 404 不存在的API接口或者资源不存在或者资源被删除

---
## 基础url: `'http://ip:port/'`
---
## 文章
* **GET** `/post` ||
* **GET** `/post/:id` ||
* **POST** `/post` &&
* **PUT** `/post` && *修改自己的文章不需要检查权限*
* **DELETE** `/post/:id` && *删除自己的文章不需要检查权限*
---
## 用户
* **GET** `/user` ||
* **GET** `/user/:id` ||
* **POST** `/user` &&
* **PUT** `/user` &&  *只有MASTER用户能修改角色字段,修改自己的资料不需要验证权限, 用户被第三者修改会收到邮件提醒*
* **DELETE** `/user/:id` &&
---
## 分类
* **GET** `/category` ||
* **GET** `/category/:id` ||
* **POST** `/category` &&
* **PUT** `/category` &&
* **DELETE** `/category/:id` &&
---
## 角色
* **GET** `/role` &&
* **GET** `/role/:id` && *如果id === 'template',则返回空的角色表*
* **POST** `/role` &&
* **PUT** `/role` && *修改角色将导致所有使用此角色的用户下线*
* **DELETE** `/role/:id` &&
---
## 统计
* **GET** `/statistics/category` &&
* **GET** `/statistics/user` &&
* **GET** `/statistics/role` &&
* **GET** `/statistics/post` &&
---
## 日志

* **GET** `/log` &&
* **GET** `/log/:id` &&
---
## 上传
* **POST** `/upload/image` &&
* **DELETE** `/upload/:filename` &&
---
## 设置
* **GET** `/setting` &&
* **POST** `/setting` &&
---
## 邀请用户
* **POST** `/invite` &&

---
## 登陆
* **POST** `/sign/signin`

---
## 注册
* **POST** `/sign/signup`  *被邀请用户（需要token）才能注册（除了第一个用户可以直接注册为master）*

---
## 请求重置密码
* **POST** `/sign/resetPass`

---
## 重置密码
* **PUT** `/sign/resetPass`

---