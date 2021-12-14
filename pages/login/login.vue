<template>
	<view class="v1">
		<view class="avatarUrl">
			<image v-if="userInfo" :src="userInfo.user.avatar" mode="widthFix"></image>
			<open-data v-else type="userAvatarUrl"></open-data>
		</view>
	
		<view class="content">
			<view class="v2"></view>
	
			<view v-if="isShowUserInfo" class="v3">申请获得以下权限</view>
			<view v-if="isShowUserInfo" class="v4">获取你的公开信息（昵称、头像等）</view>
	
			<button v-if="isShowUserInfo" @click="getUserProfile" class="u-reset-button u-flex u-row-center btn1" type="default">
				<u-icon size="40" name="weixin-fill"></u-icon>
				<text class="u-margin-left-10">微信登录</text>
			</button>
		</view>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				navUrl: '',
				code: '',
				redirect: undefined,
				isShowUserInfo: this.$store.state.userInfo ? false : true,
			}
		},
		methods: {
			getUserProfile() {
				let that = this;
				// 推荐使用uni.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
				// 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
				uni.getUserProfile({
					desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: (resp) => {
						//登录远程服务器
						if (that.code) {
							//登录远程服务器
							that.loginByWeixin(resp)
						} else {
							uni.login({
								success: function(resp) {
									if (resp.code) {
										that.code = resp.code
										that.loginByWeixin(resp)
									}
								}
							});
						}
					}
				})
			},
			loginByWeixin: function(userInfo) {
				let that = this;
				//登录远程服务器
				if (that.code) {
					this.$api.user.postUserLoginInfo({
						code: that.code,
						encryptedData: userInfo.encryptedData,
						errMsg: userInfo.errMsg,
						iv: userInfo.iv,
						rawData: userInfo.rawData,
						signature: userInfo.signature,
						userInfo: userInfo.userInfo
					}).then(res => {
						that.code = '';
						// 此处不需要校验code为200 请求拦截器中已判断
						this.$u.toast('获取数据成功');
						//存储用户信息
						this.$u.vuex('token', res.token)
						this.$u.vuex('userInfo', res.user)
						//uni.setStorageSync('userInfo', res.user);
						//uni.setStorageSync('token', res.token);
						
						uni.switchTab({
							url: that.navUrl
						})
					}).catch(err => {
						console.log(err)
						that.code = ''
					});
				}
			},
			h5Login(){
			}
		},
		onLoad: function(options) {
			let that = this;
			if (uni.getStorageSync("navUrl")) {
				that.navUrl = uni.getStorageSync("navUrl")
			} else {
				that.navUrl = '/pages/login/login'
			}
			uni.login({
				success: function(res) {
					if (res.code) {
						that.code = res.code
					}
				}
			});
		}
	}
</script>

<style lang="scss" scoped>
	.v1 {
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #ffffff;
		padding-top: 100rpx;
	}

	.avatarUrl {
		width: 200rpx;
		margin: 0 auto;
		height: 200rpx;
		border-radius: 50%;
		overflow: hidden;
		border: 4rpx solid #fff;
		box-shadow: 0rpx 0rpx 10rpx $u-light-color;
		
		image {
			width: 200rpx;
		}
	}

	.content {
		width: 84%;
		margin: 0 auto;
	}

	.v2 {
		width: 100%;
		margin-top: 70rpx;
		height: 2rpx;
		background: $u-border-color;
	}

	.v3 {
		margin-top: 50rpx;
		font-weight: 600;
		font-size: 34rpx;
		color: $u-main-color;
	}

	.v4 {
		margin: 30rpx 0 80rpx 0;
		font-size: 28rpx;
		color: $u-tips-color;
	}

	.btn1 {
		margin-bottom: 24rpx;
		background: #808003;
		color: #fff;
		height: 90rpx;
		border-radius: 90rpx;
	}
</style>
