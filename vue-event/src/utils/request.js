import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'

export const baseURL = 'http://big-event-vue-api-t.itheima.net' // 接口和静态资源所在服务器地址
// myAxios请求时地址baseurl+URL，然后请求后台
const myAxios = axios.create({
  baseURL: baseURL
})

// 请求拦截器，每次调用request都会触发
myAxios.interceptors.request.use(function (config) {
  if (store.state.token) {
    config.headers.Authorization = store.state.token
  }
  // 在请求前会触发一次,它返回给axios内源码 config配置对象（要请求后台的参数都在这个对象上）
  return config
}, function (error) {
  return Promise.reject(error)
})

myAxios.interceptors.response.use(function (response) {
  // 响应状态码为2XX触发成功的回调，形参中的response是成功的结果
  return response
}, function (error) {
  if (error.response.status === 401) {
    // 本次响应是token过期了
    // 清除vuex，返回登录页面
    store.commit('updateToken', '')
    store.commit('updateUserInfo', {})
    router.push('/login')
    Message.error('用户身份过期')
  }
  return Promise.reject(error)
})

export default myAxios
