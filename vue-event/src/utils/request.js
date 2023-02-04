import axios from 'axios'

// myAxios请求时地址baseurl+URL，然后请求后台
const myAxios = axios.create({
  baseURL: 'http://big-event-vue-api-t.itheima.net'
})

export default myAxios
