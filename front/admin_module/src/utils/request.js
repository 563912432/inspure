import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL: 'http://117.50.43.204:8000/admin/v1', // url = base url + request url
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(config => {
  // 在发送请求之前做些什么
  if (getToken() || store.getters.token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
    config.headers['Authorization'] = getToken() || store.getters.token
  }
  config.data = qs.stringify(config.data) // 转为formdata数据格式
  return config
},
error => {
  // 对请求错误做些什么
  console.log(error) // for debug
  return Promise.reject(error)
})

// 添加响应拦截器
service.interceptors.response.use(response => {
  const res = response.data
  if (res.error_code) {
    const msg = res.data[0] || res.msg || '网络连接错误'
    Message({
      message: msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(new Error(msg || 'Error'))
  } else {
    return res
  }
},
error => {
  if (error.response.status === 401) {
    // Message.error('您已经在其他终端登录，被迫下线')
    setTimeout(() => {
      window.location.href = window.domain
    }, 1500)
  } else {
    console.log('err' + error) // for debug
    Message({
      message: error.message || '网络连接失败',
      type: 'error',
      duration: 5 * 1000
    })
  }
  return Promise.reject(error)
})

export default service
