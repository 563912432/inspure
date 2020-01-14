import request from '@/utils/request'

// 题目列表 todo data
export function fetchObjKuList(data, page) {
  return request({
    url: '/admin/tk/list',
    method: 'post',
    params: page,
    data
  })
}

// 单个题目
export function handleOneTm(data) {
  return request({
    url: '/admin/tk/' + data.id,
    method: 'get'
  })
}

// 获取视频秘钥
export function videoAuth() {
  return request({
    url: '/objKu/videoAuth',
    method: 'get'
  })
}
// 保存题目
export function saveTm(data) {
  return request({
    url: '/admin/tk/add',
    method: 'post',
    data
  })
}
// 保存组合题 handleZuHeAdd
export function handleZuHeAdd(data) {
  return request({
    url: '/admin/tk/add_group',
    method: 'post',
    data
  })
}
// 删除题目
export function delKu(data) {
  return request({
    url: '/admin/tk/del',
    method: 'post',
    data
  })
}
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

// 题型列表
export function fetchTiMuTypeList() {
  return request({
    url: '/admin/tk/typelist/',
    method: 'get'
  })
}

// 难度列表
export function fetchListLevelSet() {
  return request({
    url: '/difficulty/list',
    method: 'post'
  })
}

// 难易度增加
export function handleAddLevelSet(data) {
  return request({
    url: '/difficulty/add',
    method: 'post',
    data
  })
}

// 删除难易度
export function handleDelLevelSet(data) {
  return request({
    url: '/difficulty/del',
    method: 'post',
    data
  })
}

