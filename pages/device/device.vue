<template>
	<view>
		<view class="u-flex u-row-right u-p-r-10">
			<u-button plain type="info" @click="preAdd()">添加设备</u-button>	
		</view>
		<view>
			<cl-device :devices="devices" @delDev="delDev" @devUpdate="devUpdate" @naviOperate="naviOperate" @open="open"></cl-device>
		</view>
		<u-loadmore :status="status" />
		<u-popup v-model="popShow" mode="center" border-radius="20">
				<view class="u-m-25">
					<view>
					<u-input v-model="custDeviceName" :type="type" placeholder="请输入设备名称"/>
						
					</view>
					<view class="u-flex u-row-between u-m-t-20">
						<view>
							<u-button type="default" plain @click="cancelPop">取消</u-button>
						</view>
						<view>
							<u-button type="primary" plain @click="confirmUpdate" :loading="loaded">确定</u-button>
						</view>
					</view>
				</view>
			</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				devices: [],
				status: 'loadmore', // 加载前值为loadmore，加载中为loading，没有数据为nomore
				page: 0,
				size: 10,
				popShow: false,
				custDeviceName:'',
				type: 'text',
				loaded: false,
				chosedIndex: 0
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
			},
			delDev(index){
				let ids = [];
				ids.push(parseInt(this.devices[index].id));
				this.$api.device.deleteDevice(
					ids
				).then(res => {
					this.devices.splice(index, 1);
				})
			},
			devUpdate(index){
				this.popShow = true;
				this.custDeviceName =this.devices[index].deviceName;
				this.chosedIndex = index;
				console.log(this.chosedIndex);
			},
			cancelPop(){
				this.popShow = false;
			},
			confirmUpdate(){
				this.loaded = true;
				let choseDevice = this.devices[this.chosedIndex];
				choseDevice.deviceName = this.custDeviceName;
				this.$api.device.updateDeviceName(
					choseDevice
				).then(res => {
					this.loaded = false;
					this.popShow = false;
					uni.showToast({
									icon: "none",
									title: '修改成功',
									mask: true,
									duration: 2000
								});
				})
			},
			naviOperate(index){
				console.log(this.devices[index]);
				console.log('navagate');
				this.$Router.push({
					name: 'newpage',
					params: {
						device: this.devices[index]
					}
				});
			},
			open(index) {
				/* this.devices[index].show = true;
				this.devices.map((val, idx) => {
					this.devices[idx].show = true;
				})
				this.devices.map((val, idx) => {
					if(index != idx) {
					this.devices[idx].show = false;
					}
				}) */
			}
		}
	}
</script>

<style>

</style>
