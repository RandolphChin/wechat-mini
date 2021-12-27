<template>
	<view>
		<view class="u-m-l-25">
			<view>4G流程</view>
			<view class="u-m-t-10">1）与管理员联系,获取设备编码表。</view>
			<view>2）输入框内填写设备编码。</view>
			<view>3）点击连接设备。</view>
		</view>
		<view class="u-p-20">
			<view>
				<u-input v-model="deviceId" type="number" border="true" placeholder="请填写设备编码" clearable />
			</view>
			<view class="u-m-t-20">
				<u-button type="success"  @click="insertDevice">连接设备</u-button>
			</view>
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
				deviceId:null,
				addCode:'',
				lotusLoadingData: {
					isShow: false,
					text: '创建中...'
				},
				timeoutId:null
			}
		},
		onLoad() {
			console.log('onload');
			this.addDeviceCode();
		},
		methods: {
			insertDevice(){
				console.log('yee haw')
				this.lotusLoadingData.isShow = true;
				this.sendCreate();
			},
			addDeviceCode(){
				this.$api.device.getDeviceAddCode().then(res =>{
					this.addCode = res;
				})
			},
			sendCreate(){
				var that = this;
				var device ={};
				device.device_id=this.deviceId;
				device.device_owner=this.$store.state.userInfo.user.openid;
				device.add_code = this.addCode;
				this.$api.device.insertDevice(
					device
				).then(resp => {
					if(resp.status =="SUCCESS"){
						that.startSearch();
					}else if(resp.status =="ERROR"){
						this.lotusLoadingData.isShow = false;
						uni.showToast({
							icon: "none",
							title: resp.msg,
							mask: true,
							duration: 2000
						});
					}
				}).catch(e =>{
					this.lotusLoadingData.isShow = false;
					console.log(e);
					uni.showToast({
						icon: "none",
						title: resp.msg,
						mask: true,
						duration: 2000
					});
				})
			},
			checkDeviceCreate(){
				var that = this;
				this.$api.device.checkDeviceCreate({
					addCode:this.addCode
				}).then(resp=>{
					console.log(resp);
					if(resp == 1){
						that.lotusLoadingData.isShow = false;
						clearInterval(that.timeoutId);
						passJs.$emit('reGetDevice','prepare refresh device added');
						
						that.$refs.uToast.show({
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
					console.log(err);
				})
			},
			startSearch(){
				var that = this;
				this.timeoutId = setInterval(function(){
					that.checkDeviceCreate()
				}, 3000);
			}
		}
	}
</script>

<style>

</style>
