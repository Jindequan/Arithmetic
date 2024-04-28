import http from './http.js'
import api from '../api.js'
import store from '@/store/index.js'
export async function onShareAppMessage({
	url,
	alias,
	info
}) {
	let data = await getWechatShareConfig(url, alias, info)
	return {
		path: url,
		title: data.title,
		desc: data.desc
	}
}
export async function onShareTimeline({
	url,
	alias,
	info
}) {
	let data = await getWechatShareConfig(url, alias, info)
	return data
}

function getWechatShareConfig(url, alias, info) {
	return new Promise(function(resolve, reject) {
		http.get(api.wechat_share_config, {
			url,
			alias
		}).then(res => {
			var config = store.state.config
			var obj = {}
			obj['sitedomain'] = config.sitedomain
			obj['sitename'] = config.sitename;

			function shareReplace(c, info) {
				for (var i in obj) {
					c.title = c.title.replace(new RegExp('{' + i + '}', "g"), obj[i] || '')
					c.desc = c.desc.replace(new RegExp('{' + i + '}', "g"), obj[i] || '')
					c.content = c.content.replace(new RegExp('{' + i + '}', "g"), obj[i] || '')
				}
				if (info) {
					for (var k in info) {
						c.title = c.title.replace(new RegExp('{' + k + '}', "g"), info[k] || '')
						c.desc = c.desc.replace(new RegExp('{' + i + '}', "g"), obj[i] || '')
						c.content = c.content.replace(new RegExp('{' + i + '}', "g"), obj[i] || '')
					}
				}

				if (c.img == 'self') {
					c.imageUrl = info.imgUrl
					// c.imageUrl = 'http://74cmsse.tywangcai.com/upload/resource/empty_thumb.jpg'
					// c.imageUrl = 'https://74cmsse.tywangcai.com/upload/files/20210302/acbbadac6eb580bb718b1396178a496c.jpg'
				} else {
					c.imageUrl = config.square_logo
				}
				resolve(c)
			};

			if (res.data.code == 200) {
				var shareObj = {
					title: res.data.data.data.content,
					img: res.data.data.data.img == 'logo' ? config.square_logo : res.data.data.data
						.img,
					desc: res.data.data.data.explain,
					content: res.data.data.data.explain,
				}
				shareReplace(shareObj, info)
			}
		}).catch(err => {
			reject(err)
		})
	})

}