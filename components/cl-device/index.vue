<template>
	<view>
		<u-swipe-action  :index="index"  :show="item.show"  @content-click="contentClick"
					v-for="(item, index) in devices" :key="item.deviceId" @open="open" :options="options"
					@click="click" >
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
			click(index, index1) {
				if(index1 == 0) {
					
					this.$emit('naviOperate',index);
				}else if(index1 == 1) {
					
					this.$emit('devUpdate',index);
				}else {
					
					this.$emit("delDev",index);
				}			
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index) {
				this.$emit("openDev",index);
			},
			contentClick(index){
				this.$emit("contentClick",index);
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
