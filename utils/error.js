import store from '@/store'
import {
	toAddResumeByForm,
	toAddComInfoForm
} from '@/utils/index.js'
export default function handlerHttpError(res) {
	switch (res.code) {
		case 50001: // 非法token
			if (res.message) {
				uni.showToast({
					title: res.message,
					icon: 'none'
				})
			}
			break
		case 50002: // token失效
		case 50009: // 需要登录
		case 50011:
			if (res.message) {
				uni.showToast({
					title: res.message,
					icon: 'none'
				})
			}
			uni.removeStorageSync('loginInfo');
			store.commit('setLoginState', {
				whether: false,
				utype: 0,
				token: '',
				mobile: '',
				userIminfo: {}
			})
			uni.redirectTo({
				url: '/member/Login'
			})
			break
		case 50003: // 请先填写企业资料
			console.log('error:完善企业资料')
			uni.setStorageSync('toCompleteResume', false)
			uni.setStorageSync('toCompleteCompanyInfo', true)
			toAddComInfoForm()
			break
		case 50004: // 企业未认证，强制认证
			if (res.message) {
				uni.showToast({
					title: res.message,
					icon: 'none'
				})
			}
			uni.redirectTo({
				url: '/company/AccountManage/Auth'
			})
			break
		case 50005: // 请先完善简历
			if (res.message) {
				uni.showToast({
					title: res.message,
					icon: 'none'
				})
			}
			uni.redirectTo({
				url: '/personal/EditResume'
			})
			break
		case 50006: // 第三方登录时验证结果：未绑定
			// router({ path: '/member/bind', query: res.data })
			break
		case 50007: // 请先注册简历（引导到简历注册页) 
			console.log('error:完善简历')
			uni.setStorageSync('toCompleteCompanyInfo', false)
			uni.setStorageSync('toCompleteResume', true)
			toAddResumeByForm()
			// uni.redirectTo({
			// 	url: '/personal/PersonalIndex'
			// })
			break
		case 50008: // 暂时关闭网站
			// router({path:'/error?message=' + res.data})
			break
		case 60001: // 禁止访问
			// router({path:'/ipdeny'})
			break
		case 50010:
            // uni.showToast({
            //     title: res.message,
            //     icon: 'error'
            // })
			break
		default:
			if (res.message) {
				uni.showToast({
					title: res.message,
					icon: 'none'
				})
			}
			break
	}
}