<template>
	<Head ref="Head" title="首页" type="index" :isBack="true"></Head>
	<view class="content" @click="choose">
		<view class="ques-area">		
			<view class="quese-item" v-for="(item,index) in dataset">
				<view class="ques-body">{{item.left}}</view>
				<view class="ques-body">{{item.op}}</view>
				<view class="ques-body">{{item.right}}</view>
				<view class="ques-body"> = </view>
				<input v-model.number="item.answer" type="number" inputmode="numeric" class="answer"/>
			</view>
		</view> 
		
		<view class="button-area">
			<button id="resetButton" type="button" class="reset" @click="reset">
			      重来一遍
			</button>
			
			<button id="resetButton" type="button" class="submit" @click="submit">
			      检查结果
			</button>
		</view>
	</view>
	
	<view class="result-area" v-if="openResult">
		<view class="score" v-if="score > -1">
			你的分数：<span :style="{color: score > 80 ? 'red' : (score > 60 ? 'orange' : 'green')}">{{score}}</span>
		</view>
		<view class="result-list">
			<view class="result-item" v-for="(item, index) in result">
				<view class="result-atom-small">
					{{item.left}}
				</view>
				<view class="result-atom-small">
					{{item.op}}
				</view>
				<view class="result-atom-small">
					{{item.right}}
				</view>
				<view class="result-atom-small">
					=
				</view>
				<view class="result-atom-small">
					{{item.correctAnswer}}
				</view>
				<view class="result-atom-big">
					你的答案:
				</view>
				<view class="result-atom-middle">
					{{item.answer}}
				</view>
				<view class="result-atom-middle" :style="{color: item.correct == '正确' ? 'green' : 'orange'}">
					{{item.correct}}
				</view>
			</view>
		</view>
		<button @click="openResult=false" class="close-button">关闭</button>
	</view>

</template>

<script>
import Head  from '/components/Head.vue'
import { ref } from "vue";
const openResult = ref(false);
export default {
		data() {
			return {
				openResult: ref(false),
				quantity: 10,
				method: '',
				num_type: '',
				dataset: [],
				result: [],
				score: -1
			}
		},
		onLoad(options) {
			this.num_type = options.num_type
			this.method = options.method
			if (options.quantity) {
				this.quantity = options.quantity
			}
			this.loadQues()
		},
		components: {
			Head
		},
		methods: {
			loadQues: function() {
				if (this.num_type == '') {
					return false
				}
				
				var min = 0
				var max = 0
				switch (this.num_type) {
					case '10':
						min = 0
						max = 9
						break
					case '20':
						min = 0 
						max = 20
						break
					case '50':
						min = 0
						max = 50
						break
					case '100':
						min = 0
						max = 100
						break
					default:
						break
				}
				
				var dataset = []
				var left, right = 0
				for (let i=0; i<this.quantity; i++) {
					left = this.getRandom(min, max)
					right = this.getRandom(min, max)
					if (this.method == '-') {
						var bigger = left > right ? left : right
						var smaller = left < right ? left : right
						
						left = bigger
						right = smaller
					}
					dataset.push({'answer': null, 'left': left, 'right': right, 'op': this.method})
				}
				this.dataset = dataset
			},
			getRandom: function(min, max) {
			  const floatRandom = Math.random()
			
			  const difference = max - min
			
			  // random between 0 and the difference
			  const random = Math.round(difference * floatRandom)
			
			  const randomWithinRange = random + min
			
			  return randomWithinRange
			},
			reset: function(){
				this.dataset = []
				this.score = -1
				this.result = []
				this.loadQues()
			},
			submit: function(){
				this.score = 0
				this.result = []
				this.openResult = ref(true)
				for (var i = 0; i < this.dataset.length; i++) {
					this.dealOneByOne(this.dataset.at(i), i)						
				}console.log(this.result)
			},
			dealOneByOne: function(item, index) {
				var res = this.calculate(item.left, item.op, item.right)
				var isCorrect = "错误"
				if (res == item.answer) {
					isCorrect = "正确"
				}
				var answer = ''
				if (item.answer !== null) {
					answer = item.answer
				}
				this.result.push({
					'correctAnswer': res,
					'answer': item.answer, 
					'left': item.left, 
					'right': item.right, 
					'op': item.op, 
					'correct': isCorrect})
				if (res == item.answer) {
					this.score += 10
				}
			},
			calculate: function(left, op, right) {
				console.dir(op.localeCompare("*"))
				console.dir(op)
				console.dir("*")
				console.dir(typeof(op))
				console.dir(typeof("*"))
				var res = 0
				switch (op) {
					case '+' :
						res = left + right
						break
					case '-':
						res = left - right
						break
					case '*':
						res = left * right
						break
					default:
						break
				}
				return res
			}
		},
	}
</script>

<style lang="scss" scoped>
	.content {
		margin-top: 10rpx;
		margin-bottom: 30rpx;
		padding: 0 30rpx 160rpx;
		padding-top: 30rpx;
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		overflow: hidden;
	}
	.ques-area {
		display: flex;
		flex-direction: column;
	}
	
	.quese-item {
		border-radius: 15rpx;
		display: flex;
		flex-direction: row;
		margin-bottom: 10rpx;
		
		.ques-body {
			width: 15%;
			text-align: center;
			padding: 20rpx 20rpx 20rpx;
			border-radius: 15rpx;
		}
		.answer {
			background-color: #f3f3f3;
			width: 30%;
			padding: 20rpx 20rpx 20rpx;
			border: 2rpx;
			border-radius: 15rpx;
		}
	}
	.button-area{
		display: flex;
		flex-direction: row;
		margin-top: 50rpx;
	}
	.result-area {
		position: fixed;
		background: #ffffff;
		z-index: 999;
		top: 0%;
		height: 100%;
		left: 0%;
		width: 100%;
		margin-top: 100rpx;
		padding: 15px;
		text-align: left;
		flex-wrap: nowrap;
		.score {
			width: 100%;
			height: 100rpx;
			.score-text {
				color: green
			}
		}
		.result-list {
				display: flex;
				flex-direction: column;
			width: 100%;
			.result-item {
				display: flex;
				flex-direction: row;
				background-color: #ffffff;
				width: 100%;
				margin-top: 25rpx;
				border-radius: 15rpx;
				.result-atom-small {
					height: 50rpx;
					// margin: 5rpx;
					width: 8%;
				}
				.result-atom-middle {
					height: 50rpx;
					// margin: 5rpx;
					width: 18%;
				}
				.result-atom-big {
					height: 50rpx;
					// margin: 5rpx;
					width: 24%;
				}
			}
		}
	}
	.submit {
		background-color: #00ff00;
	}
	.reset {
		background-color: #ffaa00;
	}
	.close-button {
		height: 100rpx;
		width: 200rpx;
		border-radius: 15rpx;
		margin-top: 100rpx;
		background-color: #55aaff;
		// padding: 10rpx;
		text-align: center;
		align-items: center;
	}
</style>
