import request from '@/utils/request'

// 部门类型列表
export function fetchListBranchType() {
  return request({
    url: '/admin/departmentgroups',
    method: 'post'
  })
}
// 新增/编辑 部门类型
export function handleAdd(data) {
  return request({
    url: '/admin/departmentgroup/add',
    method: 'post',
    data
  })
}
// 删除部门类型
export function handleDel(data) {
  return request({
    url: '/admin/departmentgroup/del',
    method: 'post',
    data
  })
}

// 增加/编辑用户
export function handleUserAdd(data) {
  return request({
    url: '/admin/user/add',
    method: 'post',
    data
  })
}
// 删除用户
export function handleUserDel(data) {
  return request({
    url: '/admin/user/del',
    method: 'post',
    data
  })
}
// 筛选用户/用户列表
export function fetchListUser(data, page) {
  return request({
    url: '/admin/user/list?page_size=' + page.limit + '&page=' + page.page,
    method: 'post',
    data
  })
}
// 修改启用状态
export function handleWorkEdit(data) {
  return request({
    url: '/admin/user/enable',
    method: 'post',
    data
  })
}
// 修改密码
export function handlePwdEdit(data) {
  return request({
    url: '/admin/resetpasswd',
    method: 'post',
    data
  })
}

// 部门列表
export function fetchListBranch() {
  return request({
    url: '/admin/departments',
    method: 'get'
  })
}
// 保存部门【删除和编辑】
export function handleBranchAdd(data) {
  return request({
    url: '/admin/department/add',
    method: 'post',
    data
  })
}
// 删除部门
export function handleBranchDel(data) {
  return request({
    url: '/admin/department/del',
    method: 'post',
    data
  })
}

// 菜单列表
export function fetchListMenu(query) {
  return request({
    url: '/admin/menu/list',
    method: 'get',
    params: query
  })
}

// 增加菜单
export function handleMenuAdd(data) {
  return request({
    url: '/admin/menu/add',
    method: 'post',
    data
  })
}

// 删除菜单
export function handleMenuDel(data) {
  return request({
    url: '/admin/menu/del',
    method: 'post',
    data
  })
}

// 菜单树
export function fetchListMenuTree() {
  return request({
    url: '/auth/listMenuTree',
    method: 'get'
  })
}

// 获取角色列表url: '/admin/user/list?page_size=' + page.limit + '&page=' + page.page,
//     method: 'post',
//     data,
export function getRoleList(data, page) {
  return request({
    url: '/admin/role/list',
    method: 'post',
    params: page,
    data
  })
}

// 增加角色
export function handleRoleAdd(data) {
  return request({
    url: '/admin/role/add',
    method: 'post',
    data
  })
}

// 删除角色
export function handleRoleDel(data) {
  return request({
    url: '/admin/role/del',
    method: 'post',
    data
  })
}

// 未分配角色的用户
export function fetchListNoAuthUser(query, page, data) {
  return request({
    url: '/admin/role/unselectd_users',
    method: 'post',
    data
  })
}

// 已分配角色的用户fetchListHaveAuthUser
export function fetchListHaveAuthUser(query, page, data) {
  return request({
    url: '/admin/role/divideUsers',
    method: 'post',
    data
  })
}

// 保存用户handleBindUser
export function handleBindUser(data) {
  return request({
    url: '/admin/role/binduser',
    method: 'post',
    data
  })
}

