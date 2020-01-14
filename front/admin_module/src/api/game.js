import request from '@/utils/request'

// 获取证书类型列表
export function getCertCategoryList() {
  return request({
    url: '/admin/cert_category/list',
    method: 'get'
  })
}

// 证书类型设置->新增
export function certCategoryAdd(data) {
  return request({
    url: '/admin/cert_category/add',
    method: 'post',
    data
  })
}

// 根据证书id获取证书信息
export function setCertItem(id) {
  return request({
    url: '/admin/cert/' + id,
    method: 'get'
  })
}

// 证书类型设置->删除
export function CertCategoryDel(data) {
  return request({
    url: '/admin/cert_category/del',
    method: 'post',
    data
  })
}

// 证书管理->证书新增
export function certAdd(data) {
  return request({
    url: '/admin/cert/add',
    method: 'post',
    data
  })
}

// 证书管理->证书列表查询
export function certList(data, page) {
  return request({
    url: '/admin/cert/list',
    method: 'post',
    data,
    params: page
  })
}

// 证书管理->删除证书
export function certDel(data) {
  return request({
    url: '/admin/cert/del',
    method: 'post',
    data
  })
}
// 证书管理->证书起停用

export function certEnable(data) {
  return request({
    url: '/admin/cert/enable',
    method: 'post',
    data
  })
}

// 试卷管理
// 试卷分类列表

export function setPaperCategoryList() {
  return request({
    url: '/admin/paper_category/list',
    method: 'get'
  })
}

// 试卷分类列表->新增分类
export function paperCategoryAdd(data) {
  return request({
    url: '/admin/paper_category/add',
    method: 'post',
    data
  })
}

// 试卷分类列表->分类删除
export function paperCategoryDel(data) {
  return request({
    url: '/admin/paper_category/del',
    method: 'post',
    data
  })
}

// 组卷部分->根据题目类型查询试卷题目
export function getTkList(data, page) {
  return request({
    url: '/admin/tk/list',
    method: 'post',
    data,
    params: page
  })
}

// 获取题目难度
export function getDifficultyList(data) {
  return request({
    url: '/difficulty/list',
    method: 'post',
    data
  })
}

// 根据题目id获取题目详细信息
export function getTkTms(data) {
  return request({
    url: '/admin/tk/get_tms',
    method: 'post',
    data
  })
}

// 账套列表获取
export function getAccountList(data, page) {
  return request({
    url: '/admin/account/list',
    method: 'post',
    data,
    params: page
  })
}

// 获取指定账套信息
export function getAccountItem(id) {
  return request({
    url: '/admin/account/' + id,
    method: 'get'
  })
}

// 试卷新增
export function getPaperAdd(data) {
  return request({
    url: '/admin/paper/add',
    method: 'post',
    data
  })
}

// 获取试卷知识点
export function getKnowledgePointsList(data) {
  return request({
    url: '/admin/knowledgepoints',
    method: 'post',
    data
  })
}

// 查询试卷列表
export function getPaperList(data, page) {
  return request({
    url: '/admin/paper/list',
    method: 'post',
    data,
    params: page
  })
}

// 根据id查询单条试卷信息
export function getPaperItem(data) {
  return request({
    url: '/admin/paper/' + data,
    method: 'get'
  })
}

// 试卷删除
export function paperDel(data) {
  return request({
    url: '/admin/paper/del',
    method: 'post',
    data
  })
}

// 复制试卷
export function paperCopy(data) {
  return request({
    url: '/admin/paper/copy',
    method: 'post',
    data
  })
}

// 获取考试分类信息
export function getMatchCategoryList() {
  return request({
    url: '/admin/match_category/list',
    method: 'get'
  })
}

// 考试分类信息新增
export function getMatchCategoryAdd(data) {
  return request({
    url: '/admin/match_category/add',
    method: 'post',
    data
  })
}

// 考试信息删除

