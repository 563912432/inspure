/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const gameRouter = {
  path: '/game',
  component: Layout,
  name: 'Game',
  meta: { title: '比赛管理', icon: 'organ-line', noCache: true },
  children: [
    {
      path: 'certificate',
      component: () => import('@/views/game/certificate'),
      name: 'Certificate',
      meta: { title: '证书管理', noCache: false }
    },
    {
      path: 'apply',
      component: () => import('@/views/game/apply'),
      name: 'Apply',
      meta: { title: '报名管理', noCache: false }
    },
    {
      path: 'examinfo',
      component: () => import('@/views/game/examInfo'),
      name: 'Examinfo',
      meta: { title: '考试信息管理', noCache: false }
    },
    {
      path: 'changegrade',
      component: () => import('@/views/game/examCorrection'),
      name: 'ExamCorrection',
      meta: { title: '成绩批改管理', noCache: false }
    },
    {
      path: 'exam',
      component: () => import('@/views/game/exam'),
      name: 'Exam',
      meta: { title: '试卷管理', noCache: false }
    },
    {
      path: 'foul',
      component: () => import('@/views/game/foul'),
      name: 'Foul',
      meta: { title: '考试违纪管理', noCache: false }
    },
    {
      path: 'correction/:type?',
      component: () => import('@/views/game/examCorrection'),
      name: 'ExamCorrection',
      meta: { title: '考试信息管理', noCache: false },
      hidden: true
    },
    {
      path: 'resultSearchDetail/:type',
      component: () => import('@/views/game/resultSearchDetail'),
      name: 'ResultSearchDetail',
      meta: { title: '成绩查询批改', noCache: false },
      hidden: true
    },
    {
      path: 'award',
      component: () => import('@/views/game/awardCertificate'),
      name: 'AwardCertificate',
      meta: { title: '证书发放管理', noCache: false }
    },
    {
      path: 'judge/:id',
      component: () => import('@/views/game/components/judge'),
      name: 'Judge',
      meta: { title: '成绩查询批改', noCache: false },
      hidden: true
    },
    {
      path: 'formationExam/:id?',
      component: () => import('@/views/game/components/formationExam'),
      name: 'FormationExam',
      meta: { title: '试卷管理', noCache: false },
      hidden: true
    }
    // {
    //   path: 'module',
    //   component: () => import('@/views/organ/module'),
    //   name: 'Module',
    //   meta: { title: '考试违纪管理', noCache: false }
    // }
  ]
}

export default gameRouter
