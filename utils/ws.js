import store from '@/store'
//是否已经连接上ws
let isOpenSocket = false
//心跳间隔，单位毫秒  
let heartBeatDelay = 30000
let heartBeatInterval = null
//心跳时发送的消息文本
let heartBeatText = "PING"
//最大重连次数
let reconnectTimes = 10
let reconnectInterval = null
//重连间隔，单位毫秒
let reconnectDelay = 3000

let wsUrl = "wss://imserv.v2.74cms.com" //ws请求  或者  wss
let socketTask = null

//这个参数是防止重连失败之后onClose方法会重复执行reconnect方法，导致重连定时器出问题
//连接并打开之后可重连，且只执行重连方法一次
let canReconnect = false

//封装的对象，最后以模块化向外暴露，
//init方法 初始化socketTask对象
//completeClose方法 完全将socketTask关闭（不重连）
//其他关于socketTask的方法与uniapp的socketTask api一致
let ws = {
	socketTask: null,
	init,
	completeClose,
	send
}

function init(value) {
	socketTask = uni.connectSocket({
		url: wsUrl,
		success() {
			console.log('连接成功')
		},
		fail(err) {
			console.log(err)
		}
	})
	socketTask.onOpen((res) => {
		clearInterval(heartBeatInterval)
		clearInterval(reconnectInterval)
		isOpenSocket = true
		canReconnect = true
		var msgObj = {
			controller: 'Connect',
			action: 'index',
			args: {
				token: value
			}
		}
		send(JSON.stringify(msgObj));
		//开启心跳机制  向websocket发送数据，json格式，参数：sceneId
		heartBeat()
	})
	socketTask.onMessage((data) => {
		function isJSON(str) {
			if (typeof str == 'string') {
				try {
					var obj = JSON.parse(str)
					if (typeof obj == 'object' && obj) {
						return true
					} else {
						return false
					}
				} catch (e) {
					return false
				}
			}
		}
		if (isJSON(data.data)) {
			store.state.imUnreaded = true
			// 当消息返回错误信息时
			if (data.error !== undefined) {
				uni.showToast({
					title: data.error,
					icon: 'error'
				})
				return false
			}
			let mesData = JSON.parse(data.data)
			let message = isJSON(mesData.content) ? JSON.parse(mesData.content) : mesData.content
			// 屏蔽对方 / 被对方屏蔽
			if (mesData.type == 'isInBlacklist') {
				if (mesData.cancel_enable == 1) {
					store.state.isInBlackObj = {
						chatid: mesData.chatid,
						cancel_enable: mesData.cancel_enable,
						message: mesData.content
					}
				} else if (mesData.cancel_enable == 0) {
					store.state.isInBlackObj = {
						chatid: mesData.chatid,
						cancel_enable: mesData.cancel_enable,
						message: mesData.content
					}
				} else {
					store.state.isInBlackObj = {
						chatid: '',
						cancel_enable: '2',
						message: ''
					}
				}
				return false
			}

			// id 相同说明是同一个人 则需要处理数据
			if (store.state.chatId == mesData.chatid) {
				if (mesData.type == 'return_receipt_one') {
					store.state.messageList.forEach((element, index) => {
						if (element.messageid == message.messageid) {
							store.state.messageList[index].readed = 1
						}
					})
				} else if (mesData.type == 'return_receipt_all') {
					store.state.messageList.forEach((element, index) => {
						store.state.messageList[index].readed = 1
					})
				} else {
					var addObj = {
						self_side: mesData.self_side,
						avatar: mesData.self_side == 1 ? store.state.imSelfAvatar : store.state
							.imTargetUserinfo.avatar,
						type: mesData.type,
						message: message,
						addtime: mesData.addtime,
						readed: 0,
						messageid: mesData.messageid
					}
					if (mesData.replace == 1) {
						store.state.messageList.forEach((item) => {
							if (item.messageid == mesData.messageid) {
								if (isJSON(mesData.content)) {
									item.message = JSON.parse(mesData.content)
								} else {
									item.message = mesData.content
								}
							}
						})
					} else {
						store.state.messageList.push(addObj)
						if (mesData.self_side == 1) {} else {
							/**
							 * 发送回执
							 */
							let currentRoutes = getCurrentPages(); // 获取当前打开过的页面路由数组
							let currentRoute = currentRoutes[currentRoutes.length - 1].route
							if ('/' + currentRoute == '/im/imShow') {
								var msgObj = {
									controller: 'SendReturnReceipt',
									action: 'one',
									args: {
										token: store.state.imToken,
										messageid: mesData.messageid
									}
								}
								var msgStr = JSON.stringify(msgObj)
								send(msgStr)
							}
						}
					}
				}
			}
			//列表显示红点未读消息（对方发过来的）
			if (mesData.type != 'return_receipt_all' && mesData.self_side != 1) {
				store.state.isNew = true
				store.state.chatList.forEach((element, index) => {
					if (element.chat_id == mesData.chatid) {
						element.last_message = mesData.content
						element.new = 1
					}
				})
			}
		}
		// store.commit('setImMessage', data)
	})
	socketTask.onClose(() => {
		if (isOpenSocket) {
			console.log("ws与服务器断开")
		} else {
			console.log("连接失败")
		}
		isOpenSocket = false
		if (canReconnect) {
			reconnect()
			canReconnect = false
		}
	})
	ws.socketTask = socketTask
}
// 心跳
function heartBeat() {
	heartBeatInterval = setInterval(() => {
		let obj = {
			controller: 'Ping',
			action: 'index',
			args: {}
		}

		send(JSON.stringify(obj));
	}, heartBeatDelay)
}

// 发送消息
function send(value) {
	ws.socketTask.send({
		data: value
	});
}
// 重连
function reconnect() {
	//停止发送心跳
	clearInterval(heartBeatInterval)
	//如果不是人为关闭的话，进行重连
	if (!isOpenSocket) {
		let count = 0;
		reconnectInterval = setInterval(() => {
			console.log("正在尝试重连")
			init();
			count++
			//重连一定次数后就不再重连
			if (count >= reconnectTimes) {
				clearInterval(reconnectInterval)
				console.log("网络异常或服务器错误")
			}
		}, reconnectDelay)
	}
}
// 关闭连接
function completeClose() {
	//先将心跳与重连的定时器清除
	clearInterval(heartBeatInterval)
	clearInterval(reconnectInterval)
	canReconnect = false
	ws.socketTask.close()
	console.log('关闭成功')
}

module.exports = ws