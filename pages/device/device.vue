<template>
	<view>
		<view class="u-flex u-row-right u-p-r-10">
			<u-button plain type="info" @click="connChose" size="mini">添加设备</u-button>	
		</view>
		<view>
			<u-select :default-value="matcherDefault" v-model="matcherShow" mode="single-column" :list="matcherList" @confirm="matcherConfirm" title="配网方式"></u-select>
		</view>
		<view>
			<cl-device :devices="devices" @delDev="delDev" @devUpdate="devUpdate" @naviOperate="naviOperate" @openDev="openDev" @contentClick="contentClick"></cl-device>
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
import passJs from '@/common/pass.js';
import ws from '@/common/websocket/ws.js'

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
				chosedIndex: 0,
				message:'',
				matcherShow: false,
				matcherList: [
					{
						value: '0',
						label: 'SmartConfig'
					},
					{
						value: '1',
						label: 'SoftAP'
					},
					{
						value: '2',
						label: '4G'
					}
				],
				matcherDefault:[0]
			}
		},
		onLoad() {
			this.getDevice();
		},
		onReachBottom() {
			//上拉动作
			this.getDevice();
		},
		// 下拉动作
		onPullDownRefresh (){
			
			this.refresh();
		},
		mounted() {
			var that = this;
			passJs.$on('reGetDevice',function(msg){
			
				that.refresh();
			})
			this.connect();
		},
		destroyed() {
			console.log('device disconnect');
		    this.disconnect()
		  },
		methods: {
			getDevice(){
				let that = this;
				this.$api.device.getDeviceList({
					page: that.page,
					size: that.size,
					sort: 'createTime,desc'
				}).then(res => {
					// 此处不需要校验code为200 请求拦截器中已判断
					that.page = that.page + 1
					if(res.content.length > 0){
						that.status = 'loadmore'
						that.devices = that.devices.concat(res.content)
					}else{
						that.status = 'nomore'
					}
				});
			},
			preSmartAdd(){
				this.$Router.push({
					name: 'smart'
				});
			},
			preWifiAdd() {
				this.$Router.push({
					name: 'wifi'
				});
			},
			pre4gAdd() {
				this.$Router.push({
					name: '4g'
				});
			},
			delDev(index){
				uni.showModal({
				  title: '提示',
				  content: '您确定删除吗？',
				  success: (res)=> {
					if (res.confirm) {
					 let ids = [];
					 ids.push(parseInt(this.devices[index].id));
					 this.$api.device.deleteDevice(
						ids
					 ).then(res => {
						this.devices.splice(index, 1);
						this.refresh();
					 })
					}
				  }
				});
			},
			devUpdate(index){
				this.popShow = true;
				this.custDeviceName =this.devices[index].deviceName;
				this.chosedIndex = index;
				
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
					this.devices[this.chosedIndex].show = true;
					this.devices[this.chosedIndex].show = false;
					uni.showToast({
						icon: "none",
						title: '修改成功',
						mask: true,
						duration: 2000
					});
				})
			},
			naviOperate(index){
				this.$Router.push({
					name: 'newpage',
					params: {
						device: this.devices[index]
					}
				});
			},

			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			openDev(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.devices[index].show = true;
				this.devices.map((val, idx) => {
					if(index != idx) this.devices[idx].show = false;
				})
			},
			contentClick(index){
				
				this.$Router.push({
					name: 'newpage',
					params: {
						device: this.devices[index]
					}
				});
			},
			refresh(){
				this.page = 0;
				this.size = 10;
				this.devices=[];
				this.getDevice();
			},
			connect() {
				ws.connect();
				ws.subscribe("/topic/device",  k => {
					const messageResponse = JSON.parse(k.body)
					this.devices.filter(v => {
					              if (v.deviceId === messageResponse.device_id) {
										v.status = (messageResponse.device_status == 1 ? true : false)
					              }
					              return v
					            })
				})
			},
			disconnect() {
				ws.disconnect();
			},
			connChose(){
				this.matcherShow = true;
			},
			matcherConfirm(e){
				console.log(e);
				this.matcherShow = false;
				this.matcherDefault[0] = e[0].value
				if(e[0].value == '0'){
					this.preSmartAdd();
				}else if(e[0].value == '1'){
					this.preWifiAdd();
				}else if(e[0].value == '2'){
					this.pre4gAdd();
				}
			}
		}
	}
</script>

<style>

</style>
