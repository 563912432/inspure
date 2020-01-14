const state = {
  host: '127.0.0.1',
  timuType: {
    DAN_XUAN: 1,
    DUO_XUAN: 2,
    PAN_DUAN: 3,
    TIAN_KONG: 4,
    JIAN_DA: 5,
    ZU_HE: 6,
    ZHANG_TAO: 7
  },
  timuTypeString: {
    1: '单选题',
    2: '多选题',
    3: '判断题',
    4: '填空题',
    5: '简答题',
    6: '组合题',
    7: '账套题'
  },
  // 模块方案分类
  planCate: [
    { key: 1, value: '模块套组' },
    { key: 2, value: '题库套组' }
  ],
  // 开通时间
  openTime: [
    { key: 1, value: '1年' },
    { key: 2, value: '2年' },
    { key: 3, value: '3年' },
    { key: 4, value: '4年' },
    { key: 5, value: '5年' }
  ],
  // 性别
  sexList: [
    { key: '男', value: '男' },
    { key: '女', value: '女' }
  ],
  // 在职状态
  isWorkList: [
    { key: 0, value: '禁用' },
    { key: 1, value: '启用' }
  ],
  // 日志类型
  handleLogTypeList: [
    { key: 1, value: '机构账户管理' },
    { key: 2, value: '客观题题库' },
    { key: 3, value: '用户权限管理' },
    { key: 4, value: '账套管理' }
  ],
  // 操作结果
  handleResultList: [
    { key: '0', value: '失败' },
    { key: '1', value: '成功' }
  ],
  // 选项
  optionNumberToLetter: {
    1: 'A',
    2: 'B',
    3: 'C',
    4: 'D',
    5: 'E',
    6: 'F',
    7: 'G',
    8: 'H',
    9: 'I',
    10: 'J'
  }
}

const mutations = {
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
