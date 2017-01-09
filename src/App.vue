<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <!-- tab 选项-->
    <div class="tab border-1px">
      <!-- vue 2.0 v-link 替换成了 router-link -->
      <div class="tab-item">
				<router-link :to="{path: '/goods'}" replace>
					商品
				</router-link>
      </div>
      <div class="tab-item">
				<router-link :to="{path: '/ratings'}" replace>
					评论
				</router-link>
      </div>
      <div class="tab-item">
				<router-link :to="{path: '/seller'}" replace>
					商家
				</router-link>
      </div>
    </div>

    <!-- 加个切换过渡效果，体验更棒 -->
    <transition name="moveIn" mode="out-in">
      <!-- 保持路由切换时的状态 -->
      <keep-alive>
        <!-- router-view 是用来显示改变了路由的内容-->
        <router-view :seller="seller" class="view"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
  import { urlParse } from 'common/js/util'
  import header from './components/header/header'

  const ERR_OK = 0

  export default {
    data() {
        return {
          seller: {
            id: (() => {
              let queryParm = urlParse()

              return queryParm.id
            })()
          }
        }
    },
    created() {
      this.$http.get('/api/seller?id=' + this.seller.id).then((res) => { // 用 vue-resource ajax 获取数据，本次 demo 是用的是 mock 模拟数据
        res = res.body // res 为获取到的数据（data）

        if(res.errno === ERR_OK) {
          // this.seller = res.data
          this.seller = Object.assign({}, this.seller, res.data)
        }
      })
    },
    components: { // 注册组件
      'v-header': header
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "./common/stylus/mixin.styl"

    .tab
      display: flex
      width: 100%
      height: 40px
      line-height: 40px
      border-1px(rgba(7, 17, 27, .1))

      .tab-item
        flex: 1
        text-align: center

        & > a 
          display: block
          color: rgb(77, 85, 93)

          &.router-link-active
            color: rgb(240, 20, 20)
    .view
      transition: all .1s ease-in-out
    
      &.moveIn-enter, &.moveIn-leave-active
        opacity: 0
</style>