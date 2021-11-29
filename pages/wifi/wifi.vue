<template>
	<view>
		<view class="u-p-20">
			<u-form :model="form" ref="uForm" :error-type="errorType" >
					<u-form-item label="WIFI" ><u-input  v-model="data.ssid" placeholder="点击这里选择 wifi" /></u-form-item>
					<u-form-item label="密码" ><u-input placeholder="请填写 wifi 密码" v-model="data.password" /></u-form-item>
					<u-button type="success"  @click="transInfo()">提交</u-button>
			</u-form>
		</view>

		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				errorType: ['toast'],
				rules: {
					password: [
						{
							required: true,
							message: '请填写 wifi 密码', 
							trigger: ['blur', 'change']
						}
					]
				},
				list: [],
				show: false,
				wifiIsInit: false,
				data: {
				        ssid: '',
				        password: '',
				        udp: '',
				        port: 0,
				        showClearBtn: false,
				        isFirst: true,
				    },
			}
		},
		onLoad() {
			this.initWifi();
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			initWifi(){
				this.list = [];
				this.getWifiInfo();
			},
			transInfo() {
				this.sendWifi();
				/* this.$refs.uForm.validate(valid => {
					if (valid) {
						console.log('验证通过');
						this.sendWifi();
					} else {
						console.log('验证失败');
					}
				}); */
			},
			getWifiInfo() {
				var that = this;
				uni.startWifi({
				    success(res) {
				        console.log(res.errMsg, 'wifi初始化成功')
						that.wifiIsInit = true;
						uni.getConnectedWifi({
							success(res){
								console.log("getConnectedWifi ok:", JSON.stringify(res))
								if ('getConnectedWifi:ok' === res.errMsg) {
									that.data.ssid = res.wifi.SSID
								} else {
									uni.showToast({
										title: '请连接路由器',
										duration: 2000,
										icon: 'none'
									})
								}
							}
						})
						console.log(that.list);
				    },
				    fail: function (res) {
				        wx.showToast({
				            title: '请连接路由器!',
				            duration: 2000,
				            icon: 'none'
				        })
						that.wifiIsInit = false;
				    }
				})
			},
			sendWifi(){
				        if (this.data.isFirst) {
				            let udp = wx.createUDPSocket();
				                this.data.isFirst=false;
				                this.data.udp=udp;
				                this.data.port=udp.bind();
				        }
				
				        const password = this.data.password;
				        const ssid = this.data.ssid;
				        const port = this.data.port;
				
				        let message = JSON.stringify({
				            port,
				            password,
				            ssid
				        })
				
				        this.data.udp.send({
				            address: '255.255.255.255',
				            port: 10000,
				            message
				        });
						this.show = true;
				        this.data.udp.onMessage((res) => {
				            //字符串转换，很重要
				            let unit8Arr = new Uint8Array(res.message);
				            let encodedString = String.fromCharCode.apply(null, unit8Arr);
				            let data = decodeURIComponent(escape((encodedString)));
				            console.log("data:", data);
				            let str = JSON.parse(data);
				            switch (str.code) {
				                //成功收到信息
				                case 0:
				                    wx.showToast({
				                        title: '接收成功',
				                    })
				                    break;
				                //成功解析到信息
				                case 1:
				                    wx.showToast({
				                        title: '准备连接路由器',
				                    })
				                    break;
				                //成功连接到路由器
				                case 2:
				                    wx.showToast({
				                        title: '成功连接',
				                    })
				                    break;
				                //连接失败路由器
				                case 3:
				                    wx.showToast({
				                        title: '连接失败',
				                    })
				                    break;
				            }
				        })
			}
			        
		}
	}
</script>

<style lang="scss" scoped>
.u-progress-content {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.u-progress-dot {
		width: 16rpx;
		height: 16rpx;
		border-radius: 50%;
		background-color: #fb9126;
	}
	
	.u-progress-info {
		font-size: 28rpx;
		padding-left: 16rpx;
		letter-spacing: 2rpx
	}
</style>
