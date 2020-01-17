/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const teachingPackageRouter = {
  path: '/teachingPackage',
  component: Layout,
  name: 'TeachingPackage',
  meta: { title: '教学包管理', icon: 'organ-line', noCache: true },
  children: [
    {
      path: 'index',
      component: () => import('@/views/teaching-package/index'),
      name: 'TeachingPackage',
      meta: { title: '教学包管理', noCache: false }
    },
    {
      path: 'dictionaryItem',
      component: () => import('@/views/common/dictionary-item'),
      name: 'DictionaryItem',
      meta: { title: '库字典设置', noCache: true },
      hidden: true
    }
  ]
}

export default teachingPackageRouter
