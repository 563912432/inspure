/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const organRouter = {
  path: '/organ',
  component: Layout,
  name: 'Organ',
  meta: { title: '机构管理', icon: 'organ-line', noCache: true },
  children: [
    {
      path: 'orgMenu',
      component: () => import('@/views/organ/menu'),
      name: 'OrgMenu',
      meta: { title: '机构菜单管理', noCache: false }
    },
    {
      path: 'module',
      component: () => import('@/views/organ/module'),
      name: 'Module',
      meta: { title: '模块自定义', noCache: false }
    },
    {
      path: 'account',
      component: () => import('@/views/organ/account'),
      name: 'Account',
      meta: { title: '机构账户管理', noCache: false }
    },
    {
      path: 'moduleTikuDetail/:id',
      component: () => import('@/views/organ/module-tiku-detail'),
      name: 'ModuleTikuDetail',
      meta: { title: '模块开启信息', noCache: true },
      hidden: true
    },
    {
      path: 'account-ku-set/:id',
      component: () => import('@/views/organ/account-ku'),
      name: 'AccountKu',
      meta: { title: '账套库信息', noCache: true },
      hidden: true
    },
    {
      path: 'spaceManage',
      component: () => import('@/views/organ/space-manage'),
      name: 'SpaceManage',
      meta: { title: '场地管理', noCache: false }
    }
  ]
}

export default organRouter
