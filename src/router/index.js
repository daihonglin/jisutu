import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入组件
import Login from 'pages/Login.vue'
import Register from 'pages/Register.vue'
import Personal from 'pages/Personal.vue'
import EditInfo from 'pages/EditInfo.vue'
import Attention from 'pages/Attention.vue'
import Comment from 'pages/Comment.vue'
import Collect from 'pages/Collect.vue'
import Home from 'pages/Home.vue'
import TabManage from 'pages/TabManage.vue'
import Search from 'pages/Search.vue'
import ProductDetail from 'pages/ProductDetail.vue'

import Test from 'pages/Test.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/home' },
  { name: 'login', path: '/login', component: Login },
  { name: 'register', path: '/register', component: Register },
  { name: 'personal', path: '/personal', component: Personal },
  { name: 'editInfo', path: '/edit-info', component: EditInfo },
  { name: 'attention', path: '/attention', component: Attention },
  { name: 'comment', path: '/comment', component: Comment },
  { name: 'collect', path: '/collect', component: Collect },
  { name: 'home', path: '/home', component: Home },
  { name: 'tabManage', path: '/tab-manage', component: TabManage },
  { name: 'search', path: '/search', component: Search },
  { name: 'productDetail', path: '/product-detail/:id', component: ProductDetail },

  { name: 'test', path: '/test', component: Test }
]

const router = new VueRouter({
  routes
})
// 需要授权访问的页面数组
const authorizationPagesArr = ['personal', 'editInfo', 'attention', 'comment', 'collect', 'tabManage']
// 全局路由导航守卫, 在每次路由跳转之前都会执行
router.beforeEach((to, from, next) => {
  const res = authorizationPagesArr.findIndex(item => item === to.name)
  const token = localStorage.getItem('token')
  // 如果访问的是授权页面, 且没有token 就跳转到登录页
  // 先经过路由导航守卫, 再经过axios请求
  if (res !== -1 && !token) {
    Vue.prototype.$toast('请先登录再访问')
    router.push('/login')
  } else {
    next()
  }
})

export default router
