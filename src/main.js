import Vue from 'vue'
// 根组件
import App from './App'
// 路由
import router from 'router/index.js'
// 全局样式文件
import 'styles/base.scss'
import 'styles/iconfont.scss'
import 'vant/lib/index.css'
/* 插件 开始 */
// 配置rem布局
import 'lib-flexible'
// axios 发送请求
import axios from 'axios'
// vant 组件
import Vant from 'vant'
// moment 处理时间
import moment from 'moment'
/* 插件结束 */
/* 全局组件开始 */
import JstInput from 'components/jst-input.vue'
import JstButton from 'components/jst-button.vue'
import JstNav from 'components/jst-nav.vue'
import JstHeader from 'components/jst-header.vue'
import JstUser from 'components/jst-user.vue'
import JstComment from 'components/jst-comment.vue'
import JstTop from 'components/jst-top.vue'
import JstProduct from 'components/jst-product.vue'
/* 全局组件 结束 */
// vue 相关插件 use
Vue.use(Vant)
/* 注册全局组件 开始 */
Vue.component('JstInput', JstInput)
Vue.component('JstButton', JstButton)
Vue.component('JstNav', JstNav)
Vue.component('JstHeader', JstHeader)
Vue.component('JstUser', JstUser)
Vue.component('JstComment', JstComment)
Vue.component('JstTop', JstTop)
Vue.component('JstProduct', JstProduct)
/* 注册全局组件 结束 */
/* 设置axios 开始 */
axios.defaults.baseURL = 'http://localhost:3000'
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在每次发送请求之前添加token
  const token = localStorage.getItem('token')
  // token存在才添加, 不存在就不添加了
  if (token) {
    config.headers.Authorization = token
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 如果响应状态码为401, 表示token失效, 跳回到登录页
  const { statusCode, message } = response.data
  if (statusCode === 401) {
    Vue.prototype.$toast(message)
    router.push('/login')
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})
/* 设置axios 结束 */
/* 注册全局过滤器 开始 */
// 拼接url的过滤器
Vue.filter('jointUrl', value => {
  if (!value.startsWith('http')) {
    return axios.defaults.baseURL + value
  } else {
    return value
  }
})
// 处理时间的过滤器
Vue.filter('handleTime', (value, params = 'YYYY-MM-DD') => {
  return moment(value).format(params)
})
/* 注册全局过滤器 结束 */
/* 注册全局自定义指令 开始 */
Vue.directive('focus', {
  inserted (el) {
    el.focus()
  }
})
/* 注册全局自定义指令 结束 */
/* 向Vue原型挂载方法 开始 */
Vue.prototype.$axios = axios
/* 向Vue原型挂载方法 结束 */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
