<template>
	<view>
		<view class="u-p-20">
			<u-form :model="form" ref="uForm" :error-type="errorType" >
					<u-form-item label="WIFI" prop="ssid"><u-input  v-model="form.ssid" placeholder="点击这里选择 wifi" type="select" @click="showWifi()" /></u-form-item>
					<u-form-item label="密码" prop="password"><u-input placeholder="请填写 wifi 密码" v-model="form.password" /></u-form-item>
					<u-button type="success"  @click="transInfo()">提交</u-button>
			</u-form>
				<u-select v-model="show" :list="list" @confirm="choseWifi"  ></u-select>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					ssid: '',
					password: 'haikuikejiao'
				}, 
				errorType: ['toast'],
				rules: {
					ssid: [
						{ 
							required: true, 
							message: '请选择WIFI', 
							trigger: ['change','blur']
						}
					],
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
					udp: '',
					port: 0
				}
			}
		},
		onLoad() {
			this.initWifi();
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onShow() {
			console.log('enter wifi vue');
		},
		methods: {
			initWifi(){
				this.list = [];
				this.getWifiInfo();
			},
			transInfo() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						console.log('验证通过');
					} else {
						console.log('验证失败');
					}
				});
				this.sendWifi();
			},
			getWifiInfo() {
				var that = this;
				uni.startWifi({
				    success(res) {
				        console.log(res.errMsg, 'wifi初始化成功')
						that.wifiIsInit = true;
						uni.getWifiList({
							success(res){
								console.log('getWifiList ok');
								uni.onGetWifiList( r =>{
									console.log(JSON.stringify(r.wifiList));
									r.wifiList.forEach( v=>{
										let frequency = v.frequency.toString();
										let subText = '';
										if(frequency.startsWith('2')){
											subText = '2.4G';
										}else if(frequency.startsWith('5')){
											subText = '5G';
										}
										let obj ={'label': v.SSID + '                  (' + subText + ')','value':v.SSID};
										if(!that.list.includes(obj)){
											if(v.SSID){
												that.list.push(obj);
											}
										}
									});
								})
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
			showWifi(){
				if(!this.wifiIsInit){
					this.getWifiInfo();
				}
				this.show = true;
			},
			choseWifi(v){
				console.log(v);
				this.form.ssid = v[0].value;
			},
			sendWifi(){
				console.log('enter send wifi');
				
				            let udp = wx.createUDPSocket();
				              this.data.port =udp.bind();
							this.data.udp = udp;
				        const password = this.form.password;
				        const ssid = this.form.ssid;
				        const port = this.data.port;
				
				        let message = JSON.stringify({
				            'port':port,
				            'password':password,
				            'ssid':ssid
				        })
				
				        this.data.udp.send({
				            address: '255.255.255.255',
				            port: 10000,
				            message
				        });
				
				
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

</style>
