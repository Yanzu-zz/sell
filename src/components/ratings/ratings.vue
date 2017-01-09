<template>
	<div class="ratings" ref="rating">
		<div class="ratings-content">
			<!-- 商家信息层 -->
			<div class="overview">
				<div class="overview-left">
					<!-- 商家平均分数 -->
					<h1 class="score">{{ seller.score }}</h1>
					<div class="title">综合评分</div>
					<div class="rank">高于周边商家{{ seller.rankRate }}%</div>
				</div>
				<!-- 商家态度之类的评分 -->
				<div class="overview-right">
					<!-- 服务态度评分 -->
					<div class="score-wrapper">
						<span class="title">服务态度</span>
						<!-- 星星组件 -->
						<star :size="36" :score="seller.serviceScore"></star>
						<span class="score">{{ seller.serviceScore }}</span>
					</div>
					<!-- 商品评价评分 -->
					<div class="score-wrapper">
						<span class="title">商品评价</span>
						<!-- 星星组件 -->
						<star :size="36" :score="seller.foodScore"></star>
						<span class="score">{{ seller.foodScore }}</span>
					</div>
					<!-- 平均送达时间 -->
					<div class="delivery-wrapper">
						<span class="title">送达时间</span>
						<span class="delivery">{{ seller.deliveryTime }}分钟</span>
					</div>
				</div>
			</div>
			<!-- 分隔图层 -->
			<split></split>
			<!-- 评论选择 -->
			<ratingselect 
				:select-type="selectType"
				:only-content="onlyContent"
				:ratings="ratings"
			></ratingselect>
			<div class="rating-wrapper">
				<ul>
					<li v-for="rating in ratings" class="rating-item" v-show="needShow(rating.rateType, rating.text)">
						<div class="avatar">
							<img :src="rating.avatar" width="28" height="28">
						</div>
						<div class="content">
							<h1 class="name">{{ rating.username }}</h1>
							<div class="star-wrapper">
								<star :size="24" :score="rating.score"></star>
								<span class="delivery" v-show="rating.deliveryTime">{{ rating.deliveryTime }}</span>
							</div>
							<p class="text">{{ rating.text }}</p>
							<!-- 推荐 -->
							<div class="recommend" v-show="rating.recommend && rating.recommend.length">
								<i class="icon-thumb_up"></i>
								<span v-for="item in rating.recommend" class="item">{{ item }}</span>
							</div>
							<div class="recommend" v-show="!rating.recommend || !rating.recommend.length">
								<i class="icon-thumb_down"></i>
								<span v-for="item in rating.recommend" class="item">{{ item }}</span>
							</div>
							<div class="time">
								{{ rating.rateTime | formatDate }}
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import BScroll from 'better-scroll'
	import star from 'components/star/star'
	import split from 'components/split/split'
	import ratingselect from 'components/ratingselect/ratingselect'
	import { formatDate } from 'common/js/date'

	const ALL = 2 // 全部评论（推荐和吐槽）
	const ERR_OK = 0

	export default {
		props: {
			seller: Object
		},
		data() {
			return {
				ratings: [],
				selectType: ALL,
				onlyContent: true
			}
		},
		methods: {
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
			
			this.$http.get('/api/ratings').then((res) => {
				res = res.body

				if(res.errno === ERR_OK) {
					this.ratings = res.data

					this.$nextTick(() => {
						this.scroll = new BScroll(this.$refs.rating, {
							click: true,
							bounceTime: 500
						})
					})
				}
			})
		},
		filters: {
			formatDate(time) {
				let date = new Date(time)

				return formatDate(date, 'yyyy-MM-dd hh:mm')
			}
		},
		components: {
			star,
			split,
			ratingselect
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import '../../common/stylus/mixin.styl'

	.ratings
		position: absolute
		top: 174px
		bottom: 0
		left: 0
		width: 100%
		overflow: hidden

		.overview
			display: flex
			padding: 18px 0

			.overview-left
				flex: 0 0 137px
				width: 137px
				padding: 6px 0
				border-right: 1px solid rgba(7, 17, 27, .1)
				text-align: center

				@media only screen and (max-width: 320px)
					flex: 0 0 120px
					width: 120px

				.score
					line-height: 28px
					font-size: 24px
					color: rgb(255, 153, 0)

				.title
					margin: 6px 0 8px
					line-height: 12px
					font-size: 12px
					color: rgb(7, 17, 27)

				.rank
					line-height: 10px
					font-size: 10px
					color: rgb(147, 153, 159)

			.overview-right
				flex: 1
				padding: 6px 0 6px 24px

				@media only screen and (max-width: 320px)
					padding-left: 6px
				
				.score-wrapper
					margin-bottom: 8px
					font-size: 0

					.title
						display: inline-block
						line-height: 18px
						vertical-align: top
						font-size: 12px
						color: rgb(7, 17, 27)
					
					.star
						display: inline-block
						margin: 0 12px
						vertical-align: top

					.score
						display: inline-block
						line-height: 18px
						vertical-align: top
						font-size: 12px
						color: rgb(255, 153, 0)

				.delivery-wrapper
					font-size: 0

					.title
						line-height: 18px
						font-size: 12px
						color: rgb(7, 17, 27)
					
					.delivery
						margin-left: 12px
						font-size: 12px
						color: rgb(147, 153, 159)
		.rating-wrapper
			padding 0 18px

			.rating-item
				display: flex
				padding 18px 0
				border-1px(rgba(7, 17, 27, .1))

				.avatar
					flex: 0 0 28px
					width: 28px
					margin-right: 12px

					img
						border-radius: 50%
					
				.content
					position: relative
					flex: 1
						
					.name
						margin-bottom: 4px
						line-height: 12px
						font-size: 10px
						color: rgb(7, 17, 27)

					.star-wrapper
						margin-bottom: 6px
						font-size: 0

						.star
							display: inline-block
							margin-right: 6px
							vertical-align: top
						
						.delivery
							display: inline-block
							vertical-align: top
							line-height: 12px
							font-size: 10px
							color: rgb(147, 153, 159)

					.text
						margin-bottom: 8px
						line-height: 18px
						font-size: 12px
						color: rgb(7, 17, 27)

					.recommend
						line-height: 16px
						font-size: 0

						.icon-thumb_up, .item
							display: inline-block
							margin: 0 8px 4px 0
							font-size: 9px
							
						.icon-thumb_up
							color: rgb(0, 160, 220)

						.item
							padding: 0 6px
							border: 1px solid rgba(7, 17, 27, .1)
							border-radius: 1px
							color: rgb(147, 153, 159)
							background-color: #FFF

					.time
						position: absolute
						top: 0
						right: 0
						line-height: 12px
						font-size: 10px
						color: rgb(147, 153, 159)

</style>
