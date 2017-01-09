<template>
	<div class="seller" ref="sellers">
		<div class="seller-content">
			<div class="overview">
				<h1 class="title">{{ seller.name }}</h1>
				<div class="desc border-1px">
					<star :size="36" :score="seller.score"></star>
					<span class="text">({{ seller.ratingCount }})</span>
					<span class="text">月售{{ seller.sellCount }}单</span>
				</div>
				<ul class="remark">
					<!-- 起送价 -->
					<li class="block">
						<h2>起送价</h2>
						<div class="content">
							<span class="stress">{{ seller.minPrice }}</span>元
						</div>
					</li>
					<!-- 商家配送 -->
					<li class="block">
						<h2>商家配送</h2>
						<div class="content">
							<span class="stress">{{ seller.deliveryPrice }}</span>元
						</div>
					</li>
					<!-- 平均配送时间 -->
					<li class="block">
						<h2>平均配送时间</h2>
						<div class="content">
							<span class="stress">{{ seller.deliveryTime }}</span>分钟
						</div>
					</li>
				</ul>
				<div class="favorite" @click="toggleFavorite($event)">
					<i class="icon-favorite" :class="{'active': favorite}"></i>
					<span class="text">{{ favoriteText }}</span>
				</div>
			</div>
			<split></split>
			<div class="bulletin">
				<h1 class="title">公告与活动</h1>
				<div class="content-wrapper border-1px">
					<p class="content">{{ seller.bulletin }}</p>
				</div>
				<!-- 活动信息 -->
				<ul v-if="seller.supports" class="supports">
					<li class="support-item border-1px" v-for="(item, index) in seller.supports">
						<span class="icon" :class="classMap[seller.supports[index].type]"></span>
						<span class="text">
							{{ seller.supports[index].description}}
						</span>
					</li>
				</ul>
			</div>
			<split></split>
			<div class="pics">
				<h1 class="title">商家实景</h1>
				<div class="pic-wrapper" ref="picWrapper">
					<ul class="pic-list" ref="picList">
						<li class="pic-item" v-for="pic in seller.pics">
							<img :src="pic" width="120" height="90">
						</li>
					</ul>
				</div>
			</div>
			<split></split>
			<div class="info">
				<h1 class="title border-1px">商家信息</h1>
				<ul>
					<li class="info-item" v-for="info in seller.infos">{{ info }}</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import star from 'components/star/star'
	import split from 'components/split/split'
	import BScroll from 'better-scroll'
	import { saveToLocal, loadFromLocal } from 'common/js/store'

	export default {
		props: {
			seller: {
				type: Object
			}
		},
		data() {
			return {
				favorite: (() => {
					return loadFromLocal(this.seller.id, 'favorite', false)
				})()
			}
		},
		/** 我也不是很清楚为什么能跑动，总之别乱动下面的代码 **/
		updated() {
			// 在 DOM 重新渲染完以后执行滚动初始化操作
			this._initScroll()
			this._initPics()
		},
		created() {
			this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'] // 显示 icon type 的类名

			this.$nextTick(() => {
				this._initScroll()
				this._initPics()
			})
		},
		computed: {
			favoriteText() {
				return this.favorite ? '已收藏' : '收藏'
			}
		},
		methods: {
			_initScroll() {
				if(!this.scroll) {
					this.scroll = new BScroll(this.$refs.sellers, {
						click: true,
						bounceTime: 500
					})
				} else {
					this.scroll.refresh()
				}
			},
			_initPics() { // 商家实景图片横向滚动初始化
				if(this.seller.pics) {
					let picWidth = 120 // 单张图片的宽度
					let margin = 6 // 图片的右间距
					let width = (picWidth + margin) * this.seller.pics.length - margin // ul 的总宽度

					this.$refs.picList.style.width = width + 'px'
					if(!this.picScroll) {
						this.picScroll = new BScroll(this.$refs.picWrapper, {
							scrollX: true,
							eventPassthrough: 'vertical',
							bounceTime: 500
						})
					}
				}
			},
			toggleFavorite(event) {
				if(!event._constructed) {
					return
				}

				this.favorite = !this.favorite
				saveToLocal(this.seller.id, 'favorite', this.favorite)
			}
		},
		components: {
			star,
			split
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import '../../common/stylus/mixin'

	.seller
		position: absolute
		top: 174px
		bottom: 0
		left: 0
		width: 100%
		overflow: hidden

		.overview
			position: relative
			padding: 18px

			.title
				margin-bottom: 8px
				line-height: 14px
				color: rgb(1, 17, 27)
				font-size: 16px

			.favorite
				position: absolute
				top: 18px
				right: 11px
				width: 50px
				text-align: center

				.icon-favorite
					display: block
					margin-bottom: 4px
					line-height: 24px
					font-size: 24px
					color: #D4D6D9
					transition: color .2s

					&.active
						color: rgb(240, 20, 20)
				
				.text
					line-height: 10px
					font-size: 10px
					color: rgb(77, 85, 93)

			.desc
				padding-bottom: 18px
				border-1px(rgba(7, 17, 27, .1))
				font-size: 0
				
				.star
					display: inline-block
					margin-right: 8px
					vertical-align: top
				
				.text
					display: inline-block
					margin-right: 12px
					line-height: 18px
					vertical-align: top
					font-size: 10px
					color: rgb(77, 85, 93)

			.remark
				display: flex
				padding-top: 18px

				.block
					flex: 1
					text-align: center
					border-right: 1px solid rgba(7, 17, 27, .1)

					&:last-child 
						border: none

					h2
						margin-bottom: 4px
						line-height: 10px
						font-size: 10px
						color: rgb(147, 153, 159)

					.content
						line-height: 24px
						font-size: 10px
						color: rgb(7, 17, 27)

						.stress
							font-size: 24px

		.bulletin
			padding: 18px 18px 0 18px

			.title
				margin-bottom: 8px
				line-height: 14px
				color: rgb(1, 17, 27)
				font-size: 16px

			.content-wrapper
				padding: 0 12px 16px 12px
				border-1px(rgba(7, 17, 27, .1))

				.content
					line-height: 24px
					font-size: 12px
					font-weight: 200
					color: rgb(240, 20, 20)

			.supports
				.support-item
					padding: 16px 12px
					border-1px(rgba(7, 17, 27, .1))
					font-size: 0

					&:last-child
						border-none()
					
					.icon
						display: inline-block
						width: 16px
						height: 16px
						vertical-align: top
						margin-right: 6px
						background-size: 16px 16px
						background-repeat: no-repeat
					
						&.decrease
							bg-image('decrease_4')
						&.discount
							bg-image('discount_4')
						&.guarantee
							bg-image('guarantee_4')
						&.invoice
							bg-image('invoice_4')
						&.special
							bg-image('special_4')

					.text
						line-height: 16px
						font-size: 12px
						color: rgb(7, 17, 27)

		.pics
			padding: 18px

			.title
				margin-bottom: 12px
				line-height: 14px
				color: rgb(1, 17, 27)
				font-size: 16px

			.pic-wrapper
				width: 100%
				overflow: hidden
				white-space: nowrap

				.pic-list
					font-size: 0

					.pic-item
						display: inline-block
						margin-right: 6px
						width: 120px
						height: 90px

						&:last-child
							margin: 0
		.info
			padding: 18px 18px 0 18px
			color: rgb(1, 17, 27)
			
			.title
				padding-bottom: 12px
				line-height: 14px
				border-1px(rgba(7, 17, 27, .1))
				font-size: 16px

			.info-item
				padding: 16px 12px
				line-height: 16px
				border-1px(rgba(7, 17, 27, .1))
				font-size: 12px

				&:last-child 
					border-none()
				

</style>
