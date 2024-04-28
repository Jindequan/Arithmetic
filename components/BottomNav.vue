<template>
	<view class="bottom_group">123
		<view class="bottom_bar_wrapper">
			<view :class="['bar_item home', homeClass]" @click="handleJump('/views/Index')">首页</view>
			<view :class="['bar_item', secondClass, jobClass]" @click="handleJump(secondTo)">{{ secondText }}</view>
			<view :class="['bar_item', thirdClass, resumeClass]" @click="handleJump(thirdTo)">{{ thirdText }}</view>
			<view :class="['bar_item user', userClass]" @click="handleJump(mineTo)">我的</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		name: 'BottomNav',
		data() {
			return {
				secondClass: 'job',
				secondText: '职位',
				secondTo: '/views/JobList',

				thirdClass: 'resume',
				thirdText: '人才',
				thirdTo: '/views/ResumeList',

				mineTo: '/personal/PersonalIndex',

				homeClass: '',
				userClass: '',
				jobClass: '',
				resumeClass: '',
				bottomHeight: 0
			};
		},
		computed: {
			...mapState(['LoginType', 'LoginOrNot', 'isNew'])
		},
		watch: {
			LoginOrNot(val) {
				this.updataButtonNav();
			},
			isNew(val) {
				if (val) {
					console.log('有新未读消息 === 底部导航栏显示红点')
				}
			}
		},
		created() {
			let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
			let currentPath = routes[routes.length - 1].route // 获取当前页面路由，也就是最后一个打开的页面路由
			if (this.$store.state.LoginOrNot) {
				if (currentPath == 'views/Index') {
					this.homeClass = 'home-ac';
				} else if (currentPath == 'personal/PersonalIndex' || currentPath == 'company/CompanyIndex' ||
					currentPath == 'member/Home') {
					this.userClass = 'user-ac';
				} else if (currentPath == 'views/JobList') {
					if (parseInt(this.$store.state.LoginType) == 1) {
						this.resumeClass = 'job-ac'
					} else {
						this.jobClass = 'job-ac';
					}
				} else if (currentPath == 'views/ResumeList') {
					if (parseInt(this.$store.state.LoginType) === 1) {
						this.jobClass = 'resume-ac';
					} else {
						this.resumeClass = 'resume-ac'
					}
				} else if (currentPath == 'im/imList') {
					this.resumeClass = 'im-ac';
				}
			} else {
				if (currentPath == 'views/Index') {
					this.homeClass = 'home-ac';
				} else if (currentPath == 'personal/PersonalIndex' || currentPath == 'company/CompanyIndex' ||
					currentPath == 'member/Home') {
					this.userClass = 'user-ac';
				} else if (currentPath == 'views/JobList') {
					this.jobClass = 'job-ac';
				} else if (currentPath == 'views/ResumeList') {
					this.resumeClass = 'resume-ac';
				}
			}

			uni.getSystemInfo({
				success: res => {
					this.bottomHeight = res.screenHeight - res.safeArea.bottom;
				},
				fail(err) {
					this.bottomHeight = 0;
				}
			});
		},
		mounted() {
			this.updataButtonNav();
		},
		methods: {
			handleJump(path) {
				uni.reLaunch({
					url: path
				});
			},
			updataButtonNav() {
				// 根据登录会员类型，处理导航显示
				if (this.LoginOrNot) { //********* 2023.09.08修改： 是否登录点击会员中心都可跳转
					if (parseInt(this.LoginType) === 1) {
						// 企业
						this.secondClass = 'resume';
						this.secondText = '人才';
						this.secondTo = '/views/ResumeList';
						// #ifdef MP-ALIPAY
						this.thirdClass = 'job';
						this.thirdText = '职位';
						this.thirdTo = '/views/JobList';
						// #endif
						// #ifdef MP-TOUTIAO || MP-WEIXIN
						this.thirdClass = 'im';
						this.thirdText = '消息';
						this.thirdTo = '/im/imList';
						// #endif
						this.mineTo = '/company/CompanyIndex';
					} else {
						// 个人
						this.secondClass = 'job';
						this.secondText = '职位';
						this.secondTo = '/views/JobList';
						// #ifdef MP-ALIPAY
						this.thirdClass = 'resume';
						this.thirdText = '人才';
						this.thirdTo = '/views/ResumeList';
						// #endif
						// #ifdef MP-TOUTIAO || MP-WEIXIN
						this.thirdClass = 'im';
						this.thirdText = '消息';
						this.thirdTo = '/im/imList';
						// #endif
						this.mineTo = '/personal/PersonalIndex';
					}
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.bottom_group {
		position: relative;
		width: 100%;
		height: 110rpx;
		// height: calc(env(safe-area-inset-bottom) + 110rpx);
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		box-sizing: content-box;

		.bottom_bar_wrapper {
			height: calc(env(safe-area-inset-bottom) + 110rpx);
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: #ffffff;
			display: flex;
			z-index: 100;
			box-sizing: border-box;
			box-shadow: 0 -8rpx 20rpx 0rpx rgba(0, 0, 0, 0.08);

			.bar_item {
				flex: 1;
				font-size: 20rpx;
				padding: 73rpx 0 13rpx;
				text-align: center;
				color: #aeaeae;

				&.home {
					background-image: url('../static/img/bottomNav/home.png');
					background-size: 64rpx 64rpx;
					background-repeat: no-repeat;
					background-position: center 18rpx;
				}

				&.home-ac {
					background-image: url('../static/img/bottomNav/home-ac.png');
					background-size: 64rpx 64rpx;
					background-repeat: no-repeat;
					background-position: center 18rpx;
					color: #3f7eff;
				}

				&.job {
					background-image: url('../static/img/bottomNav/job.png');
					background-size: 64rpx 64rpx;
					background-repeat: no-repeat;
					background-position: center 21rpx;
				}

				&.job-ac {
					background-image: url('../static/img/bottomNav/job-ac.png');
					background-size: 64rpx 64rpx;
					background-repeat: no-repeat;
					background-position: center 21rpx;
					color: #3f7eff;
				}

				&.resume {
					background-image: url('../static/img/bottomNav/resume.png');
					background-size: 64rpx 64rpx;
					background-repeat: no-repeat;
					background-position: center 21rpx;
				}

				&.resume-ac {
					background-image: url('../static/img/bottomNav/resume-ac.png');
					background-size: 64rpx 64rpx;
					background-repeat: no-repeat;
					background-position: center 21rpx;
					color: #3f7eff;
				}

				&.im {
					background-image: url('../static/img/bottomNav/im.png');
					background-size: 64rpx 64rpx;
					background-repeat: no-repeat;
					background-position: center 21rpx;
				}

				&.im-ac {
					background-image: url('../static/img/bottomNav/im-ac.png');
					background-size: 64rpx 64rpx;
					background-repeat: no-repeat;
					background-position: center 21rpx;
					color: #3f7eff;
				}

				&.user {
					background-image: url('../static/img/bottomNav/user.png');
					background-size: 64rpx 64rpx;
					background-repeat: no-repeat;
					background-position: center 18rpx;
				}

				&.user-ac {
					background-image: url('../static/img/bottomNav/user-ac.png');
					background-size: 64rpx 64rpx;
					background-repeat: no-repeat;
					background-position: center 18rpx;
					color: #3f7eff;
				}
			}
		}
	}
</style>