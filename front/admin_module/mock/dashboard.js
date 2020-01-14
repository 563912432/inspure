import Mock from 'mockjs'

const List = []
const count = 5

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    title: '@title(5, 7)',
    content: baseContent,
    contactTel: '@integer(1, 20000000000)',
    startTime: +Mock.Random.date('T'),
    openTime: +Mock.Random.date('T'),
    endTime: +Mock.Random.date('T'),
    time: +Mock.Random.date('T'),
    type: '@integer(1, 5)',
    admin: '@first',
    name: '@first',
    moduleKu: '@integer(1, 5)',
    tiKu: '@integer(1, 5)',
    accountKu: '@integer(1, 5)'
  }))
}

export default [
  {
    url: '/dashboard/listBuy',
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

