import request from '@/utils/request'

/* 模块自定义 */
export function fetchHandleLogList(data, pageQuery) {
  return request({
    url: '/admin/logs',
    method: 'get'
    // params: pageQuery
  })
}
