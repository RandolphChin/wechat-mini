<template>
	<view>
		<view class="u-flex u-row-center">
			<view class="u-font-xl header-style">{{ device.deviceName}}</view>
			<view class="u-m-l-25">
				<view v-if="device.status == 1"><u-icon name="wifi" color="#2979ff" size="38"></u-icon></view>
				<view v-else ><u-icon name="wifi-off" size="38"></u-icon></view>
			</view>
		</view>
		<view class="u-p-l-30 u-p-r-30">
			<view class="u-font-xl header-style"><text>设备操作</text></view>
			<view class="u-flex u-row-around u-m-t-10">
				<view>
					<u-button type="success" size="medium" :loading="openLoading" @click="sendDeviceOrder(1)">开机</u-button>
				</view>
				<view>
					<u-button type="error" size="medium" :loading="closeLoading" @click="sendDeviceOrder(0)">关机</u-button>
				</view>
						
			</view>
		</view>
		<view class="u-m-t-30">
			<u-line color="#efefef" />
		</view>
		<view class="u-p-l-30 u-p-r-30">
			<view class="u-font-xl header-style"><text>定时设置</text></view>
			<view>
				<view>
					<cl-datepicker :showSeconds=false :show="showPickerOpen" :type="type" :value="valueOpen" :show-tips="true" :show-seconds="true" @confirm="onSelectedOpen" @cancel="onSelectedOpen" />
					<cl-datepicker :showSeconds=false :show="showPickerClose" :type="type" :value="valueClose" :show-tips="true" :show-seconds="true" @confirm="onSelectedClose" @cancel="onSelectedClose" />
				</view>
						
			</view>
				<view class="u-flex u-row-right">
					<u-button type="primary" size="mini"  @click="addShow">添加定时</u-button>
				</view>
			
				<view v-if="addTab == true">
					<view>
						<u-cell-group>
								<u-cell-item :arrow=false icon="setting-fill" :title="titleOpen" @click="settingOpen('time')" value="开机时间" ></u-cell-item>
								<u-cell-item :arrow=false icon="setting-fill" :title="titleClose" @click="settingClose('time')" value="关机时间"></u-cell-item>
							</u-cell-group>
					</view>
					<view class="u-flex u-row-right">
						<view class="u-m-r-30">
							<u-icon name="arrow-upward" color="#2979ff" size="35" @click="hideAddTab"></u-icon>
						</view>
						<u-button type="success" size="mini" @click="addSchedule" >确认</u-button>
					</view>
				</view>
				<view class="u-m-t-20">
					<cl-character :quartzs="quartzs" @openQuartz="openQuartz" @delOperate="delOperate"></cl-character>
				</view>
		</view>
	</view>
</template>

<script>
import ws from '@/common/websocket/ws.js';
	
