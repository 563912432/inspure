import request from '@/utils/request'

// 发件箱列表
export function fetchListOutBox(query) {
  return request({
    url: '/admin/msg/list',
    method: 'get',
    params: query
  })
}

// 保存内容
export function handleAddMail(data) {
  return request({
    url: '/admin/msg/add',
    method: 'post',
    data
  })
}

// 未读变已读
export function handleRead(data) {
  return request({
    url: '/admin/msg/read',
    method: 'post',
    data
  })
}

