import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import organRouter from './modules/organ'
import gameRouter from './modules/game'
import teachingPackageRouter from './modules/teachingPackage'

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
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * 固定路由
 * 不需要权限验证的基础页面
 * 所有用户都可以访问
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/eYunIndex',
    component: () => import('@/views/account-ku-set/e-yun-index'),
    name: 'EYunIndex',
    meta: { title: '易云系统', noCache: true },
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true, show: 1 }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * 异步权限
 * 需要根据当前登录用户的身份来动态加载的菜单
 */
export const asyncRoutes = [
  organRouter,
  teachingPackageRouter,
  // 题库管理
  {
    path: '/objKu',
    component: Layout,
    meta: { title: '理论题库', icon: 'obj-line' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/obj-ku/index'),
        name: 'ObjKu',
        meta: { title: '理论题库', noCache: true }
      },
      {
        path: 'addTimu/:id?',
        component: () => import('@/views/obj-ku/add-timu'),
        name: 'AddTimu',
        meta: { title: '题库 - 试题录入', noCache: true },
        hidden: true
      }
      /* {
        path: 'dictionaryItem',
        component: () => import('@/views/obj-ku/dictionary-item'),
        name: 'DictionaryItem',
        meta: { title: '题库 - 库字典设置', noCache: true },
        hidden: true
      }*/
    ]
  },
  // 实训题库管理
  {
    path: '/accountKu',
    component: Layout,
    meta: { title: '实训题库', icon: 'account-ku-line' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/account-ku-set/index'),
        name: 'AccountKuSet',
        meta: { title: '实训题库', noCache: true }
      },
      {
        path: 'addAccount/:id?',
        component: () => import('@/views/account-ku-set/add-account'),
        name: 'AddAccount',
        meta: { title: '实训题库-新建账套', noCache: true },
        hidden: true
      },
      {
        path: 'addAccountData/:id',
        component: () => import('@/views/account-ku-set/add-account-data'),
        name: 'AddAccountData',
        meta: { title: '实训题库-数据添加', noCache: true },
        hidden: true
      }
    ]
  },
  // 实景实训管理
  {
    path: '/practicalTrain',
    component: Layout,
    meta: { title: '实景实训管理', icon: 'shi-jing-line' },
    children: [
      {
        path: 'nationalTax',
        component: () => import('@/views/practical-train/national-tax'),
        name: 'NationalTax',
        meta: { title: '国税管理', noCache: true }
      },
      {
        path: 'personalTax',
        component: () => import('@/views/practical-train/personal-tax'),
        name: 'PersonalTax',
        meta: { title: '个税管理', noCache: true }
      },
      {
        path: 'invoice',
        component: () => import('@/views/practical-train/invoice'),
        name: 'Invoice',
        meta: { title: '开票管理', noCache: true }
      },
      {
        path: 'certificate',
        component: () => import('@/views/practical-train/certificate'),
        name: 'Certificate',
        meta: { title: '认证管理', noCache: true }
      },
      {
        path: 'manual',
        component: () => import('@/views/practical-train/manual'),
        name: 'Manual',
        meta: { title: '会计手工账管理', noCache: true }
      }
    ]
  },
  // 考试管理
  gameRouter,
  // 错题管理
  {
    path: '/wrong',
    component: Layout,
    meta: { title: '错题管理', icon: 'account-ku-line' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/wrong/index'),
        name: 'Wrong',
        meta: { title: '错题管理', noCache: true }
      }
    ]
  },
  // 权限
  {
    path: '/auth',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Auth',
    meta: { title: '用户权限管理', icon: 'auth-line', noCache: true },
    children: [
      {
        path: 'menu',
        component: () => import('@/views/auth/menu'),
        name: 'Menu',
        meta: { title: '菜单管理', noCache: true }
      },
      {
        path: 'authRole',
        component: () => import('@/views/auth/auth-role'),
        name: 'AuthRole',
        meta: { title: '角色管理', noCache: true }
      },
      {
        path: 'AssignUser/:id',
        component: () => import('@/views/auth/assign-user'),
        name: 'AssignUser',
        meta: { title: '角色权限分配', noCache: true },
        hidden: true
      },
      {
        path: 'user',
        component: () => import('@/views/auth/user'),
        name: 'User',
        meta: { title: '用户管理', noCache: true }
      }
    ]
  },
  // 操作日志
  {
    path: '/handleLog',
    component: Layout,
    meta: { title: '操作日志', icon: 'handle-log-line' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/handle-log/index'),
        name: 'HandleLog',
        meta: { title: '操作日志', noCache: true }
      }
    ]
  },
  // 站内信
  {
    path: '/mail',
    component: Layout,
    meta: { title: '站内信', icon: 'mail-line' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/mail/index'),
        name: 'Mail',
        meta: { title: '站内信', noCache: true }
      },
      {
        path: 'setMail/:id?',
        component: () => import('@/views/mail/set-mail'),
        name: 'SetMail',
        meta: { title: '站内信 - 写信', noCache: true },
        hidden: true
      }
    ]
  },
  // 大数据分析
  {
    path: '/dataAnalysis',
    component: Layout,
    name: 'DataAnalysis',
    meta: { title: '大数据分析', icon: 'data-analysis', noCache: true },
    children: [
      {
        path: 'index',
        component: () => import('@/views/dataAnalysis/exam'),
        name: 'DataAnalysisExam',
        meta: { title: '考试分析', noCache: true }
      },
      {
        path: 'dataAnalysisExamDetail/:id',
        component: () => import('@/views/dataAnalysis/exam-detail'),
        name: 'DataAnalysisExamDetail',
        meta: { title: '考试分析详情', noCache: true },
        hidden: true
      },
      {
        path: 'student',
        component: () => import('@/views/dataAnalysis/student'),
        name: 'DataAnalysisStudent',
        meta: { title: '学生分析', noCache: true }
      },
      {
        path: 'dataAnalysisStudentDetail/:id',
        component: () => import('@/views/dataAnalysis/student-detail'),
        name: 'DataAnalysisStudentDetail',
        meta: { title: '学生分析详情', noCache: true },
        hidden: true
      }
    ]
  },
  //
  // /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
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
