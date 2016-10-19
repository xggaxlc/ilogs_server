https://github.com/xggaxlc/ilogs_server

#### ilogs
一个简单的博客API服务(多用户，角色管理)，

使用此API的后台管理APP[ilogs_admin](https://github.com/xggaxlc/ilogs_admin)(angularjs1.x,markdown)

#### 安装

1. 安装 [nodejs](https://nodejs.org/en/ "nodejs") >= 6.0
2. 安装 [Mongodb](https://www.mongodb.com/)
	**windows下，安装成功后需要手动在c盘根目录建立 /data/db**
	**windows下需要手动启动mongod服务，打开CMD,输入 `mongod`**
3. clone或者下载源代码
4. 进入源码根目录，`npm install`
5. 复制 `/config/environment/index.default.js` 重命名 `index.js`

````
// /config/environment/index.js
  env: process.env.NODE_ENV, //运行环境，不要手动修改
  port: process.env.PORT || 9000, //运行端口，不要手动修改
  ip: process.env.IP || '0.0.0.0', //IP配置，不要手动修改
  seedDB: false,
  secrets: {
    sha1: 'this_is_my_sha1_secret',  //密码的sha1签名，必须要改
    jwt: 'this_is_my_jwt_secret' //jsonwebtoken签名, 必须要改
  },
  tokenExpires: '7d', //Eg: 60, "2 days", "10h", "7d" //token有效期
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },
  mail: {  //发信邮件配置
    service: '', //qq, gmail, icloud ...
    auth: {
      user: '',  //邮件用户名
      pass: ''  //密码
    }
  },
  upload: {
    folderName: 'upload',  //上传的目录名字
    maxSize: 5  //最大上传支持，单位M
  }
````
#### 开发
1. 进入源码根目录
2. `npm start` 没有nodemon命令请执行`npm install nodemon -g`

#### 部署
* 使用PM2部署（推荐）
1. `npm install pm2 -g` [pm2](https://github.com/Unitech/pm2)
2. 重命名 `process.default.json` 为 `process.json`

````javascript
// process.json
//更多配置参考pm2文档
{
  "name": "ilogs_server", //app名字，随便改
  "script": "app.js", 
  "instances" : "max", 
  "exec_mode": "cluster",
  "env": {
    "IP": "0.0.0.0", //填写服务器IP
    "PORT": 9000, //运行端口
    "NODE_ENV": "production" //production环境
  },
  "log_file": "log.log", //log文件名
  "error_file": "error.log", //错误log文件名
  "log_date_format": "YYYY-MM-DD HH:mm Z", //log时间格式化
  "watch": ["api","components", "config", "router", "app.js"] //不需要监测代码变动自动重启服务器可以设置为false
}
````
3. `pm2 start process.json`, pm2会监控你的app，app进程挂了会自动重启
4. `pm2 list` 查看正在运行的node服务

* 手动部署(不推荐)
1. windows下
	1. `npm install forever -g` // [forever](https://github.com/foreverjs/forever) 
	2. `set NODE_ENV=production` //默认development
	3. `set PORT=9000` //默认用9000端口
	4. `set IP=xxx.xxx.xxx.xxx` //设置服务器IP
	5. `forever start app.js` 
2. linux下
	1. `npm install forever -g`
	2. `export NODE_ENV=production`
	3. `export PORT=9000`
	4. `export IP=xxx.xxx.xxx.xxx`
	5. `forever start app.js`

#### License: MIT
