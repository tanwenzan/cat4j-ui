import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/admin',
    name: 'Root',
    meta: {
      hidden: true
    }
  },
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFind',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  }
]

export const asyncRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/global',
    name: 'Admin',
    meta: {
      title: t('router.base.baseSetting'),
      icon: 'carbon:skill-level-advanced'
    },
    children: [
      // {
      //   path: 'menu',
      //   name: 'Menu',
      //   component: () => import('@/views/Admin/menu/menu.vue'),
      //   meta: {
      //     title: t('router.base.menu')
      //   }
      // }
      // {
      //   path: 'user',
      //   name: 'User',
      //   component: () => import('@/views/Admin/user/user.vue'),
      //   meta: {
      //     title: t('router.base.user')
      //   }
      // }
      // {
      //   path: 'global',
      //   name: 'Global',
      //   redirect: '/admin/global/menu',
      //   meta: {
      //     title: '全局管理'
      //   },
      //   children: [
      //     {
      //       path: 'menu',
      //       name: 'Menu',
      //       component: () => import('@/views/Admin/menu/menu.vue'),
      //       meta: {
      //         title: t('router.base.menu')
      //       }
      //     },
      //     {
      //       path: 'user',
      //       name: 'User',
      //       component: () => import('@/views/Admin/user/user.vue'),
      //       meta: {
      //         title: t('router.base.user')
      //       }
      //     }
      //   ]
      // }
      // {
      //   path: 'menu2',
      //   name: 'Menu2',
      //   component: () => import('@/views/Level/Menu2.vue'),
      //   meta: {
      //     title: t('router.menu2')
      //   }
      // }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export const resetRouter = (): void => {
  const resetWhiteNameList = ['Redirect', 'Login', 'NoFind', 'Root']
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
