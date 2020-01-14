import Mock from 'mockjs'

const List = []
const count = 10

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    title: '@first',
    content: baseContent,
    contactTel: '@integer(1, 20000000000)',
    startTime: +Mock.Random.date('T'),
    openTime: +Mock.Random.date('T'),
    endTime: +Mock.Random.date('T'),
    time: +Mock.Random.date('T'),
    sender: '@first',
    brief: baseContent,
    status: '@integer(0, 1)'
  }))
}

export default [
  {
    url: '/mail/listInMail',
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
    url: '/mail/listAddress',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          items: [{
            id: 1,
            label: '一级 1',
            children: [{
              id: 4,
              label: '二级 1-1',
              children: [{
                id: 9,
                label: '三级 1-1-1'
              }, {
                id: 10,
                label: '三级 1-1-2'
              }]
            }]
          }, {
            id: 2,
            label: '一级 2',
            children: [{
              id: 5,
              label: '二级 2-1'
            }, {
              id: 6,
              label: '二级 2-2'
            }]
          }, {
            id: 3,
            label: '一级 3',
            children: [{
              id: 7,
              label: '二级 3-1'
            }, {
              id: 8,
              label: '二级 3-2'
            }]
          },
          {
            id: 4,
            label: '一级 4',
            children: [{
              id: 9,
              label: '二级 4-1'
            }, {
              id: 910,
              label: '二级 4-2'
            }]
          }]
        }
      }
    }
  }
]

