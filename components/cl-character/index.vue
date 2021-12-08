<template>
	<view>
		<u-swipe-action  :index="index"  :show="item.show"
					v-for="(item, index) in quartzs" :key="item.cronExpressionOpen" @open="open" :options="options"
					@click="click" >
			<u-line color="#f5f5f5" />
			<view class="u-flex u-row-around u-m-25 ">
				<view class="u-flex u-row-around">
					<view class="u-flex u-row-between">
						<view class="u-font-xl deviceName">{{ item.cronExpressionOpen}}</view>
						<view class="u-font-xs u-m-l-10">开</view>
					</view>
					<view class="u-flex u-row-between u-m-l-35">
						<view class="u-font-xl deviceName">{{ item.cronExpressionClose}}</view>
						<view class="u-font-xs u-m-l-10">关</view>
					</view>
				</view>
				
				<view class="u-flex u-row-between u-m-r-45">
						<view v-if="item.status == 1" class="u-flex u-row-between">
							<view><u-icon name="play-circle" color="#2979ff" size="38"></u-icon></view>
							<view>运行中</view>
						</view>
						<view v-else >
							<view><u-icon name="pause-circle" size="38"></u-icon></view>
							<view>已暂停</view>
						</view>
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
			quartzs: {
				type: Array,
				default: () => {
					return [];
				}
			}
		},
		methods: {
			click(index, index1) {
				if(index1 == 0) {
					this.$emit('delOperate',index);
				}		
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index) {
				this.$emit("openQuartz",index);
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
