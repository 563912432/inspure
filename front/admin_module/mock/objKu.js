import Mock from 'mockjs'

const List = []
const count = 10

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    title: '@title(5, 7)',
    timuType: '@first',
    point: '@first',
    difficulty: '@integer(1, 5)',
    addtime: +Mock.Random.date('T'),
    content_short: 'mock data',
    content: baseContent,
    forecast: '@float(0, 100, 2, 2)',
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
    code: '@integer(1, 100)'
  }))
}

export default [
  {
    url: '/objKu/listObjKu',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          total: List.length,
          items: List
        }
      }
    }
  },
  {
    url: '/objKu/videoAuth',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          resultData: {
            userid: '123',
            ptime: 123123123,
            sign: '123',
            hash: '',
            cateid: '123'
          }
        }
      }
    }
  },
  {
    url: '/objKu/getPointList',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          total: List.length,
          items: List
        }
      }
    }
  },
  {
    url: '/objKu/delKu',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/objKu/getPointTypeList',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          total: List.length,
          items: List
        }
      }
    }
  },
  {
    url: '/objKu/delPointType',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/objKu/getLevelSetList',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          total: List.length,
          items: List
        }
      }
    }
  },
  {
    url: '/objKu/delLevelSet',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

