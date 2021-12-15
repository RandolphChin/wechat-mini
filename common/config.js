const CONFIG = {
	// 开发环境配置
	development: {
		baseUrl: 'http://127.0.0.1:8100',
		// baseUrl: 'https://hkwis.com/wechat',
		websocket: 'ws://127.0.0.1:8100/webSocket/wechat'
		//websocket: 'wss://hkwis.com/wechat/webSocket/wechat'
	},
	// 生产环境配置
	production: {
		baseUrl: 'https://hkwis.com/wechat',
		websocket: 'wss://hkwis.com/wechat/webSocket/wechat'
	}
}
export default CONFIG[process.env.NODE_ENV];
