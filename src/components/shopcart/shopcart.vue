<template>
	<div class="shopcart">
		<div class="content" @click="toggleList">
			<div class="content-left">
				<div class="logo-wrapper">
					<div class="logo" :class="{'heightlight': totalCount > 0}">
						<i class="icon-shopping_cart"></i>
					</div>
					<div class="num" v-show="totalCount > 0">
						{{ totalCount }}
					</div>
				</div>
				<div class="price" :class="{'heightlight': totalPrice > 0}">
					￥{{ totalPrice }}
				</div>
				<div class="desc">
					另需配送费￥{{ deliveryPrice }}元
				</div>
			</div>
			<div class="content-right" @click.stop.prevent="pay">
				<div class="pay" :class="payClass">
					{{ payDesc }}
				</div>
			</div>
		</div>

		<div class="ball-container">
			<template v-for="ball in balls">
				<transition
					v-on:before-enter="ballBeforeEnter" 
					v-on:enter="ballEnter" 
					v-on:after-enter="ballAfterEnter" 
				>
					<div v-show="ball.show" class="ball">
						<div class="inner inner-hook"></div>
					</div>
				</transition>
			</template>
		</div>
		
		<transition name="fold">
			<div class="shopcart-list" v-show="listShow">
				<div class="list-header">
					<h1 class="title">
						购物车
					</h1>
					<span class="empty" @click="empty">
						清空
					</span>
				</div>
				<div class="list-content" ref="listcontent">
					<ul>
						<li class="food" v-for="food in selectFoods">
							<span class="name">
								{{ food.name }}
							</span>
							<div class="price">
								<span>
									￥{{ food.price * food.count }}
								</span>
							</div>
							<div class="cartcontrol-wrapper">
								<cartcontrol :food="food"></cartcontrol>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</transition>
		<transition name="fade">
			<div class="list-mask" @click="hideList" v-show="listShow"></div>
		</transition>
	</div>
	
</template>

