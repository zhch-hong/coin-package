import Vue from 'vue'
import Router from 'vue-router'

/* Layout */
import Layout from '@/layout'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/',
    redirect: '/package/package-sales'
  },
  {
    path: '/package',
    component: Layout,
    redirect: '/package/package-sales',
    meta: { title: '套餐销售', icon: 'salePackage', offline: true },
    children: [
      {
        path: 'package-sales',
        name: 'package-sales',
        component: () => import('../views/package/index'),
        meta: { title: '套餐销售', icon: 'smile' }
      },
      {
        path: 'package-confirm-order',
        name: 'package-confirm-order',
        component: () => import('../views/package/components/package-confirm-order'),
        meta: { title: '确认订单', icon: 'smile' }
      },
      {
        path: 'package-settle',
        name: 'package-settle',
        hidden: true,
        component: () => import('../views/package/components/package-settle'),
        meta: { title: '订单结算', icon: 'smile' }
      },
      {
        path: 'renewal-settle',
        name: 'renewal-settle',
        hidden: true,
        component: () => import('../views/package/components/renewal-settle'),
        meta: { title: '订单结算', icon: 'smile' }
      }
    ]
  },
  {
    path: '/gifts',
    component: Layout,
    redirect: '/gifts/index',
    meta: { title: '物品销售', icon: 'saleGoods', offline: true },
    children: [
      {
        path: '/gifts/index',
        name: 'gifts',
        component: () => import('../views/gifts/index'),
        meta: { title: '物品销售', icon: 'smile' }
      },
      {
        path: '/gifts/gifts-confirm-order',
        name: 'giftsConfirmOrder',
        component: () => import('../views/gifts/components/gifts-confirm-order'),
        meta: { title: '确认订单', icon: 'smile' }
      },
      {
        path: '/gifts/settle',
        name: 'giftSettle',
        hidden: true,
        component: () => import('../views/gifts/components/settle'),
        meta: { title: '订单结算', icon: 'smile' }
      }
    ]
  },
  {
    path: '/userInfo',
    component: Layout,
    redirect: '/userInfo/index',
    meta: { title: '会员管理', icon: 'memberManage' },
    children: [
      {
        path: '/userInfo/index',
        name: 'userInfo',
        component: () => import('../views/userInfo/index'),
        meta: { title: '会员查询', icon: 'smile' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    meta: { title: '会员操作', icon: 'memberActions' },
    children: [
      {
        path: '/user/index',
        name: 'user',
        component: () => import('../views/user/index'),
        meta: { title: '会员操作', icon: 'smile' }
      }
    ]
  },
  {
    path: '/coupons',
    component: Layout,
    redirect: '/coupons/index',
    meta: { title: '优惠券核销', icon: 'validateCoupons' },
    children: [
      {
        path: '/coupons/index',
        name: 'useCoupons',
        component: () => import('../views/coupons/index'),
        meta: { title: '优惠券核销', icon: 'smile' }
      }
    ]
  },
  {
    path: '/exchange',
    component: Layout,
    redirect: '/exchange/index',
    meta: { title: '物品兑换', icon: 'integralExchange' },
    children: [
      {
        path: '/exchange/index',
        name: 'exchange',
        component: () => import('../views/exchange/index'),
        meta: { title: '物品兑换', icon: 'smile' }
      }
    ]
  },
  {
    path: '/coin',
    component: Layout,
    redirect: '/coin/index',
    meta: { title: '其他操作', icon: 'otherActions', offline: true },
    children: [
      {
        path: '/coin/index',
        name: 'coin',
        component: () => import('../views/coin/index'),
        meta: { title: '其他操作', icon: 'message center' }
      }
    ]
  },
  {
    path: '/settle',
    component: Layout,
    redirect: '/settle/settle',
    meta: { title: '班结', icon: 'shiftSettle' },
    children: [
      {
        path: '/settle/settle',
        name: 'settle',
        component: () => import('@/views/settle/settle'),
        meta: { title: '班结', icon: 'Household appliances' }
      }
    ]
  },
  {
    path: '/HBSales',
    component: Layout,
    redirect: '/HBSales/HBSales',
    meta: { title: '嗨呗专销', icon: 'HBSales' },
    children: [
      {
        path: '/HBSales/HBSales',
        name: 'HBSales',
        component: () => import('@/views/HBSales/index'),
        meta: { title: '嗨呗专销', icon: 'Household appliances' }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404/404'),
    hidden: true
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
