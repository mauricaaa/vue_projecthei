import axios from 'axios'
import store from '@/store'

// myAxios请求时地址baseurl+URL，然后请求后台
const myAxios = axios.create({
  baseURL: 'http://big-event-vue-api-t.itheima.net'
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

export default myAxios