export default {
	data() {
		return {
			device:{},
			showPickerOpen: false,
			showPickerClose: false,
			type: 'rangetime',
			valueOpen: '',
			valueClose: '',
			titleOpen:'点击设置开机时间',
			titleClose:'点击设置关机时间',
			addTab: false,
			quartzs:[],
			openLoading:false,
			closeLoading:false
			
		}
	},
	onLoad() {
		this.device = this.$Route.query.device;
		this.initQuartz();
		console.log('onload');
	},
	destroyed() {
		console.log('destroy');
	    this.disconnect()
	  },
	  mounted() {
		  console.log('monunt');
		this.connect();
	  },
	methods: {
		onSelectedOpen(e) {//选择
			this.showPickerOpen = false;
			if(e) {
				this[this.type] = e.value; 
				//选择的值
				this.titleOpen = e.value;
				this.valueOpen = e.value;
			}
		},
		onSelectedClose(e) {//选择
			this.showPickerClose = false;
			if(e) {
				this[this.type] = e.value; 
				//选择的值
				this.titleClose = e.value;
				this.valueClose = e.value;
			}
		},
		settingOpen(type){
			this.type = type;
			this.showPickerOpen = true;
			this.valueOpen = this[type];
		},
		settingClose(type){
			this.type = type;
			this.showPickerClose = true;
			this.valueClose = this[type];
		},
		addShow(){
			this.addTab = true;
		},
		addSchedule(){
			let groupNameOpen = this.$store.state.userInfo.user.openid;
			let jobClassOpen = 'com.gitee.coadmin.modules.quartz.task.DeviceOpenTask';
			let paramOpen ={'deviceId':this.device.deviceId+'','deviceOrder': '1'}
			let cronArrOpen =['*','*','?','*'];
			const openTimeArr = this.valueOpen.split(':');
			cronArrOpen.unshift(openTimeArr[0]);
			cronArrOpen.unshift(openTimeArr[1]);
			cronArrOpen.unshift('0');
			let cronExpressionOpen =cronArrOpen.join(' '); //  0 15 08 * * ? *
			
			let groupNameClose = this.$store.state.userInfo.user.openid;
			let jobClassClose = 'com.gitee.coadmin.modules.quartz.task.DeviceCloseTask';
			let paramClose ={'deviceId':this.device.deviceId+'','deviceOrder': '0'}
			let cronArrClose =['*','*','?','*'];
			const closeTimeArr = this.valueClose.split(':');
			cronArrClose.unshift(closeTimeArr[0]);
			cronArrClose.unshift(closeTimeArr[1]);
			cronArrClose.unshift('0');
			let cronExpressionClose =cronArrClose.join(' '); //  0 15 08 * * ? *
			
			let cronInfo = {};
			cronInfo.jobNameOpen = this.device.deviceId;
			cronInfo.groupNameOpen=groupNameOpen;
			cronInfo.jobClassOpen=jobClassOpen;
			cronInfo.paramOpen=JSON.stringify(paramOpen);
			cronInfo.cronExpressionOpen=cronExpressionOpen;
			cronInfo.jobNameClose = this.device.deviceId;
			cronInfo.groupNameClose=groupNameClose;
			cronInfo.jobClassClose=jobClassClose;
			cronInfo.paramClose=JSON.stringify(paramClose);
			cronInfo.cronExpressionClose=cronExpressionClose;
			
			this.$api.quartz.create(
				cronInfo
			).then(res => {
				let newJob={};
				newJob.deviceId =this.device.deviceId;
				newJob.status = true;
				newJob.show=false;
				newJob.cronExpressionOpen=this.valueOpen;
				newJob.cronExpressionClose=this.valueClose;
				this.quartzs.unshift(newJob);
				uni.showToast({
					icon: "none",
					title: '添加成功',
					mask: true,
					duration: 2000
				});
			}).catch( err => {
				console.log('invoke error');
			})
		},
		initQuartz(){
			this.$api.quartz.getAllByDeviceId(
				{'deviceId':this.device.deviceId}
			).then(res => {
				this.quartzs = res;
			});
		},
		openQuartz(index) {
			// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
			// 原本为'false'，再次设置为'false'会无效
			this.quartzs[index].show = true;
			this.quartzs.map((val, idx) => {
				if(index != idx) this.quartzs[idx].show = false;
			})
		},
		hideAddTab(){
			this.addTab =false
		},
		delOperate(index){
			uni.showModal({
			          title: '提示',
			          content: '您确定删除吗？',
			          success: (res)=> {
			            if (res.confirm) {
			             this.$api.quartz.deleteQuartz(
			             	this.quartzs[index]
			             ).then(res => {
			             	this.quartzs.splice(index, 1);
			             })
			            }
			          }
			        });
			
		},
		sendDeviceOrder(order){
			let orderInfo={};
			orderInfo.device_id=this.device.deviceId;
			orderInfo.device_order=order;
			if(order ==1){
				this.openLoading = true;
			}else{
				this.closeLoading = true;
			}
				
			this.$api.device.sendDeviceOrder(
				orderInfo
			).then(res => {
				if(order ==1){
					this.openLoading = false;
				}else{
					this.closeLoading = false;
				}
				uni.showToast({
					icon: "none",
					title: '发送成功',
					mask: true,
					duration: 2000
				});
			})
		},
		connect() {
			ws.connect();
			ws.subscribe("/topic/deviceOperate",  k => {
				const messageResponse = JSON.parse(k.body)
				console.log('-----');
				if(this.device.deviceId == messageResponse.device_id){
					this.device.status=messageResponse.device_status 
				}
			})
		},
		disconnect() {
			ws.disconnect();
		}
	}
}
</script>

<style scoped lang="scss">	
.header-style {
	font-weight: bold;
}
.tev {
	background-color:  #000000;
}
</style>