import Vue from 'vue'
import VueRouter from 'vue-router' // 引入 vue-router
import VueResource from 'vue-resource' // 引入 vue-resource

import App from './App' // App 组件(核心组件)
import goods from 'components/goods/goods' // 商品组件
import ratings from 'components/ratings/ratings' // 评论组件
import seller from 'components/seller/seller' // 商家组件

import './common/stylus/index.styl'

// use vue middleware
Vue.use(VueRouter) // 路由，这个就不解释了
Vue.use(VueResource) // 这个 project 专门用 vue-resource 与后端通信来获取数据

const routes = [ // 相当于 1.0 的 router.map
  { path: '/goods', component: goods },
  { path: '/ratings', component: ratings },
  { path: '/seller', component: seller },
  { path: '/', redirect: '/goods' }
]

const router = new VueRouter({
  routes // （缩写）相当于 routes: routes
})

new Vue({ // 2.0 版本的 vue router 直接在 new Vue 下面生成
  router: router,
  render: h => h(App)
}).$mount('#app') // 创建并挂载到 #app (会替换 #app)
