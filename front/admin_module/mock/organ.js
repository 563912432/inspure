import Mock from 'mockjs'

const List = []
const count = 20

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    author: '@first',
    reviewer: '@first',
    title: '@title(5, 7)',
    content_short: 'mock data',
    content: baseContent,
    forecast: '@float(0, 100, 2, 2)',
    importance: '@integer(1, 3)',
    'type|1': ['模块方案', '题库方案'],
    // 'status|1': ['published', 'draft', 'deleted'],
    display_time: '@datetime',
    comment_disabled: true,
    pageviews: '@integer(300, 5000)',
    image_uri,
    platforms: ['a-platform'],
    number: '@integer(1, 200)',
    name: '@first',
    admin: '@first',
    address: '@title(1, 2)',
    contactName: '@first',
    contactTel: '@integer(1, 20000000000)',
    status: 1,
    plan: '@first',
    startTime: +Mock.Random.date('T'),
    openTime: +Mock.Random.date('T'),
    endTime: +Mock.Random.date('T'),
    month: '@integer(1, 12)',
    code: '@integer(1, 12)',
    trade: '@first'
  }))
}

export default [
  {
    url: '/organ/listModule',
    type: 'get',
    response: config => {
      const { type, title, page = 1, limit = 20 } = config.query

      const mockList = List.filter(item => {
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })
      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/organ/createModule',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/organ/updateModule',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  // 账户
  {
    url: '/organ/listAccount',
    type: 'get',
    response: config => {
      const { type, title, page = 1, limit = 20 } = config.query

      const mockList = List.filter(item => {
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })
      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/organ/createAccount',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/organ/updateAccount',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/organ/delAccount',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/organ/changeStatus',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/organ/savePwd',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/organ/listModuleDetail',
    type: 'get',
    response: config => {
      const { plan } = config.query

      const mockList = List.filter(item => {
        if (plan && item.plan !== plan) return false
        return true
      })
      const pageList = mockList.filter()
      return {
        code: 20000,
        data: {
          items: pageList
        }
      }
    }
  },
  {
    url: '/organ/listTikuDetail',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          items: List
        }
      }
    }
  },
  {
    url: '/organ/listPracticalTrainDetail',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          items: List
        }
      }
    }
  },
  {
    url: '/organ/listAccountKu',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          items: List
        }
      }
    }
  }
]

