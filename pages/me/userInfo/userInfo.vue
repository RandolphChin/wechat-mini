<template>
	<div class="vbox">
		<view class="top">
			<view class="circle">
				<image v-if="userInfo" class="head" :src="userInfo.user.avatar" mode="widthFix"></image>
				<open-data v-else type="userAvatarUrl"></open-data>
			</view>
			<view class="top-texts">
				<text class="name">{{userInfo.user.nickname}}</text>
			</view>
		</view>
		
		<view class="logNotic">
			<view class="u-font-xl u-m-t-20">操作日志</view>
		</view>
		<view>
				<view class="u-flex u-row-between u-m-35">
						<view>
							设备名称
						</view>
						<view class="u-m-l-25">
							状态
						</view>
						<view class="u-m-l-25">
							时间
						</view>
						<view class="u-m-l-25">
							命令
						</view>
				</view>
				<u-line class="u-m-t-20" color="#e8e8e8" />
			<view v-for="(item, index) in logs" :key="item.id" :index="index">
				<view class="u-flex u-row-between u-m-35 u-font-sm">
					<view>
						{{item.deviceName}}
					</view>
					<view class="u-m-l-25">
						<text v-if="item.status == 1">成功</text>
						<text v-else-if="item.status == 0">失败</text>
						<text v-else>处理中</text>
					</view>
					<view class="u-m-l-25">
						{{item.createTime}}
					</view>
					<view class="u-m-l-25">
						<text v-if="item.deviceOrder">开</text>
						<text v-else>关</text>
					</view>
				</view>
			</view>
							
			<u-loadmore :status="loadMoreStatus" />
		</view>
<!-- 
		<view class="footer" style="width:80%;;">
			<button type="warn" @click="logout">退出登录</button>
		</view> -->
	</div>
</template>

<script>
import ws from '@/common/websocket/ws.js'	
	export default {
		data() {
		        return {
					page:0,
					size:15,
					logs:[],
					loadMoreStatus: 'loadmore' // 加载前值为loadmore，加载中为loading，没有数据为nomore
		        }
		    },
			onReachBottom() {
				//上拉动作
				this.getLogs();
			},
			// 下拉动作
			onPullDownRefresh (){
				this.refresh();
			},
			onLoad() {
				// this.getLogs();
			},
			mounted(){
				this.connect();
			},
			onShow() {
				this.refresh();
			},
		methods: {
			upper: function(e) {
			            console.log(e)
			},
			lower: function(e) {
				console.log(e)
			},
			scroll: function(e) {
				console.log(e)
				this.old.scrollTop = e.detail.scrollTop
			},
			logout() {
				uni.showModal({
					title: '提示',
					content: '确认退出登陆？',
					success: function(res) {
						if (res.confirm) {
							uni.removeStorage({
								key: 'token',
								success(res) {
									uni.redirectTo({
										url: '/pages/login/login'
									})
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});


			},
			getLogs(){
				var that = this;
				this.$api.device.queryDeviceLog(
					{
						page:that.page,
						size:that.size,
						sort: 'createTime,desc'
					}
				).then(res => {
					that.page = that.page + 1;
					if(res.content.length > 0){
						that.loadMoreStatus = 'loadmore'
						that.logs = that.logs.concat(res.content)
					}else{
						that.loadMoreStatus = 'nomore'
					}
				})
			},
			refresh(){
				this.page = 0;
				this.size = 15;
				this.logs=[];
				this.getLogs();
			},
			connect() {
				ws.connect();
				ws.subscribe("/topic/log",  k => {
					const messageResponse = JSON.parse(k.body)
					console.log(k.body);
					this.logs.filter(v => {
					              if (v.msgId === messageResponse.timestamp) {
										v.status =true
					              }
					              return v
					            })
				})
			},
			disconnect() {
				console.log('enter disconnet');
				ws.disconnect();
			}
		}
	}
</script>

<style scoped>
	.index {
		display: flex;
		flex-direction: column;
		width: 100%;
		background-color: white;
		border-top: 1px solid #cccccc;
	}

	.vbox {
		display: flex;
		flex-direction: column;
	}

	.top {
		display: flex;
		width: 100%;
		height: 120rpx;
		justify-content: center;
	}

	.circle {
	
		width: 120rpx;
		height: 120rpx;
		border: 10rpx solid #a4f4f6;
		border-radius: 150rpx;
		overflow: hidden;
	}

	.head {
		width: 110rpx;
		height: 110rpx;
		border-radius: 120rpx;
	}

	.top-texts {
		display: flex;
		flex-direction: column;
		align-self: flex-end;
		margin-left: 15rpx;
	}

	.name {
		font-size: 36rpx;
		font-weight: 500;
	}
	.logNotic{
		margin-left: 30rpx;
		align-self: flex-start;
		font-weight: bold;
	}
	
</style>
