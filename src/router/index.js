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
      redirect: '/zhenlie',
      component: HomeView,
      children: [
        {
          path: '/zhenlie',
          name: '阵列',
          component: ZlView
        },
        {
          path: '/wltt',
          name: '纹理贴图',
          component: Wltt
        },
        {
          path: '/zht',
          name: '几何体',
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
          name: '机床',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('../views/AboutView.vue')
        },
        {
          path: '/djl',
          name: '点精灵辉光',
          component: () => import('../views/点精灵辉光.vue')
        },
        {
          path: '/qx',
          name: '曲线',
          component: () => import('../views/曲线.vue')
        },
        {
          path: '/bezier',
          name: '样条、贝塞尔曲线',
          component: () => import('../views/样条曲线and贝塞尔曲线.vue')
        },
        {
          path: '/fxgj',
          name: '飞线轨迹',
          component: () => import('../views/飞线轨迹.vue')
        },
        {
          path: '/qxgd',
          name: '曲线管道',
          component: () => import('../views/曲线管道.vue')
        },
        {
          path: '/xzcx',
          name: '旋转成型',
          component: () => import('../views/旋转成型.vue')
        },
        {
          path: '/lscx',
          name: '拉伸成型',
          component: () => import('../views/拉伸.vue')
        },
        {
          path: '/lxsy',
          name: '螺旋试验',
          component: () => import('../views/螺旋功能试验.vue')
        },
        {
          path: '/cssbj',
          name: 'css布局',
          component: () => import('../views/css布局.vue')
        },
        {
          path: '/mxct',
          name: '深度冲突(模型闪烁)',
          component: () => import('../views/深度冲突(模型闪烁).vue')
        },
        {
          path: '/dbxlk',
          name: '多边形轮廓',
          component: () => import('../views/多边形轮廓.vue')
        },
        {
          path: '/dbxlkyh',
          name: '多边形轮廓(圆弧)',
          component: () => import('../views/多边形轮廓圆弧.vue')
        },
        {
          path: '/dbxnk',
          name: 'Shape内孔.holes',
          component: () => import('../views/内孔holes.vue')
        },
        {
          path: '/mxbjx',
          name: '模型边界线',
          component: () => import('../views/模型边界线.vue')
        },
        {
          path: '/jhtcolor',
          name: '几何体顶点颜色',
          component: () => import('../views/几何体顶点颜色.vue')
        },
        {
          path: '/bwh',
          name: '包围盒',
          component: () => import('../views/包围盒.vue')
        },
        {
          path: '/gdmy',
          name: '管道漫游',
          component: () => import('../views/管道漫游.vue')
        },
        {
          path: '/sprite',
          name: '精灵模型',
          component: () => import('../views/精灵模型Sprite.vue')
        },
        {
          path: '/xiayu',
          name: '精灵模型下雨',
          component: () => import('../views/sprite雨滴.vue')
        },
        {
          path: '/fgmb',
          name: '后处理',
          component: () => import('../views/后处理发光描边.vue')
        },
        {
          path: '/dtdzh',
          name: '多通道组合',
          component: () => import('../views/多通道组合.vue')
        },
        {
          path: '/ray',
          name: '射线Ray',
          component: () => import('../views/射线Ray.vue')
        },
        {
          path: '/mnzd',
          name: '模拟走刀',
          component: () => import('../views/模拟走刀.vue')
        },
        {
          path: '/nbzd',
          name: '内部走刀',
          component: () => import('../views/内部走刀.vue')
        },
        {
          path: '/nbzdgjxz',
          name: '内部走刀(工件旋转)',
          component: () => import('../views/内部走刀（工件旋转）.vue')
        },
        {
          path: '/cjbz',
          name: '场景标注标签',
          component: () => import('../views/场景标注标签.vue')
        },
        {
          path: '/djtjbz',
          name: '点击添加标注',
          component: () => import('../views/点击添加标注.vue')
        },
        {
          path: '/CSS3D',
          name: 'CSS3D渲染',
          component: () => import('../views/渲染标签CSS3D.vue')
        },
        {
          path: '/gjzdh',
          name: '关键帧动画',
          component: () => import('../views/关键帧动画.vue')
        },
        {
          path: '/tween',
          name: 'tween动画',
          component: () => import('../views/tween.vue')
        },
      ]

      
    },
    {
      path: '/demo',
      component: () => import('../views/demo.vue')
    }

  ]
})

export default router
