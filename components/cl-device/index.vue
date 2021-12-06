<template>
	<view>
		<u-swipe-action  :index="index" 
					v-for="(item, index) in devices" :key="item.deviceId" :options="options"
					@click="click"  @open="open">
			<u-line color="#f5f5f5" />
			<view class="u-flex u-row-between u-m-25 ">
				<view class="u-line-2">
					<view class="u-font-xl deviceName" v-if="item.deviceName">{{ item.deviceName}}</view>
					<view class="u-font-xl" v-else>左滑修改设备名称</view>
					<view class="u-flex u-row-between u-m-t-10 u-font-xs">
						<view >编号</view>
						<view class="u-m-l-25">{{ item.deviceId}}</view>
					</view>
				</view>
				<view class="u-flex u-row-between">
					<view v-if="item.status == 1" class="u-font-lg"><u-icon name="wifi" color="#2979ff" size="38"></u-icon>
</view>
					<view v-else class="u-font-lg"><u-icon name="wifi-off" size="38"></u-icon></view>
				</view>
			</view>
			<u-line color="#f5f5f5" />
		</u-swipe-action>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				options: [
					{
						text: '操作',
						style: {
							backgroundColor: '#00aa00'
						}
					},
					{
						text: '修改',
						style: {
							backgroundColor: '#007aff'
						}
					},
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				],
				show: false
			}
		},
		props: {
			devices: {
				type: Array,
				default: () => {
					return [];
				}
			}
		},
		methods: {
			connectDevice(connectable,deviceId,deviceName,rssi) {
				this.$emit("connectDev",connectable,deviceId,deviceName,rssi);
			},
			click(index, index1) {
				if(index1 == 0) {
					console.log('setting');
					this.$emit('naviOperate',index);
				}else if(index1 == 1) {
					console.log('update');
					this.$emit('devUpdate',index);
				}else {
					console.log('del');
					this.$emit("delDev",index);
				}			
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				console.log(this.devices);
				this.devices[index].show = true;

				this.devices.map((val, idx) => {
					if(index != idx) {
					this.devices[idx].show = false;
					}
				})
				console.log(this.devices);
				// this.$emit('open',index);
			}
		}
	}
</script>

<style scoped lang="scss">	
.dev-signal {
	color: #55aa00;
}
.deviceName {
	font-weight: bold;
}
</style>
