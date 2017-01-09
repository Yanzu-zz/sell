<template>
	<transition name="move" mode="out-in">
		<div v-show="showFlag" class="food" ref="food">
			<div class="food-content">
				<div class="image-header">
					<img :src="food.image">
					<div class="back" @click="hide">
						<i class="icon-arrow_lift"></i>
					</div>
				</div>
				<div class="content">
					<div class="title">{{ food.name }}</div>
					<div class="detail">
						<span class="sell-count">月售{{ food.sellCount }}</span>
						<span class="rating">好评率{{ food.rating }}</span>
					</div>
					<price :food="food"></price>

					<div class="cartcontrol-wrapper">
						<cartcontrol :food="food"></cartcontrol>
					</div>
					<transition name="fade">
						<div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count === 0">
							加入购物车
						</div>
					</transition>
				</div>
				<split v-show="food.info"></split>
				<div class="info" v-show="food.info">
					<div class="title">商品信息</div>
					<div class="text">{{ food.info }}</div>
				</div>
				<split></split>
				<div class="rating">
					<h1 class="title">商品评价</h1>
					<ratingselect 
						:select-type="selectType"
						:only-content="onlyContent"
						:desc="desc"
						:ratings="food.ratings"
					></ratingselect>
					<!-- 评论内容区 -->
					<div class="rating-wrapper">
						<ul v-show="food.ratings && food.ratings.length">
							<li v-show="needShow(rating.rateType, rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
								<!-- 用户信息 -->
								<div class="user">
									<!-- 用户姓名 -->
									<span class="name">{{ rating.username }}</span>
									<!-- 用户头像 -->
									<img class="avatar" width="12" height="12" :src="rating.avatar">
								</div>
								<!-- 用户发表言论时间 -->
								<div class="time">{{ rating.rateTime | formatDate }}</div>
								<!-- 用户发表言论文字 -->
								<p class="text">
									<i :class="{'icon-thumb_up': rating.rateType === 0, 'icon-thumb_down': rating.rateType === 1}"></i>
									<span class="comment">{{ rating.text }}</span>
								</p>
							</li>
						</ul>
						<div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	import BScroll from 'better-scroll'
	import Vue from 'vue'
	import { formatDate } from 'common/js/date'
	import price from 'components/price/price'
	import cartcontrol from 'components/cartcontrol/cartcontrol'
	import split from 'components/split/split'
	import ratingselect from 'components/ratingselect/ratingselect'

  const ALL = 2 // 全部评论（推荐和吐槽）

	export default {
		props: {
			food: {
				type: Object
			}
		},
		data() {
			return {
				showFlag: false,
				selectType: ALL,
				onlyContent: true,
				desc: {
					all: '全部',
					positive: '推荐',
					negative: '吐槽'
				}
				// defaultRatings: {}
			}
		},
		methods: {
			show() {
				this.showFlag = true
				this.selectType = ALL
				this.onlyContent = true

				this.$nextTick(() => {
					if(!this.scroll) {
						this.scroll = new BScroll(this.$refs.food, {
							click: true,
							bounceTime: 500
						})
					} else {
						this.scroll.refresh()
					}

					// this.defaultRatings = this.food.ratings
				})
			},
			hide() {
				this.showFlag = false
			},
			addFirst(event) {
				if(!event._constructed) {
					return
				}

				this.$parent.$emit('cart.add', event.target)
				Vue.set(this.food, 'count', 1)
			},
			needShow(type, text) {
				if(this.onlyContent && !text) {
					return false
				}

				if(this.selectType === ALL) {
					return true
				} else {
					return type === this.selectType
				}
			},
			ratingtypeSelect(type) {
				// 把在自组件里修改的查看类型传到父组件里
				this.selectType = type
				this.$nextTick(() => {
					this.scroll.refresh()
				})
			},
			contentToggle(to) {
				// 把在自组件里修改的查看类型传到父组件里
				this.onlyContent = to
				this.$nextTick(() => {
					this.scroll.refresh()
				})
			}
		},
		created() {
			this.$on('ratingtype.select', this.ratingtypeSelect)
			this.$on('content.toggle', this.contentToggle)
		},
		filters: {
			formatDate(time) {
				let date = new Date(time)

				return formatDate(date, 'yyyy-MM-dd hh:mm')
			}
		},
		components: {
			price,
			split,
			cartcontrol,
			ratingselect
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import '../../common/stylus/mixin.styl'

	.food 
		position: fixed
		top: 0
		left: 0
		bottom: 48px
		z-index: 30
		width: 100%
		background-color: #FFF
		transition: all .2s linear
		transform: translate3d(0, 0, 0)

		&.move-enter, &.move-leave-active
			transform: translate3d(100%, 0, 0)

		.image-header
			position: relative
			width: 100%
			height: 0
			padding-top: 100%
			
			img
				position: absolute
				top: 0
				left: 0
				width: 100%
				height: 100%

			.back
				position: absolute
				top: 10px
				left: 0

				.icon-arrow_lift
					display: block
					padding: 10px 
					font-size: 20px
					color: #FFF

		.content
			position: relative
			padding: 18px

			.title
				line-height: 14px
				margin-bottom: 8px
				font-size: 14px
				font-weight: 700
				color: rgb(7, 17, 27)

			.detail
				margin-bottom: 18px
				line-height: 10px
				height: 10px
				font-size: 0

				.sell-count, .rating
					font-size: 10px
					color: rgb(147, 153, 159)

				.sell-count
					margin-right: 12px

			.cartcontrol-wrapper
				position: absolute
				right: 12px
				bottom: 12px

			.buy
				cursor: pointer
				position: absolute
				right: 18px
				bottom: 18px
				z-index: 10
				height: 32px
				line-height: 32px
				padding: 0 16px
				box-sizing: border-box
				border-radius: 16px
				font-size: 13px
				color: #FFF
				background-color: rgb(0, 160, 220)
				opacity: 1
				transition: all .2s

				&.fade-enter, &.fade-leave-active
					opacity: 0

		.info
			padding: 18px

			.title
				line-height: 14px
				margin-bottom: 4px
				font-size: 14px
				color: rgb(7, 17, 27)
			
			.text
				line-height: 24px
				padding: 0 8px
				font-size: 12px
				color: rgb(77, 85, 93)
			
		.rating
			padding-top: 18px
			
			.title
				line-height: 14px
				margin-left: 18px
				font-size: 14px
				color: rgb(7, 17, 27)

		.rating-wrapper
			padding: 0 18px
			
			.rating-item
				position: relative
				padding: 16px 0
				border-1px(rgba(7, 17, 27, .1))

				.user
					position: absolute
					top: 16px
					right: 0
					line-height: 12px
					font-size: 0

					.name
						display: inline-block
						margin-right: 6px
						vertical-align: top
						font-size: 10px
						color: rgb(147, 153, 159)

					.avatar
						border-radius: 50%
				.time
					margin-bottom: 6px
					line-height: 12px
					font-size: 10px
					color: rgb(147, 153, 159)
				.text
					line-height: 16px
					font-size: 12px
					color: rgb(7, 17, 27)

					.icon-thumb_up, .icon-thumb_down
						margin-right: 4px
						line-height: 16px
						font-size: 12px

					.icon-thumb_up
						color: rgb(0, 160, 220)

					.icon-thumb_down
						color: rgb(147, 153, 159)

			.no-rating
				padding: 16px 0
				font-size: 12px
				color: rgb(147, 153, 159)
				
</style>
