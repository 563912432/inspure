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
    startTime: '@date',
    openTime: '@integer(1, 2000)',
    endTime: '@date',
    createTime: '@date',
    createOrg: '浪潮',
    time: '@date',
    sender: '@first',
    brief: baseContent,
    number: '@integer(1, 1000)',
    name: '@first',
    'examName|1': ['初级会计实务期末考试', '中级会计实务期末考试'],
    examType: '2018学第一学期期末考试',
    status: 1,
    creator: '杨蕾',
    sectionNum: '@integer(1, 12)',
    docNum: '@integer(1, 100)',
    videoNum: '@integer(1, 100)',
    collaborator: '@first',
    isShow: '@integer(0,1)',
    teachClass: '@first',
    total: '@integer(1, 12)',
    mode: '@integer(1, 2)',
    point: '@first',
    course: '@first',
    class: '@first',
    num: '@integer(0,10)',
    weekly: '@integer(0,10)-@integer(10,20)',
    times: '@integer(0,10)',
    rate: '@integer(0,100)%',
    sex: '@integer(1, 2)',
    department: '@integer(1, 2)',
    branch: '@integer(1, 2)',
    role: '@integer(1, 2)',
    grade: '@integer(1, 2)',
    speciality: '@integer(1, 2)',
    batch: '@integer(1, 10)',
    set: '@integer(0,1)',
    cate: '@first',
    score: '100'
  }))
}

export default [
  {
    url: '/exam/list',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          items: List,
          total: List.length
        }
      }
    }
  }
]

