import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入组件
import Login from 'pages/Login.vue'
import Register from 'pages/Register.vue'
import Personal from 'pages/Personal.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { name: 'login', path: '/login', component: Login },
  { name: 'register', path: '/register', component: Register },
  { name: 'personal', path: '/personal', component: Personal }
]

const router = new VueRouter({
  routes
})
// 需要授权访问的页面数组
const authorizationPagesArr = ['personal']
// 全局路由导航守卫, 在每次路由跳转之前都会执行
router.beforeEach((to, from, next) => {
  const res = authorizationPagesArr.findIndex(item => item === to.name)
  const token = localStorage.getItem('token')
  console.log(res)
  // 如果访问的是授权页面, 且没有token 就跳转到登录页
  // 先经过路由导航守卫, 再经过axios请求
  if (res !== -1 && !token) {
    Vue.prototype.$toast('请先登录再访问')
    next('/login')
  } else {
    next()
  }
})

export default router
