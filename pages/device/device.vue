<template>
	<view>
		<view class="u-flex u-row-right u-p-r-10">
			<u-button plain type="info" @click="preAdd()">添加设备</u-button>	
		</view>
		<view>
			<cl-device></cl-device>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
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
