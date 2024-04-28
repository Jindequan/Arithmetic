// 获取用户定位
export function UNIGETLOCATION() {
	return new Promise((resolve, reject) => {
		uni.getLocation({
			type: 'gcj02 ',
			success(res) {
				resolve(res)
			},
			fail(err) {
				reject(err)
			}
		})
	})
}
//检测用户手机GPS权限是否开启
export function checkOpenGPSServiceByAndroid() {
	return new Promise((resolve, reject) => {
		uni.getSystemInfo({
			success(res) {
				console.log('检测用户手机GPS权限是否开启',res)
				let locationEnabled = res.locationEnabled; //判断地理位置的手机系统开关
				let locationAuthorized = res.locationAuthorized; //判断定位服务是否允许微信授权
				// #ifdef MP-WEIXIN
				if (locationEnabled == false || locationAuthorized == false) {
					//手机定位服务（GPS）未授权
					resolve({
						isGps: false
					})
				} else {
					resolve({
						isGps: true
					})
				}
				// #endif
				
				// #ifdef MP-TOUTIAO
				if (locationEnabled == false) {
					//手机定位服务（GPS）未授权
					resolve({
						isGps: false
					})
				} else {
					resolve({
						isGps: true
					})
				}
				// #endif
			},
			fail(err) {
				reject({
					isGps: false
				})
			}
		})
	})

}

// 引导用户打开小程序权限
export function guideOpenAuth() {
	let auth = "scope.userLocation"
	// #ifdef MP-ALIPAY
	auth = "location"
	// #endif
	return new Promise((resolve, reject) => {
		uni.authorize({
			scope: auth,
			success() {
				uni.getSetting({
					success(res) {
						let scopeUserLocation = res.authSetting[auth];
						if (!scopeUserLocation) {
							// 微信、抖音小程序未授权位置信息
							resolve({
								isAuth: false,
								auth: auth
							})
						} else {
							resolve({
								isAuth: true,
								auth: auth
							})
						}
					},
					fail() {
						reject({
							isAuth: false,
							auth: auth
						})
					}
				});
			},
			fail(err) {
				console.log(err);
				reject({
					isAuth: false,
					auth: auth
				})
			}
		})
	})
}
export function awaitWrap(promise) {
	return promise
		.then(data => {
			return {
				err: null,
				data: data
			}
		})
		.catch(err => {
			return {
				err: err,
				data: null
			}
		})
}


let authList = {
	location: location,
}

function location() {
	return new Promise(async (resolve, reject) => {
		var {
			data: gpsData,
			err: gpsErr
		} = await awaitWrap(checkOpenGPSServiceByAndroid())
		if (gpsData && gpsData.isGps) {
			// 有gps权限
			const {
				data: authData,
				err: authErr
			} = await awaitWrap(guideOpenAuth())
			if (authData) {
				// 小程序授权了
				const {
					data: locationData,
					err: locationErr
				} = await awaitWrap(UNIGETLOCATION())
				if (locationData) {
					resolve({
						location: locationData,
						isGps: true,
						...authData
					})
				} else {
					resolve({
						location: null,
						isGps: true,
						...authData
					})
				}
			} else {
				// 小程序没有授权
				resolve({
					location: null,
					isGps: true,
					...authErr
				})
			}

		} else {
			// 无gps权限
			resolve({
				isGps: false,
				location: null,
				auth: null,
				isAuth: null
			})
		}

	})
}

// 是否开启权限
export function changeIsAuth(type) {
	return new Promise((resolve, reject) => {
		if (!type) {
			reject()
			return
		}
		let data = authList[type]()
		resolve(data)
	})
}