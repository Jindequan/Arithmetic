<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		
		<label class="title">{{title}}</label>
		<view class="table" v-for="(item, index) in categories">
			<view class="row" v-for="(i, idx) in item" :style="{'background-color': i.color }" @click="choose(i.type)"> {{i.display, i.color, i}} </view>
		</view>
		<BottomNav ref="ButtomNav"></BottomNav>
	</view>
</template>

<script>
	import Head from '/components/Head.vue'
	import BottomNave from '/components/BottomNav.vue'
	export default {
		data() {
			return {
				'title': '算术练习',
				'page': 'home',
				'categories': []
			}
		},
		onLoad() {
			this.loadCategories()
		},
		components: {
			Head
		},
		methods: {
			loadCategories: function() {
				let methods = ['','+', '-', '*️']//, '/']
				let methodsDisplay = ['','➕', '➖', '✖️']//, '➗']
				let cates = ['','10', '20', '50', '100']
				
				//{method: '➕', num_type: '10', bold: true, display: '', color: #color'}
				var res = []
				for(var i = 0; i < methods.length; i++) {
					res[i] = new Array();
					for(var j = 0; j < cates.length; j++) {
						res[i][j] = null;
					}
				}
				  
				
				
				for(let i=0; i<methods.length; i++) {
					let iValue = methods[i]
					let iDisplay = methodsDisplay[i]

					for(let j=0; j< cates.length; j++) {
						let jValue = cates[j]
						if (i==0 && j==0) {
							res[0][0] = {'method': '', 'num_type': '', 'bold': false, 'display': '', 'color': '', 'type': null}
							continue
						}
						let item = {'method': '', 'num_type': '', 'bold': false, 'display': '', 'color': '#ffff7f', 'type': null}
						if (j==0) {
							item.bold = true
							item.display = iDisplay
						} else if (i ==0){
							item.bold = true
							item.display = jValue
						} else {
							item.color = this.getRandomColor()
							item.type = {'method': iValue, 'num_type': jValue}
						}
						
						res[i][j] = item
					}
				}
				this.categories = res
			},
			choose: function(option){
				if (!option || !option.method || !option.num_type) {
					return
				}
				uni.navigateTo({
					url: '../question/index?method=' + option.method + '&num_type=' + option.num_type
				})
			},
			getRandomColor: function() {
			  var letters = '0123456789ABCDEF'
			  var color = '#'
			  for (var i = 0; i < 6; i++) {
			    color += letters[Math.floor(Math.random() * 16)]
			  }
			  return color
			}
		}
	}
</script>

<style lang="scss">
	.content {
		min-height: 100%;
		background: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 100rpx;
		background: #f7f7f7 url('/static/publicBg.png') no-repeat top center;
		background-size: 100% 512rpx;
	}
	.logo {
		// margin-top: 500rpx;
		height: 200rpx;
		width: 200rpx;
		margin-top: 50rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}
	.title {
		font-size: 3ex;
		font-weight: bold;
		color: #8f8f94;
		margin-bottom: 100rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}
	.table {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 150rpx;
		text-align: center;
		
		.row {
			display: flex;
			flex-direction: column;
			width: 150rpx;
			padding-top: 50rpx;
		}
	}
</style>
