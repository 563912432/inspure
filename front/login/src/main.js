import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import qs from 'qs'
import { Input, Radio, RadioGroup, Checkbox, Button, Form, FormItem, Icon, Tooltip, Message } from 'element-ui'
import '@/styles/element-variables.scss'
import '@/styles/index.scss' // 全局css

Vue.use(Input)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Checkbox)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Icon)
Vue.use(Tooltip)

window.axios = axios
window.axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
window.axios.defaults.timeout = 5000
// 添加请求拦截器
window.axios.interceptors.request.use((config) => {
  // 在发送请求之前做些什么
  config.data = qs.stringify(config.data) // 转为formdata数据格式
  return config
}, error => {
  return Promise.reject(error)
})
// 添加响应拦截器
window.axios.interceptors.response.use(response => {
  return response
},
error => {
  console.log('err' + error) // for debug
  Message({
    message: error.message || '网络连接失败',
    type: 'error',
    duration: 5 * 1000
  })
  return Promise.reject(error)
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
