<template>
    <div class="goods">
        <div class="menu-wrapper" ref="menuwrapper">
					<ul>
						<li v-for="(item, index) in goods" class="menu-item" :class="{'current': currentIndex === index}" @click="selectMenu(index,$event)">
							<span class="text border-1px">
								<!--如果有活动，则显示活动种类图标-->
								<span v-show="item.type > 0" class="icon" :class="classMap[item.type]"></span>
								{{ item.name }}
							</span>
						</li>
					</ul>
        </div>
        <div class="foods-wrapper" ref="foodswrapper">
						<!--  显示和左边 menu 菜单栏对应的销售食品区域-->
            <ul>
							<li v-for="item in goods" class="foos-list food-list-hook">
								<h1 class="title">{{ item.name }}</h1>
								<!-- 一个销售区域可能有多个食品销售 -->
								<ul>
									<li @click="selectFood(food, $event)" v-for="food in item.foods" class="food-item border-1px">
										<!-- 单个食品 image-->
										<div class="icon">
											<img width="57" height="57" :src="food.icon">
										</div>
										<!-- 单个食品内容简介 -->
										<div class="content">
											<!-- 食品名字 -->
											<h2 class="name">{{ food.name }}</h2>
											<!-- 单个食品内容文字介绍 -->
											<p class="desc">{{ food.description }}</p>
											<div class="extra">
												<span class="count">月售{{ food.sellCount }}份</span><span>好评率{{ food.rating }}%
											</div>
											<!-- 单个食品价钱 -->
											<price :food="food"></price>
											<!-- 食物数量 -->
											<div class="cartcontrol-wrapper">
												<cartcontrol :food="food"></cartcontrol>
											</div>
										</div>
									</li>
								</ul>
							</li>
						</ul>
						
					<!--<div class="top-tip">
						<span class="text">上面空空如也哦~</span>
					</div>-->
        </div>
				<shopcart ref="shopcart" 
					:select-foods="selectFoods" 
					:delivery-price="seller.deliveryPrice" 
					:min-price="seller.minPrice"
				>
				</shopcart>

			<food :food="selectedFood" ref="food"></food>
    </div>
</template>

