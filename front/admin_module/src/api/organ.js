import request from '@/utils/request'
// 菜单列表
export function fetchListMenu(page) {
  return request({
    url: 'admin/org/menu/list',
    method: 'get',
    params: page
  })
}

// 增加菜单
export function handleMenuAdd(data) {
  return request({
    url: 'admin/org/menu/add',
    method: 'post',
    data
  })
}

// 删除菜单
export function handleMenuDel(data) {
  return request({
    url: 'admin/org/menu/del',
    method: 'post',
    data
  })
}

// 菜单树列表
export function fetchListMenuTree() {
  return request({
    url: '/admin/org/menu_tree',
    method: 'get'
  })
}
// 功能模块列表
export function fetchListFunModule() {
  return request({
    url: '/admin/module_of_func',
    method: 'get'
  })
}
// 新增功能模块handleAddModule
export function handleAddModule(data) {
  return request({
    url: '/admin/module/func_add',
    method: 'post',
    data
  })
}

// 删除功能模块handleDelModule
export function handleDelModule(data) {
  return request({
    url: '/admin/module/del',
    method: 'post',
    data
  })
}

// 保存功能模块和菜单的关联handleMenuModule
export function handleMenuModule(data) {
  return request({
    url: '/admin/module_menu',
    method: 'post',
    data
  })
}

// 取功能模块的菜单fetchFunModuleMenu
export function fetchFunModuleMenu(data) {
  return request({
    url: '/admin/module_menu/' + data.id,
    method: 'get'
  })
}

// 题库模块列表
export function fetchListTiKuModule() {
  return request({
    url: '/admin/module_of_tk',
    method: 'get'
  })
}

// 新增题库模块handleAddModule
export function handleAddTiKu(data) {
  return request({
    url: '/admin/module/tk_add',
    method: 'post',
    data
  })
}

// 删除题库模块handleDelModule
export function handleDelTiKu(data) {
  return request({
    url: '/admin/module/del',
    method: 'post',
    data
  })
}

// 保存题库模块和知识点的关联
export function handleModulePoint(data) {
  return request({
    url: '/admin/module_knowledge',
    method: 'post',
    data
  })
}

// 取题库模块的知识点fetchFunModuleMenu
export function fetchTiKuPoint(data) {
  return request({
    url: '/admin/module_knowledge/' + data.id,
    method: 'get'
  })
}

// 方案列表
export function fetchListSolution() {
  return request({
    url: '/admin/solution',
    method: 'post'
  })
}

// 保存方案
export function handleAddSolution(data) {
  return request({
    url: '/admin/solution/add',
    method: 'post',
    data
  })
}

// 单个方案handleOneSolution
export function handleOneSolution(query) {
  return request({
    url: '/admin/solution/' + query.id,
    method: 'get'
  })
}

// 删除单个方案handleDelSolution
export function handleDelSolution(data) {
  return request({
    url: '/admin/solution/del',
    method: 'post',
    data
  })
}

/* 机构账户列表*/
export function fetchListAccount(data, page) {
  return request({
    url: 'admin/org/list?page_size=' + page.limit + '&page=' + page.page,
    method: 'post',
    data
  })
}
// 机构账户新增/编辑
export function handleAccountCreate(data) {
  return request({
    url: 'admin/org/add',
    method: 'post',
    data
  })
}
// 机构账户删除
export function handleAccountDel(data) {
  return request({
    url: 'admin/org/del',
    method: 'post',
    data
  })
}

// 改变启用状态
export function changeStatus(data) {
  return request({
    url: 'admin/org/enable',
    method: 'post',
    data
  })
}

// 改变密码
export function savePwd(data) {
  return request({
    url: 'admin/org/resetpasswd',
    method: 'post',
    data
  })
}

// 实景实训模块列表
export function fetchListShiXunModule() {
  return request({
    url: '/admin/system/list',
    method: 'get'
  })
}

// 场地类型列表
export function fetchListPlaceType() {
  return request({
    url: '/admin/placetype',
    method: 'get'
    // data,
  })
}

// 场地列表
export function fetchListPlace(data, page) {
  return request({
    url: '/admin/places?page_size=' + page.limit + '&page=' + page.page,
    // url: '/admin/places',
    method: 'post',
    data
  })
}

// 场地类型新增
export function handleAdd(data) {
  return request({
    url: '/admin/placetype/add',
    method: 'post',
    data
  })
}

// 场地类型删除
export function handleDel(data) {
  return request({
    url: '/admin/placetype/del',
    method: 'post',
    data
  })
}

// 场地新增/编辑
export function handlePlaceAdd(data) {
  return request({
    url: '/admin/places/add',
    method: 'post',
    data
  })
}

// 启停用
export function handleUnable(data) {
  return request({
    url: '/admin/places/enable',
    method: 'post',
    data
  })
}

// 场地新增/编辑
export function handlePlaceDel(data) {
  return request({
    url: '/admin/places/del',
    method: 'post',
    data
  })
}

// 取功能模块方案fetchFunSolution
export function fetchFunSolution() {
  return request({
    url: '/admin/solution_of_func',
    method: 'get'
  })
}

// 取题库模块方案fetchFunSolution
export function fetchTiKuSolution() {
  return request({
    url: '/admin/solution_of_tk',
    method: 'get'
  })
}

// 取当前机构的订单handleGetOrgOrder
export function handleGetOrgOrder(data) {
  return request({
    url: '/admin/get_org_order',
    method: 'post',
    data
  })
}

// 存订单【功能、题库、实景实训】 handleAddOrder
export function handleAddOrder(data) {
  return request({
    url: '/admin/order',
    method: 'post',
    data
  })
}

// 存订单【账套库】 handleAddOrder
export function handleAddAccountOrder(data) {
  return request({
    url: '/admin/account_order',
    method: 'post',
    data
  })
}
