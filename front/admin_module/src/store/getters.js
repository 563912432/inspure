const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.userInfo.avatar,
  name: state => state.user.userInfo.username,
  menu: state => state.user.menu,
  roles: state => state.user.role,
  permission_routes: state => state.permission.routes,
  // errorLogs: state => state.errorLog.logs,
  host: state => state.common.host,
  timuType: state => state.common.timuType,
  timuTypeList: state => [
    { key: state.common.timuType.DAN_XUAN, value: '单选题', time: 0, score: 0, totalScore: 0 },
    { key: state.common.timuType.DUO_XUAN, value: '多选题', time: 0, score: 0, totalScore: 0 },
    { key: state.common.timuType.PAN_DUAN, value: '判断题', time: 0, score: 0, totalScore: 0 },
    { key: state.common.timuType.TIAN_KONG, value: '填空题', time: 0, score: 0, totalScore: 0 },
    { key: state.common.timuType.JIAN_DA, value: '简答题', time: 0, score: 0, totalScore: 0 },
    { key: state.common.timuType.ZU_HE, value: '组合题', time: 0, score: 0, totalScore: 0 },
    { key: state.common.timuType.ZHANG_TAO, value: '账套题', time: 0, score: 0, totalScore: 0 }
  ],
  timuTypeStringList: state => state.common.timuTypeString,
  levelList: state => state.common.levelList,
  openTime: state => state.common.openTime,
  planCate: state => state.common.planCate,
  payTaxTypeList: state => state.account.payTaxTypeList,
  accountSystemList: state => state.account.accountSystemList,
  tradeList: state => state.account.tradeList,
  accountTypeList: state => state.account.accountTypeList,
  showStatusList: state => state.account.showStatusList,
  openStatusList: state => state.account.openStatusList,
  accountUseList: state => state.account.accountUseList,
  addTaxList: state => state.account.addTaxList,
  sexList: state => state.common.sexList,
  isWorkList: state => state.common.isWorkList,
  handleLogTypeList: state => state.common.handleLogTypeList,
  handleResultList: state => state.common.handleResultList,
  optionNumberToLetter: state => state.common.optionNumberToLetter,
  module: state => state.account.module,
  tiKuModule: state => state.account.tiKuModule,
  moduleStatus: state => state.account.moduleStatus,
  chosePoints: state => state.account.chosePoints,
  currentAccountData: state => state.account.currentAccountData,
  addAccountKuType: state => state.account.addAccountKuType,
  fuZhuCate: state => state.account.fuZhuCate,
  accountAnswer: state => state.account.answer,
  defaultKeMu: state => state.account.defaultKeMu,
  tmSmall: state => state.tm.tmSmall,
  exam: state => state.tm.exam,
  messageInfo: state => state.msg.info,
  editCourseState: state => state.package.editCourseState
}
export default getters
