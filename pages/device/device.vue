<template>
	<view>
		<view class="u-flex u-row-right u-p-r-10">
			<u-button plain type="info" @click="preAdd()">添加设备</u-button>	
		</view>
		<view>
			<cl-device :devices="devices"></cl-device>
		</view>
		<u-loadmore :status="status" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				devices: [],
				status: 'loadmore', // 加载前值为loadmore，加载中为loading，没有数据为nomore
				page: 0,
				size: 10
			}
		},
		onLoad() {
			this.getDevice();
		},
		onReachBottom() {
			this.getDevice()
		},
		methods: {
			getDevice(){
				let that = this;
				this.$api.device.getDeviceList({
					page: that.page,
					size: that.size
				}).then(res => {
					// 此处不需要校验code为200 请求拦截器中已判断
					that.$u.toast('获取数据成功');
					that.page = that.page + 1
					if(res.content.length > 0){
						that.status = 'loadmore'
						that.devices = that.devices.concat(res.content)
					}else{
						that.status = 'nomore'
					}
				});
			},
			preAdd() {
				this.$Router.push({
					name: 'wifi',
					params: {
						deviceId: 'deviceId'
					}
				});
			}
		}
	}
</script>

<style>

</style>
