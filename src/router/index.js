import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ZlView from '../views/Zl.vue'
import CjjhtView from '../views/常见几何体.vue'
import Gui from '../views/gui.vue'
import Jht from '../views/几何体.vue'
import Wltt from '../views/纹理贴图.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
      
    },
    {
      path: '/zhenlie',
      name: 'zl',
      component: ZlView
    },
    {
      path: '/wltt',
      name: 'zl',
      component: Wltt
    },
    {
      path: '/zht',
      name: 'Jht',
      component: Jht
    },
    {
      path: '/jht',
      name: '常见几何体',
      component: CjjhtView
    },
    {
      path: '/gui',
      name: 'GUI',
      component: Gui
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
