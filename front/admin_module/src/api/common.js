import request from '@/utils/request'

// 获取知识点列表
export function fetchListPoint(data, page) {
  return request({
    url: '/admin/knowledgepoints?page_size=' + page.limit + '&page=' + page.page,
    method: 'post',
    data
  })
}
// 新增知识点
export function addPoint(data) {
  return request({
    url: 'admin/knowledgepoints/add',
    method: 'post',
    data
  })
}

// 删除知识点
export function delPoint(data) {
  return request({
    url: '/admin/knowledgepoints/del',
    method: 'post',
    data
  })
}

