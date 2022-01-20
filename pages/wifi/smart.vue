<template>
	<view>
		<view class="u-m-l-25">
			<view>配网流程</view>
			<view class="u-m-t-10">1）打开GPS定位。</view>
			<view>2）连接到家庭路由器2.4G频段网络，打开小程序。</view>
			<view>3）点击"添加设备",选择 SmartConfig 方式。</view>
			<view>4）输入家庭路由器的 Wifi密码,点击连接设备。</view>
		</view>
		<view class="u-p-20">
			<u-form :model="form" ref="uForm" :error-type="errorType" >
					<u-form-item label="WIFI" ><u-input  v-model="data.ssid" placeholder="自动获取 Wifi 名称..." /></u-form-item>
					<u-form-item label="密码" ><u-input placeholder="请填写 wifi 密码" v-model="data.password" /></u-form-item>
					<u-button type="success"  @click="transInfo()">连接设备</u-button>
			</u-form>
			<cl-loading :lotusLoadingData="lotusLoadingData"></cl-loading>
		</view>
			<u-toast ref="uToast" />
		
	</view>
</template>

<script>
import passJs from '@/common/pass.js';	
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
				wifiIsInit: false,
				data: {
				        ssid: '',
				        password: '',
				        udp: '',
				        port: 0,
				        showClearBtn: false,
				        isFirst: true,
				    },
				addCode:'',
				lotusLoadingData: {
					isShow: false,
					text: '创建中...'
				},
				timeoutId:null,
				udpTimeoutId:null,
				codeTransferTimeoutId:null
			}
		},
		onLoad() {
			this.initWifi();
		},
		onUnload() {
			clearInterval(this.timeoutId);
			clearInterval(this.udpTimeoutId);
			clearInterval(this.codeTransferTimeoutId);
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
			},
			getWifiInfo() {
				var that = this;
				uni.authorize({
					scope: 'scope.userLocation',
					success() {
						uni.getLocation({
							type: 'wgs84',
							success: function (res) {
								uni.startWifi({
									success(res) {
										that.wifiIsInit = true;
										uni.getConnectedWifi({
											success(res){
												if ('getConnectedWifi:ok' === res.errMsg) {
													that.data.ssid = res.wifi.SSID;
												} else {
													uni.showToast({
														title: '请连接路由器',
														duration: 2000,
														icon: 'none'
													})
												}
											},
											fail(res){
												uni.showToast({
													title: '请打开GPS定位',
													duration: 4000,
													icon: 'none'
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
							fail(r){
								console.log('------ location ---err--' +r);
								uni.showToast({
									title: '请打开GPS定位',
									duration: 4000,
									icon: 'none'
								})
							}
						});
					},
					fail(){
						console.log('------ refuse -----');
					}
				});
								
				
			},
			sendWifi(){
				        if (this.data.isFirst) {
				            let udp = wx.createUDPSocket();
				                this.data.isFirst=false;
				                this.data.udp=udp;
				                this.data.port=udp.bind();
				        }
				
				        let message = this.generateOrigMsg();
				        this.udpMsg(message);
						this.intervalUdp();
						this.lotusLoadingData.isShow = true;
						var that = this;
						this.data.udp.onMessage((res) => {
							//字符串转换，很重要
							let unit8Arr = new Uint8Array(res.message);
							let encodedString = String.fromCharCode.apply(null, unit8Arr);
							let data = decodeURIComponent(escape((encodedString)));
							console.log("data:", data);
							let str = JSON.parse(data);
							if(str.status =='SUCCESS'){
								wx.showToast({
									title: '接收成功',
								})
								clearInterval(that.udpTimeoutId);
								// 获取 add_code,并 UDP 给设备
								that.addDeviceCode();
								that.intervalCode();
								that.startSearch();
							}
							
					})
			},
			addDeviceCode(){
				this.$api.device.getDeviceAddCode().then(res =>{
					this.addCode = res;
				})
			},
			checkDeviceCreate(){
				var that = this;
				this.$api.device.checkDeviceCreate({
					addCode:this.addCode
				}).then(resp=>{
					if(resp == 1){
						this.lotusLoadingData.isShow = false;
						clearInterval(that.timeoutId);
						clearInterval(that.udpTimeoutId);
						clearInterval(that.codeTransferTimeoutId);
						passJs.$emit('reGetDevice','prepare refresh device added');
						
						this.$refs.uToast.show({
							title: '创建成功',
							type: 'success',
							isTab: true,
							duration: 3000,
							url: '/pages/device/device'
						})
				
					}else{
						console.log('next loop');
					}
				}).catch(err=>{
					console.log('err');
				})
			},
			startSearch(){
				var that = this;
				this.timeoutId = setInterval(function(){
					that.checkDeviceCreate()
				}, 3000);
			},
			udpMsg(msg){
				console.log(msg);
				this.data.udp.send({
				    address: '255.255.255.255',
				    port: 10000,
				    message: msg
				});
				var msgArr =msg.split("");
				// begin  length as 200
				// gutter length as 210
				// end	length as 220
				var beginMsg =this.formatStringLen('1',200);
				this.data.udp.send({
				    address: '255.255.255.255',
				    port: 10000,
				    message: beginMsg
				});
				this.data.udp.send({
				    address: '255.255.255.255',
				    port: 10000,
				    message: beginMsg
				});
				msgArr.forEach( k =>{
					/* 
						 var gutter=this.formatStringLen('0',230);
						 this.data.udp.send({
							 address: '255.255.255.255',
							 port: 10000,
							 message: gutter
						 });
					 */
						let content =k.charCodeAt(0);
						var contentMsg=this.formatStringLen('3',content);
						this.data.udp.send({
							address: '255.255.255.255',
							port: 10000,
							message: contentMsg
						});
				})
				var endMsg =this.formatStringLen('2',220);
				this.data.udp.send({
					address: '255.255.255.255',
					port: 10000,
					message: endMsg
				}); 
				this.data.udp.send({
					address: '255.255.255.255',
					port: 10000,
					message: endMsg
				}); 
			},
			formatStringLen(strVal, len, padChar){
			  padChar = padChar || "1";
			  if (!strVal) {
			    return padChar.repeat(len);
			  } else {
			    const strLen = strVal.length;
			    if (strLen > len){
			      return strVal.substring(0, len);
			    } else if (strLen < len){
			      return strVal.padEnd(len, padChar);
			    }else{
			      return strVal;
			    }
			  }
			},
			intervalUdp(){
				var that = this;
				this.udpTimeoutId = setInterval(function(){
					let message = that.generateOrigMsg();
					that.udpMsg(message);
				}, 10000);
			},
			generateOrigMsg(){
				const password = this.data.password;
				const ssid = this.data.ssid;
				const deviceOwner = this.$store.state.userInfo.user.openid;
				let message = JSON.stringify({
				    'password':password,
				    'ssid':ssid,
					'port': this.data.port
				})
				return message;
			},
			intervalCode(){
				var that = this;
				this.codeTransferTimeoutId = setInterval(function(){
					that.transferAddCode();
				}, 6000);
			},
			transferAddCode(){
				const deviceOwner = this.$store.state.userInfo.user.openid;
				let message = JSON.stringify({
				    'add_code': this.addCode,
					'device_owner':deviceOwner,
					'port': this.data.port
				})
				this.data.udp.send({
				    address: '255.255.255.255',
				    port: 10000,
				    message: message
				});
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
