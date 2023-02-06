import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/layout')
  },
  {
    path: '/reg',
    component: () => import('@/views/register')
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const token = store.state.token
  if (token && !store.state.userInfo.username) {
    store.dispatch('getUserInfoActions')
  }

  next()
})

export default router

// 退出登录重新登录，只走相关组件代码 （异步dom切换，不会导致所有代码重新执行）
// 应该在登录页面登录后再发请求去获取用户信息
// 可以在全局前置路由守卫中写路由跳转时获取
