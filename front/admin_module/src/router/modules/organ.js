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
      path: 'account',
      component: () => import('@/views/organ/account'),
      name: 'Account',
      meta: { title: '机构账户管理', noCache: false }
    },
    {
      path: 'spaceManage',
      component: () => import('@/views/organ/space-manage'),
      name: 'SpaceManage',
      meta: { title: '场地管理', noCache: false }
    },
    {
      path: 'resourcesManage',
      component: () => import('@/views/organ/resources-manage'),
      name: 'ResourcesManage',
      meta: { title: '机构资源管理', noCache: false }
    }
  ]
}

export default organRouter
