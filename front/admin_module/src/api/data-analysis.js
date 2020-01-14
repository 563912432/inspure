import request from '@/utils/request'

// 考试列表
export function fetchList() {
  return request({
    url: '/exam/list',
    method: 'get'
  })
}
