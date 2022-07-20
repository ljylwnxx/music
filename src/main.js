// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import md5 from 'js-md5'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import './assets/styles/iconfonts/iconfont.css'
import './assets/css/button.css'
import './assets/css/el-elment.css'
import './assets/css/global.css'
import VueLazyLoad from 'vue-lazyload'
import axios from 'axios'

import store from './store'
axios.defaults.withCredentials = true
Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(ElementUI)
Vue.prototype.$md5 = md5
/* 歌曲时长的过滤器 */
Vue.filter('timeFormat', function (time) {
  if (typeof time === 'undefined') return 0
  let minutes = parseInt(time / 60) // 获取时长分钟
  let seconds = parseInt(time % 60) // 获取时长秒数
  seconds = seconds < 10 ? '0' + seconds : seconds // 秒
  minutes = minutes < 10 ? '0' + minutes : minutes
  return minutes + ':' + seconds
})
/* 时间的过滤器 */
Vue.filter('dateFormat', function (time) {
  if (typeof time === 'undefined') return 0
  const t = new Date(time)
  let year = t.getFullYear()
  let mouth = t.getMonth() + 1
  let day = t.getDay()
  mouth = mouth < 10 ? '0' + mouth : mouth
  day = day < 10 ? '0' + day : day
  return year + '-' + mouth + '-' + day
})
/* 图片懒加载 */
Vue.use(VueLazyLoad, {
  preLoad: 1,
  error: require('./assets/images/error.jpg'),
  loading: require('./assets/images/loading.gif'),
  attempt: 3
})
Vue.filter('mvTopFormat', function (index) {
  if (typeof index === 'undefined') return
  return index < 10 ? '0' + index : index
})
/* 播放数量的过滤器 */
Vue.filter('countFormat', function (count) {
  if (typeof count === 'undefined') return 0
  if (count < 10000) return count
  else return Math.floor(count / 10000) + '万'
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
