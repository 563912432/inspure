import request from '@/utils/request'

// 账套库列表信息
export function fetchAccountKuListDetail(data, pageQuery) {
  return request({
    url: '/admin/account/list',
    method: 'post',
    params: pageQuery,
    data
  })
}

// 单个账套库列表信息fetchAccountKuOne
export function fetchAccountKuOne(id) {
  return request({
    url: '/admin/account/' + id,
    method: 'get'
  })
}

export function fetchAccountKuExtOne(id) {
  return request({
    url: '/admin/account_ext/' + id,
    method: 'get'
  })
}

// 保存账套库列表
export function handleAccountKuAdd(data) {
  return request({
    url: '/admin/account/add',
    method: 'post',
    data
  })
}

// 删除账套
export function handleAccountKuDel(data) {
  return request({
    url: '/admin/account/del',
    method: 'post',
    data
  })
}

// 账套库上下架
export function handleAccountEnable(data) {
  return request({
    url: '/admin/account/enable',
    method: 'post',
    data
  })
}

// 行业列表fetchListIndustryType
export function fetchListIndustryType() {
  return request({
    url: '/industry/list',
    method: 'get'
  })
}

// 行业新增
export function handleIndustryAdd(data) {
  return request({
    url: '/industry/add',
    method: 'post',
    data
  })
}

// 行业删除
export function handleIndustryDel(data) {
  return request({
    url: '/industry/del',
    method: 'post',
    data
  })
}

// 行业启用handleEnableSave
export function handleEnableSave(data) {
  return request({
    url: '/industry/enable',
    method: 'post',
    data
  })
}

//  注册云会计 getSystemInfo
export function getSystemInfo(data) {
  return request({
    url: '/yca/ypjAuth/registerLogin',
    method: 'post',
    data,
    baseURL: 'http://117.50.43.204:8888'
  })
}

// 保存账套库的分数设置
export function saveAccountScore(data) {
  return request({
    url: '/admin/account_ext/add',
    method: 'post',
    data
  })
}

// 创建开票企业
export function createKaiPiaoCompany(data) {
  return request({
    url: '/admin/kp/company/add',
    method: 'post',
    data
  })
}

// 删除开票企业
export function delKaiPiaoCompany(id) {
  return request({
    url: `admin/kp/company/del/${id}`,
    method: 'delete'
  })
}

// 创建个税企业
export function createGeShuiCompany(data) {
  return request({
    url: '/admin/geshui/company/add',
    method: 'post',
    data
  })
}

// 删除个税企业
export function delGeShuiCompany(id) {
  return request({
    url: `admin/geshui/company/del/${id}`,
    method: 'delete'
  })
}

// 创建国税企业
export function createGuoShuiCompany(data) {
  return request({
    url: '/admin/guoshui/company/add',
    method: 'post',
    data
  })
}

// 删除国税企业
export function delGuoShuiCompany(id) {
  return request({
    url: `admin/guoshui/company/del/${id}`,
    method: 'delete'
  })
}

// 获取国税当前企业信息
export function getGuoShuiCompanyInfo(data) {
  return request({
    url: `admin/guoshui/company`,
    method: 'post',
    data
  })
}

// getAccountInfo
export function getAccountInfo(id) {
  return request({
    url: `admin/account_ext/${id}`,
    method: 'get'
  })
}
