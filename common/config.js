const CONFIG = {
	// 开发环境配置
	development: {
		//baseUrl: 'http://127.0.0.1:8100/wechat',
		baseUrl: 'https://wwe.com/wechat',
		//websocket: 'ws://127.0.0.1:8100/wechat/webSocket/wechat'
		websocket: 'wss://wwe.com/wechat/webSocket/wechat'
	},
	// 生产环境配置
	production: {
		baseUrl: 'https://wwe.com/wechat',
		websocket: 'wss://wwe.com/wechat/webSocket/wechat'
	}
}
export default CONFIG[process.env.NODE_ENV];