<script>
	import BScroll from 'better-scroll'
	import cartcontrol from 'components/cartcontrol/cartcontrol'

	export default {
		props: {
			selectFoods: { // 选择要买的食物的信息（price / count）
				type: Array,
				default() {
					return []
				}
			},
			deliveryPrice: {
				type: Number,
				default: 0
			},
			minPrice: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				balls: [
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					}
				],
				dropBalls: [],
				fold: true
			}
		},
		computed: {
			totalPrice() { // 选择食物价钱的总个数
				let total = 0
				this.selectFoods.forEach((food) => {
					total += food.price * food.count // total 等于全部食品价钱的总和
				})
				
				return total
			},
			totalCount() { // 选择食物的总个数
				let count = 0
				this.selectFoods.forEach((food) => {
					count += food.count // count 等于全部食品个数的总和
				})

				return count
			},
			payDesc() { // 改变支付按钮文字的状态
				if(this.totalPrice === 0) { // 未选择食物时候的状态
					return `￥${this.minPrice}元起送`
				} else if(this.totalPrice < this.minPrice) { // 选择了食物但是还未达到配送价钱时候的状态
					let diff = this.minPrice - this.totalPrice
					return `还差￥${diff}元起送`
				} else { // 达到配送价钱的状态
					return '去结算'
				}
			},
			payClass() { // 改变支付按钮的状态
				if(this.totalPrice < this.minPrice) { // 达到最低配送价钱按钮变成激活状态，否则是一般状态（暗淡）
					return 'no-enough'
				} else {
					return 'enough'
				}
			},
			listShow() { // 显示购物车列表
				if(!this.totalCount) {
					this.fold = true
					return false
				}
				let show = !this.fold
				if(show) {
					this.$nextTick(() => {
						if(!this.scroll) {
							this.scroll = new BScroll(this.$refs.listcontent, {
								click: true
							})
						} else {
							this.scroll.refresh()
						}
					})
				}
				return show
			}
		},
		methods: {
			toggleList() {
				if(!this.totalCount) {
					return
				}
				this.fold = !this.fold
			},
			drop(el) {
				for(let i = 0; i < this.balls.length; i++) {
					let ball = this.balls[i]
					
					if(!ball.show) {
						ball.show = true
						ball.el = el
						this.dropBalls.push(ball)
						return
					}
				}
			},
			ballBeforeEnter(el) {
				let count = this.balls.length

				while(count--) {
					let ball = this.balls[count]

					if(ball.show) {
						let rect = ball.el.getBoundingClientRect()
						let x = rect.left - 32
						let y = -(window.innerHeight - rect.top - 22)

						el.style.display = ''
						el.style.webKitTransform = `translate3d(0, ${y}px, 0)`
						el.style.transform = `translate3d(0, ${y}px, 0)`

						let inner = el.getElementsByClassName('inner-hook')[0]
						inner.style.webKitTransform = `translate3d(${x}px, 0, 0)`
						inner.style.transform = `translate3d(${x}px, 0, 0)`
					}
				}
			},
			ballEnter(el) {
				/* eslint-disable no-unused-vars */
				// 触发浏览器重绘
				let rf = el.offsetHeight

				this.$nextTick(() => {
					el.style.webKitTransform = 'translate3d(0, 0, 0)'
					el.style.transform = 'translate3d(0, 0, 0)'

					let inner = el.getElementsByClassName('inner-hook')[0]
					inner.style.webKitTransform = 'translate3d(0, 0, 0)'
					inner.style.transform = 'translate3d(0, 0, 0)'
				})
			},
			ballAfterEnter(el) {
				let ball = this.dropBalls.shift()

				if(ball) {
					ball.show = false
					el.style.display = 'none'
				}
			},
			hideList() {
				this.fold = true
			},
			empty() {
				this.selectFoods.forEach((food) => {
					food.count = 0
				})
			},
			pay() {
				if(this.totalPrice < this.minPrice) {
					return
				}
				window.alert(`多的不说，${this.totalPrice}块拿来！`)
			}
		},
		components: {
			cartcontrol
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import '../../common/stylus/mixin'

	.shopcart
		position: fixed
		left: 0
		bottom: 0
		z-index: 50
		width: 100%
		height: 48px

		.content
			display: flex
			position: relative
			z-index: 50
			font-size: 0
			color: rgba(255,255,255,.4)
			background-color: #141D27

			.content-left
				flex: 1

				.logo-wrapper
					display: inline-block
					vertical-align: top
					position: relative
					top: -10px
					margin: 0 12px
					padding: 6px
					width: 56px
					height: 56px
					box-sizing: border-box
					border-radius: 50%
					background: #141D27

					.logo
						width: 100%
						height: 100%
						border-radius: 50%
						text-align: center
						background: #2B343C

						&.heightlight
							background-color: rgb(0,160,220)

							.icon-shopping_cart
								color: #FFF

						.icon-shopping_cart
							color: #80858A
							font-size: 24px
							line-height: 44px
							
					.num
						 position: absolute
						 top: 0
						 right: 0
						 width: 24px
						 height: 16px
						 line-height: 16px
						 text-align: center
						 border-radius: 16px
						 font-size: 9px
						 font-weight: 700
						 color: #FFF
						 background-color: rgb(240,20,20)
						 box-shadow: 0 4px 8px 0 rgba(0,0,0,.4)
				
				.price
					display: inline-block
					vertical-align: top
					line-height: 24px
					margin-top: 12px
					padding-right: 12px
					box-sizing: border-box
					border-right: 1px solid rgba(255,255,255,.1)
					font-size: 16px
					font-weight: 700

					&.heightlight
						color: #FFF

				.desc
					display: inline-block
					vertical-align: top
					line-height: 24px
					margin: 12px 0 0 12px
					font-size: 10px

			.content-right
				flex: 0 0 105px
				width: 105px

				.pay
					height: 48px
					line-height: 48px
					text-align: center
					font-size: 12px 
					dont-weight: 700

					&.no-enough
						background-color: #2B333B

					&.enough
						color: #fff
						background-color: #00B43C

					
		.ball-container
				.ball
					position: fixed
					left: 32px
					bottom: 22px
					z-index: 200
					transition: all .4s cubic-bezier(0.49, -0.29, 0.75, 0.41)

					.inner
						width: 16px
						height: 16px
						border-radius: 50%
						transition: all .4s linear
						background-color: rgb(0,160,220)

		.shopcart-list
			position: absolute
			left: 0
			top: 0
			z-index: 45
			width: 100%
			transition: all .4s
			transform: translate3d(0, -100%, 0)

			&.fold-enter, &.fold-leave-active
				transform: translate3d(0, 0, 0)
				
			.list-header
				height: 40px
				line-height: 40px;
				padding: 0 18px
				background-color: #F3F5F7
				border-bottom: 1px solid rgba(7, 17, 27, .1)

				.title
					float: left
					font-size: 14px
					color: rgb(7, 17, 27)

				.empty
					float: right
					font-size: 12px
					color: rgb(0, 160, 220)

			.list-content
				padding: 0 18px
				max-height: 217px
				overflow: hidden
				background-color: #FFF

				.food
					position: relative
					padding: 12px 0
					box-sizing: border-box
					border-1px(rgba(7, 17, 27, .1))

					&:last-child
						border-none()

					.name
						line-height: 24px
						font-size: 14px
						color: rgb(7, 17, 27)

					.price
						position: absolute
						right: 90px
						bottom: 12px
						line-height: 24px
						font-size: 14px
						font-weight: 700
						color: rgb(240, 20, 20)

					.cartcontrol-wrapper
						position: absolute
						right: 0
						bottom: 6px

		.list-mask
			position: fixed
			top: 0
			left: 0
			width: 100%
			height: 100%
			z-index: 40
			opacity: 1
			background-color: rgba(7,17,27,.6)
			backdrop-filter: blur(10px)
			transition: all .2s ease-in-out

			&.fade-enter, &.fade-leave-active
				opacity: 0
				background-color: rgba(7,17,27,0)
</style>
