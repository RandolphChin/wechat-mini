<template>
	<view>
		<view class="u-flex u-row-center">
			<view>{{ device.deviceName}}</view>
			<view class="u-m-l-25">
				<view v-if="device.status == 1"><u-icon name="wifi" color="#2979ff" size="38"></u-icon></view>
				<view v-else ><u-icon name="wifi-off" size="38"></u-icon></view>
			</view>
		</view>
		<view class="u-p-l-30 u-p-r-30">
			<view class="u-font-xl header-style"><text>基本操作</text></view>
			<view class="u-m-t-10">
				<u-line color="#efefef" />
			</view>
			<view class="u-flex u-row-around u-m-t-10">
				<view>
					<u-button type="success" size="medium">开机</u-button>
				</view>
				<view>
					<u-button type="error" size="medium">关机</u-button>
				</view>
						
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			device:{}
				
			
		}
	},
	onLoad() {
		this.device = this.$Route.query.device;
		console.log(this.device);
	},
	methods: {
		
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