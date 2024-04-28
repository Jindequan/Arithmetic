<script>
	export default {
		onLaunch: function() {
			// console.log('App Launch')
		},
		onShow: function() {
			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		},
		methods: {
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

<style>
	.pageBg {
		background: #f7f7f7 url('./static/publicBg.png') no-repeat top center;
		min-height: 100vh;
		background-size: 100% 512rpx;
	}
</style>
