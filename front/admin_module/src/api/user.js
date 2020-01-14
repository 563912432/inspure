import request from '@/utils/request'

export function getInfo() {
  return request({
    url: '/admin/get_user',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

// 修改密码
export function changePwd(data) {
  return request({
    url: '/admin/reset_password',
    method: 'post',
    data
  })
}

// 修改手机号
export function changeTel(data) {
  return request({
    url: '/admin/reset_tel',
    method: 'post',
    data
  })
}

// 修改头像
export function changeAvatar(data) {
  return request({
    url: '/admin/avatar',
    method: 'post',
    data
  })
}
