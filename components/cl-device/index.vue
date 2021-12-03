<template>
	<view>
		<u-swipe-action  :index="index" 
					v-for="(item, index) in devices" :key="item.deviceId" 
					@click="click" @open="open">
					
			<view class="u-flex u-row-between">
				<view class="u-line-2">
					<view class="u-font-xl" v-if="item.name">{{ item.name}}</view>
					<view class="u-font-xl" v-else>左滑修改设备名称</view>
					<view class="u-flex u-row-between u-m-t-20">
						<view class="dev-signal">{{ item.RSSI }}</view>
						<view class="u-m-l-25">{{ item.deviceId}}</view>
					</view>
				</view>
				<view class="u-flex u-row-between">
					<view v-if="item.connectable" class="u-font-lg dev-signal">On Service</view>
					<view v-else class="u-font-lg">No services</view>
					<view class="u-m-l-20">></view>
				</view>
			</view>
		</u-swipe-action>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
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
			}
		}
	}
</script>

<style scoped lang="scss">	
.dev-signal {
	color: #55aa00;
}
</style>
