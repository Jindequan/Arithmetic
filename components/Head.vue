<template>
	<view class="headWrapper" :style="{marginBottom: navHeight + statusBarHeight + 30 + 'px'}">
		<view :style="{ height:fiexdHeight +'px',marginBottom: '30rpx'}"></view>
		<view class="fiexd fiexdHead isFiexdShadow">
			<view class="header-wrap" :style="{
				height: navHeight + 'px', 
				paddingTop: statusBarHeight + 'px',
				paddingLeft: '30rpx'
				}">
				
				<view class="detailHead" :style="{width:publicWidthInfo.width}">
					<view class="leftIcon" :style="{width:publicWidthInfo.iconWidth}">
						<view class="back" @click="goBack"></view>
						<view class="home" @click="goIndex"></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"Head",
		data() {
			return {
				navHeight: '',
				statusBarHeight: '',
				menuButtonPaddingRight: '',
				menuButtonWidth: '',
				publicWidthInfo: {},
			};
		},
		created() {
			uni.getSystemInfo({
				success: (res) => {
					const menuButton = uni.getMenuButtonBoundingClientRect() // 胶囊
					const {
						windowWidth,
						windowHeight
					} = uni.getSystemInfoSync(); // 屏幕信息
					const navBarPadding = (menuButton.top - res.statusBarHeight) * 2
					let statusBarHeight = res.statusBarHeight
					let navHeight = menuButton.height + navBarPadding
					let headerHeight = navHeight + statusBarHeight
					this.menuButtonPaddingRight = windowWidth - menuButton.right
					this.menuButtonWidth = menuButton.width
					this.navHeight = headerHeight
					this.statusBarHeight = statusBarHeight
					// 详情页面宽度 
					this.publicWidthInfo = {
						width: (windowWidth - this.menuButtonPaddingRight - this.menuButtonWidth - this
							.menuButtonPaddingRight) + 'px',
						titleWidth: ((windowWidth - this.menuButtonPaddingRight - this
								.menuButtonWidth - this.menuButtonPaddingRight) - this
							.menuButtonWidth) + 'px',
						iconWidth: this.menuButtonWidth - 30 + 'px',
						height: this.navHeight + 'px'
					}	
				}
			})
		},
		methods: {
			goBack() {
				var pages = getCurrentPages(); // 获取当前挂载的路由数组
				var prePage = pages[pages.length - 1] //获取 上一个页面
				uni.navigateBack({
					delta: 1
				})
			},
			goIndex() {
				uni.reLaunch({
					url: '/pages/index/index'
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.headWrapper {
		position: relative;
	}

	.fiexd {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		z-index: 999;
	}

	.isFiexdShadow {
		background: #fff;
		box-shadow: 0 8rpx 20rpx 0rpx rgba(0, 0, 0, 0.08);
	}

	.navPlaceholder {
		background: transparent;
	}

	.header-wrap {
		width: 100%;
		position: relative;
		background: transparent;

		.detailHead {
			height: 100%;
			display: flex;
			align-items: center;

			&.whiteBg {
				background: #fff;
			}
		}

		.companyDetailHead {
			background: #fff;
		}

		.leftIcon {
			flex-shrink: 0;
			display: flex;
			align-items: center;

			.back {
				width: 50rpx;
				height: 50rpx;
				background: url('../static/back.png') no-repeat center center;
				background-size: 17rpx 30rpx;
				margin-right: 20rpx;

				&.whiteBack {
					background: url('../static/backWhite.png') no-repeat center center;
					background-size: 17rpx 30rpx;
				}
			}

			.home {
				width: 50rpx;
				height: 50rpx;
				background: url('../static/home.png') no-repeat center center;
				background-size: 34rpx 34rpx;

				&.whiteHome {
					background: url('../static/homeWhite.png') no-repeat center center;
					background-size: 34rpx 34rpx;
				}
			}
		}
	}
</style>