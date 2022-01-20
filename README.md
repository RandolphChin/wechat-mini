# 介绍
微信脚手架项目，基于 [惊悚的毛毛虫](https://gitee.com/ChenMuShan/uniapp-template)的uniapp-template项目
微信配网参考 [liwei16611](https://blog.csdn.net/liwei16611/article/details/81133191)
### 添加功能
1. 微信登录(微信登录后，后台返回token和用户信息给微信客户端)
2. 访问权限页面A时，未登录则跳转至登录页面，登录成功后自动跳转至A页面
3. 页面到底部之后加载数据(onReachBottom)，页面下拉到底后动态加载下一页滚动翻页(示例userInfo.vue)
4. 添加 Websocket 实时显示设备状态(StompJs)
5. 微信 smartConfig 配网、softAP 配网

## 主架构 uniapp

###	介绍 
-	组件使用easycom模式 cl-*(可在pages里面修改)

###	plugins  
-	路由 ->  [uni-simple-router](https://hhyang.cn/v2/)
-	ui框架 ->  [uview](http://uviewui.com/)
-	api请求 ->  [uview自带api请求](http://uviewui.com/js/http.html)
-	图标 ->  [Iconfont](https://www.iconfont.cn/)

###	项目结构

```
├─common
│  ├─config 			// 环境配置 (设置baseurl等)
│  ├─http.api 			// 请求接口
│  ├─extend 			// 扩展原型方法
│  ├─filters 			// 全局过滤器
│  ├─tools 				// 全局公共方法
│  ├─router 			// 路由文件
│  └─http.interceptor 	// 拦截器
├─components
│  ├─cl-test			// easycom测试组件 (示例使用可删除)
│  └─cl-icon			// iconfont图标库
├─store			
│  ├─$u.mixin			// 混入方法
│  └─index				// vuex
└─uview-ui				// uview
```

###	Iconfont 注意事项

1. 在阿里矢量图标库创建项目
2. 添加你所需要使用的图标文件
3. 下载文件到本地后替换components/cl-icon里面的文件


### Iconfont示例

iconfont库中修改示例:

![avatar](https://z3.ax1x.com/2021/07/19/WJa9w6.png)

代码示例:

```
	<cl-icon type="test" size="30" color="#000000"></cl-icon>
```


### 依赖安装

安装之前请移除下载后自带的package.json 使用下面代码安装依赖即可运行

```
npm init -y
npm i uni-simple-router uni-read-pages
npm install
```
### store 使用
```
// 下面这些值仅为示例，使用过程中请删除
	state: {
		/**
		 * 如果上面从本地获取的lifeData对象下有对应的属性，就赋值给state中对应的变量
		 * 加上vuex_前缀，是防止变量名冲突，也让人一目了然
		 */
		vuex_userInfo: lifeData.vuex_userInfo ? lifeData.vuex_userInfo : '',
		vuex_openid: lifeData.vuex_openid ? lifeData.vuex_openid : '',
		vuex_token: lifeData.vuex_token ? lifeData.vuex_token : '',
		vuex_phone: lifeData.vuex_phone ? lifeData.vuex_phone : '',

		// 如果vuex_version无需保存到本地永久存储，无需lifeData.vuex_version方式
		vuex_version: '1.0.0',
	}
	
	取值方法  this.$store.state.token  或者 Vue.prototype.$store.state.token
	设置方法  this.$u.vuex('user.name', '史诗')


```