export function getMatchCategoryDel(data) {
  return request({
    url: '/admin/match_category/del',
    method: 'post',
    data
  })
}

// 获取考试信息列表
export function matchList(data, page) {
  return request({
    url: '/admin/match/list',
    method: 'post',
    data,
    params: page
  })
}

// 考试新增
export function matchAdd(data) {
  return request({
    url: '/admin/match/add',
    method: 'post',
    data
  })
}

// 获取单个考试信息
export function matchItem(id) {
  return request({
    url: '/admin/match/' + id,
    method: 'get'
  })
}

// 考试信息删除
export function matchDel(data) {
  return request({
    url: '/admin/match/del',
    method: 'post',
    data
  })
}

// 考试复制
export function matchCopy(data) {
  return request({
    url: '/admin/match/copy',
    method: 'post',
    data
  })
}

// 考试发布
export function matchPublish(data) {
  return request({
    url: '/admin/match/publish',
    method: 'post',
    data
  })
}

// 根据查询条件随机抽题
export function difficultyId(data) {
  return request({
    url: '/admin/paper/get_tms_by_conditions',
    method: 'post',
    data
  })
}

// 获取机构列表
export function orgList(data) {
  return request({
    url: '/org/list',
    method: 'post',
    data
  })
}

// 报名新增
export function signupAdd(data) {
  return request({
    url: '/admin/signup/add',
    method: 'post',
    data
  })
}

// 报名列表查询
export function signupList(data, page) {
  return request({
    url: '/admin/signup/list',
    method: 'post',
    data,
    params: page
  })
}

// 报名删除
export function signupDel(data) {
  return request({
    url: '/admin/signup/del',
    method: 'post',
    data
  })
}

// 获取单个报名信息
export function signupItem(id) {
  return request({
    url: '/admin/signup/' + id,
    method: 'get'
  })
}

// 报名发布
export function signupEnable(data) {
  return request({
    url: '/admin/signup/enable',
    method: 'post',
    data
  })
}

// 场地列表
export function placesList(data, page) {
  return request({
    url: '/admin/places',
    method: 'post',
    data,
    params: page
  })
}

// 保存场地安排
export function configAdd(data) {
  return request({
    url: '/admin/signup/config',
    method: 'post',
    data
  })
}

// 随机安排考生
export function randomArrangement(data) {
  return request({
    url: '/admin/signup/random_arrangement',
    method: 'post',
    data
  })
}

// 获取场地安排
export function getArrange(id) {
  return request({
    url: '/admin/signup/get_arrange/' + id,
    method: 'get'
  })
}

// 违纪分类列表
export function indisciplineCategoryList() {
  return request({
    url: '/admin/indiscipline_category/list',
    method: 'get'
  })
}

// 违纪类型新增
export function indisciplineCategoryAdd(data) {
  return request({
    url: '/admin/indiscipline_category/add',
    method: 'post',
    data
  })
}

// 违纪分类删除
export function indisciplineCategoryDel(data) {
  return request({
    url: '/admin/indiscipline_category/del',
    method: 'post',
    data
  })
}

// 查询违纪列表
export function indisciplineList(data, page) {
  return request({
    url: '/admin/indiscipline/list',
    method: 'post',
    data,
    params: page
  })
}

// 查询某场考试的报名人员
export function getSignupStudents(data, id) {
  return request({
    url: '/admin/signup/' + id + '/students',
    method: 'post',
    data
  })
}

// 根据准考证号查询考生信息
export function getUserByExamNo(data) {
  return request({
    url: '/admin/indiscipline/get_user_by_exam_no',
    method: 'post',
    data
  })
}

// 违纪新增
export function indisciplineAdd(data) {
  return request({
    url: '/admin/indiscipline/add',
    method: 'post',
    data
  })
}

// 违纪删除

export function indisciplineDel(data) {
  return request({
    url: '/admin/indiscipline/del',
    method: 'post',
    data
  })
}
