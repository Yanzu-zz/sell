<template>
	<div class="header">
		<!--商家-->
		<div class="content-wrapper">
			<!--商家头像-->
			<div class="avatar">
				<img :src="seller.avatar" width="64" height="64">
			</div>
			<!--商家主要信息内容-->
			<div class="content">
				<!--标题-->
				<div class="title">
					<span class="brand"></span>
					<!--商家名字（店名）-->
					<span class="name">{{ seller.name }}</span>
				</div>
				<!--描述-->
				<!-- description 为描述 / deliveryTime 为 送达时间 -->
				<div class="description">
					<span>{{ seller.description }}</span>
					/ 
					<span>{{ seller.deliveryTime }} 分钟送达</span>
				</div>
				<!--减免活动-->
				<div v-if="seller.supports" class="supports">
					<span class="icon" :class="classMap[seller.supports[0].type]"></span>
					<span class="text">{{ seller.supports[0].description }}</span>
				</div>
			</div>
			<!--活动个数-->
			<div v-if="seller.supports" class="support-count" @click="showDetail">
				<span class="count">{{ seller.supports.length }}个</span>
				<i class="icon-keyboard_arrow_right"></i>
			</div>
		</div>
		<!-- 公告 -->
		<div class="bulletin-wrapper" @click="showDetail">
			<!-- 公告标题（其实是标题图标） --><!-- 公告文字 -->
			<span class="bulletin-title"></span><span class="bulletin-text">{{ seller.bulletin }}</span>
			<!-- 公告图标 -->
			<i class="icon-keyboard_arrow_right"></i>
		</div>
		<!--背景模糊图片-->
		<div class="background">
			<img :src="seller.avatar" width="100%" height="100%">
		</div>
		<transition name="fade" mode="out-in">
			<div v-show="detailShow" class="detail" transition="fade">
				<!--遮罩层内容-->
				<div class="detail-wrapper clearfix">
					<div class="detail-main">
						<!-- 商家名字 -->
						<h1 class="name">{{ seller.name }}</h1>
						<!-- 店家星数 -->
						<div class="star-wrapper">
							<star :size="48" :score="seller.score"></star>
						</div>
						<!-- 信息 -->
						<div class="title">
							<div class="line"></div>
							<div class="text">
								优惠信息
							</div>
							<div class="line"></div>
						</div>
						<!-- 活动信息 -->
						<ul v-if="seller.supports" class="supports">
							<li class="support-item" v-for="(item, index) in seller.supports">
								<span class="icon" :class="classMap[seller.supports[index].type]"></span>
								<span class="text">
									{{ seller.supports[index].description}}
								</span>
							</li>
						</ul>
						<div class="title">
							<div class="line"></div>
							<div class="text">
								商家公告
							</div>
							<div class="line"></div>
						</div>
						<!-- 公告 -->
						<div class="bulletin">
							<p class="content">{{ seller.bulletin }}</p>
						</div>
					</div>
				</div>
				<!--关闭遮罩层按钮-->
				<div class="detail-close" @click="hideDetail">
					<i class="icon-close"></i>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	import star from 'components/star/star'

	export default {
		props: {
			seller: {
				type: Object
			}
		},
		data() {
			return {
				detailShow: false // 决定遮罩层的显示和隐藏的变量
			}
		},
		methods: {
			showDetail() { // 显示遮罩层
				this.detailShow = true
			},
			hideDetail() { // 隐藏遮罩层
				this.detailShow = false
			}
		},
		created() {
			this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'] // 显示 icon type 的类名
		},
		components: {
			star // 注册组件
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin"

	.header
		position: relative
		color: #FFF
		overflow: hidden
		background-color: rgba(7,17,27,.5)

		.content-wrapper
			font-size: 0
			position: relative
			padding: 24px 12px 18px 24px

			.avatar
				display: inline-block
				vertical-align: top

				img
					border-radius: 2px
					
			.content
				display: inline-block
				margin-left: 16px

				.title
					margin: 2px 0 8px 0

					.brand
						display: inline-block
						vertical-align: top
						width: 30px
						height: 18px
						bg-image('brand')
						background-size: 30px 18px
						background-repeat: no-repeat
					
					.name
						margin-left: 6px
						font-size: 16px
						line-height: 18px
						font-weight: bold

				.description
					margin-bottom: 10px
					line-height: 12px
					font-size: 12px
				.supports
					.icon
						display: inline-block
						vertical-align: top
						width: 12px
						height: 12px
						margin-right: 4px
						background-size: 12px 12px
						background-repeat: no-repeat

						&.decrease
							bg-image('decrease_1')
						&.discount
							bg-image('discount_1')
						&.guarantee
							bg-image('guarantee_1')
						&.invoice
							bg-image('invoice_1')
						&.special
							bg-image('special_1')
					.text
						line-height: 12px
						font-size: 10px
		
			.support-count
				position: absolute
				right: 12px
				bottom: 13px
				padding: 0 8px
				height: 24px
				line-height: 24px
				border-radius: 14px
				text-align: center
				background-color: rgba(0,0,0,.2)

				.count
					vertical-align: top
					font-size: 10px
				
				.icon-keyboard_arrow_right
					line-height: 24px
					font-size: 10px

		.bulletin-wrapper
			position: relative
			height: 28px
			line-height: 28px
			padding: 0 22px 0 12px 
			text-overflow: ellipsis
			overflow: hidden
			white-space: nowrap
			background-color: rgba(7,17,27,.2)

			.bulletin-title
				display: inline-block
				vertical-align: top
				margin-top: 8px
				width: 22px
				height: 12px
				bg-image('bulletin')
				background-size: 22px 12px
				background-repeat: no-repeat
			.bulletin-text
				margin: 0 4px
				font-size: 10px
				vertical-align: top
			.icon-keyboard_arrow_right
				position: absolute
				top: 9px
				right: 10px
				font-size: 10px

		.background
			position: absolute
			top: 0
			left: 0
			width: 100%
			z-index: -1
			filter: blur(10px)

		.fade-enter-active, .fade-leave
			opacity: 1
			background-color: rgba(7,17,27,.8)
		
		.fade-enter, .fade-leave-active
			opacity: 0
			background-color: rgba(7,17,27,0)

		.detail
			position: fixed
			top: 0
			left: 0
			z-index: 100
			width: 100%
			height: 100%
			overflow: auto
			transition: all .5s
			backdrop: blur(10px)
			background-color: rgba(7,17,27,.8)
			
			.detail-wrapper
				width: 100%
				min-height: 100%

				.detail-main
					margin-top: 64px 
					padding-bottom: 64px

					.name
						line-height: 16px
						font-size: 16px
						text-align: center
						font-weight: 700

					.star-wrapper
						margin-top: 18px
						padding: 2px 0
						text-align: center

					.title
						display: flex 
						width: 80%
						margin: 30px auto 24px
						
						.line
							flex: 1
							position: relative
							top: -6px
							border-bottom: 1px solid rgba(255,255,255,.2)

						.text
							padding: 0 12px
							font-size: 14px
							font-weight: bold

					.supports
						width: 80%
						margin: 0 auto

						.support-item
							padding: 0 12px
							margin-bottom: 12px
							font-size: 0

							&.last-child
								magin-bottom: 0
							
							.icon
								display: inline-block
								width: 16px
								height: 16px
								vertical-align: top
								margin-right: 6px
								background-size: 16px 16px
								background-repeat: no-repeat

								&.decrease
									bg-image('decrease_2')
								&.discount
									bg-image('discount_2')
								&.guarantee
									bg-image('guarantee_2')
								&.invoice
									bg-image('invoice_2')
								&.special
									bg-image('special_2')
							.text
								line-height: 16px
								font-size: 12px

					.bulletin
						width: 80%
						margin: 0 auto
						
						.content
							padding: 0 12px
							line-height: 24px
							font-size: 12px
				
			.detail-close
				position: relative
				width: 32px
				height: 32px
				margin: -64px auto 0
				clear: both
				font-size: 32px

</style>
