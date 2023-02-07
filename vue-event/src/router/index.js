import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/layout'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/home')
      },
      {
        path: 'user-info',
        component: () => import('@/views/user/userInfo')
      },
      {
        path: 'user-avatar',
        component: () => import('@/views/user/userAvatar')
      },
      {
        path: 'user-pwd',
        component: () => import('@/views/user/userPwd')
      },
      {
        path: 'art-cate',
        component: () => import('@/views/article/artCate')
      },
      {
        path: 'art-list',
        component: () => import('@/views/article/artList')
      }
    ]
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

let whiteList = ['/login', '/reg'] // 白名单，无需登录即可访问
// 浏览器第一次打开会触发一次全局守卫
router.beforeEach((to, from, next) => {
  const token = store.state.token
  if (token) {
    // 已经登录
      if (!store.state.userInfo.username) {
        store.dispatch('getUserInfoActions')
      }
      next()
  } else {
    // 未登录
    // 强制跳转登陆页面
    // 数组.includes 判断值是否在数组出现过
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router

// 退出登录重新登录，只走相关组件代码 （异步dom切换，不会导致所有代码重新执行）
// 应该在登录页面登录后再发请求去获取用户信息
// 可以在全局前置路由守卫中写路由跳转时获取
