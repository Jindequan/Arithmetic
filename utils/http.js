
import store from '@/store'
import handlerHttpError from './error.js'
export default {
	post(url, data) {
		return new Promise(function(resolve, reject) {
			uni.request({
				method: 'POST',
				url: store.state.baseURL + url,
				data: data,
				header:{ 
					'user-token': store.state.userToken,
					'platform': store.state.platform
				},
				success(res) {
					if(res.data.code != 200){
						handlerHttpError(res.data)
					}
					resolve(res)
				},
				fail(err) {
					reject(err)  
				}
			}) 
		})
	},
	get(url, data) {
		return new Promise(function(resolve, reject) {
			uni.request({
				method: 'GET',
				url: store.state.baseURL + url,
				data: data,
				header:{
					'content-type': 'application/x-www-form-urlencoded',
					'user-token': store.state.userToken,
					'platform': store.state.platform
				},
				success(res) {
					if(res.data.code != 200){
						handlerHttpError(res.data)
					}
					resolve(res)
				}, 
				fail(err) {
					reject(err)
				}
			})
		})
	}
}