<script>
	import BScroll from 'better-scroll'
	import shopcart from 'components/shopcart/shopcart' // 购物车组件
	import cartcontrol from 'components/cartcontrol/cartcontrol'
	import food from 'components/food/food'
	import price from 'components/price/price'

	const ERR_OK = 0

	export default {
		props: {
			seller: Object
		},
		data() {
			return {
				goods: [], // 商品信息（data）
				listHeight: [], // 每个食品分区的高度
				scrollY: 0,
				selectedFood: {}
			}
		},
		computed: {
			currentIndex() {
				for(let i = 0; i < this.listHeight.length; i++) {
					let height1 = this.listHeight[i]
					let height2 = this.listHeight[i + 1]

					if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)) { // 判断当前位置是否大于这个区域且小于下个区域
						return i
					}
				}
				return 0
			},
			selectFoods() {
				let foods = []
				this.goods.forEach((good) => {
					good.foods.forEach((food) => {
						if(food.count) {
							foods.push(food)
						}
					})
				})

				return foods
			}
		},
		created() {
			this.$on('cart.add', this.cartAdd)

			this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'] // 显示 icon type 的类名

			this.$http.get('/api/goods').then((res) => {
        res = res.body // 储存用异步获取的数据（data）

        if(res.errno === ERR_OK) {
          this.goods = res.data // 把获取到的数据（data）存储到 this.goods 里面

					this.$nextTick(() => { // 在 dom 完全渲染完之后才开执行下面的代码
						this._initScroll() // 初始化需要滚动的区域
						this._calculateHeight() // 获取每个区间的高度
					})
        }
      })
		},
		methods: {
			_drop(target) {
				this.$refs.shopcart.drop(target)
			},
			cartAdd(target) {
				this._drop(target)
			},
			selectMenu(index, event) { // 点击左边 menu 会滚动到相关区域
				if(!event._constructed) {
					return
				}
				let foodList = this.$refs.foodswrapper.getElementsByClassName('food-list-hook')
				let el = foodList[index]
				this.foodsScroll.scrollToElement(el, 300)
			},
			selectFood(food, event) {
				if(!event._constructed) {
					return
				}
				
				this.selectedFood = food
				this.$refs.food.show()
			},
			_initScroll() { // 初始化需要滚动的区域
				this.menuScroll = new BScroll(this.$refs.menuwrapper, {
					click: true,
					bounceTime: 500
				})

				this.foodsScroll = new BScroll(this.$refs.foodswrapper, {
					click: true,
					probeType: 3,
					bounceTime: 500
				})

				this.foodsScroll.on('scroll', (pos) => { // 监听 foods 区域滚动事件
					this.scrollY = Math.abs(Math.round(pos.y)) // 如果滚动了，则把当前滚动到的位置的 Y 值传给在 data 里面定义的scrollY
				})
			},
			_calculateHeight() { // 获取分区的距离顶部的高度
				let foodList = this.$refs.foodswrapper.getElementsByClassName('food-list-hook')
				let height = 0
				this.listHeight.push(height)

				for(let i = 0; i < foodList.length; i++) {
					let item = foodList[i] // 储存 foodList 上次获得的区域离顶部的高度
					height += item.clientHeight // 储存此次区域离顶部的高度
					this.listHeight.push(height) // 把此次获得的高度加入到 listHeight 数组中
				}
			}
		},
		components: {
			shopcart, // 购物车
			cartcontrol, // 购物车数量
			food,
			price
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import '../../common/stylus/mixin'

	.goods
		display: flex
		position: absolute
		top: 174px
		bottom: 46px
		width: 100%
		overflow: hidden
		
		.menu-wrapper
			flex: 0 0 80px
			width: 80px
			background-color: #F3F5F7

			.menu-item
				display: table
				width: 56px
				height: 54px
				line-height: 14px
				padding: 0 12px

				&.current
					position: relative
					margin-top: -1px
					z-index: 10
					border-left: 2px solid #00c7ff
					font-weight: 700
					background-color: #FFF

					.text
						border-none()
		
				.icon
						display: inline-block
						vertical-align: top
						width: 12px
						height: 12px
						margin-right: 2px
						background-size: 12px 12px
						background-repeat: no-repeat

						&.decrease
							bg-image('decrease_3')
						&.discount
							bg-image('discount_3')
						&.guarantee
							bg-image('guarantee_3')
						&.invoice
							bg-image('invoice_3')
						&.special
							bg-image('special_3')

				.text
					display: table-cell
					width: 56px
					vertical-align: middle
					font-size: 12px
					border-1px(rgba(7,17,27,.1))
					
		.foods-wrapper
			flex: 1

			.foos-list
				position: relative
				z-index: 10
				background: #FFF

				.title
					padding-left: 14px
					height: 26px
					line-height: 26px
					border-left: 2px solid #D9DDE1
					font-size: 12px
					color: rgb(147,153,159)
					background-color: #F3F5F7
				
				.food-item
					display: flex
					margin: 18px
					padding-bottom: 18px
					border-1px(rgba(7,17,27,.1))

					&:last-child
						border-none()
						margin-bottom: 0
						
					.icon
						flex: 0 0 57px
						margin-right: 10px

					.content
						flex: 1

						.name
							margin: 2px 0 8px
							height: 14px
							line-height: 14px
							font-size: 14px
							color: rgb(7,17,27)
							text-overflow: ellipsis
							white-space: nowrap
							overflow: hidden
						
						.desc, .extra
							line-height: 10px
							font-size: 10px
							color: rgb(147,153,159)

						.desc
							margin-bottom: 8px
							line-height: 12px

						.extra
							.count
								margin-right: 12px

						.cartcontrol-wrapper
							position: absolute
							bottom: 12px
							right: 0

			.top-tip
				position: absolute
				top: 20px
				left: 45%
				z-index: -1
				color: #E1E1E1

</style>
