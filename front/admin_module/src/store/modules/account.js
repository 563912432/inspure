const state = {
  // 纳税人类型
  payTaxTypeList: [
    { key: 1, value: '一般纳税人' },
    { key: 2, value: '小规模纳税人' }
  ],
  // 会计制度
  accountSystemList: [
    { key: 2007, value: '2007小企业会计准则' },
    { key: 2013, value: '2013小企业会计准则' }
  ],
  // 账套类型
  accountTypeList: [
    { key: 1, value: '真账' },
    { key: 2, value: '模拟账' }
  ],
  // 上架状态
  showStatusList: [
    { key: 0, value: '未启用' },
    { key: 1, value: '启用' }
  ],
  // 账套用途
  accountUseList: [
    { key: 1, value: '售卖' },
    { key: 2, value: '内部' }
  ],
  // 增值税
  addTaxList: [
    { key: 1, value: '一般纳税人' },
    { key: 2, value: '小规模纳税人' }
  ],
  //
  currentAccountData: {},
  module: [],
  moduleStatus: {
    TiKuModule: 1,
    FunModule: 2,
    ShiXunModule: 3
  },
  tiKuModule: [],
  chosePoints: [],
  addAccountKuType: {
    HeSuan: 1,
    KeMu: 2,
    QiChu: 3,
    YeWu: 4,
    BaoBiao: 5,
    KaiPiao: 6,
    ShenBao: 7,
    AccountPreview: 8,
    ScorePreview: 9
  },
  // 默认科目【资产】07
  defaultZiChanKeMu07: [
    { nu: '1001', ti: '库存现金', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1002', ti: '银行存款', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1003', ti: '存放中央银行款项', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1011', ti: '存放同业', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1012', ti: '其他货币资金', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1101', ti: '短期投资', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1121', ti: '应收票据', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1122', ti: '应收账款', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1123', ti: '预付账款', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1131', ti: '应收股利', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1132', ti: '应收利息', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1221', ti: '其他应收款', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1401', ti: '材料采购', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1402', ti: '在途物资', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1403', ti: '原材料', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1404', ti: '材料成本差异', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1405', ti: '库存商品', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1407', ti: '商品进销差价', ca: '资产', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1408', ti: '委托加工物资', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1411', ti: '周转材料', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1421', ti: '消耗性生物资产', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1501', ti: '长期债券', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1511', ti: '长期股权投资', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1601', ti: '固定资产', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1602', ti: '累计折旧', ca: '资产', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1604', ti: '在建工程', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1605', ti: '工程物资', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1606', ti: '固定资产清理', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1621', ti: '生产性生物资产', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1622', ti: '生产性生物资产累计折旧', ca: '资产', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1701', ti: '无形资产', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1702', ti: '累计摊销', ca: '资产', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1801', ti: '长期待摊费用', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1901', ti: '待处理资产损溢', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 }
  ],
  // 默认科目【负债】
  defaultFuZhaiKeMu07: [
    { nu: '2001', ti: '短期借款', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '2201', ti: '应付票据', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '2202', ti: '应付账款', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '2203', ti: '预收账款', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '2211', ti: '应付职工薪酬', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '2221', ti: '应交税费', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '2231', ti: '应付利息', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '2232', ti: '应付利润', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '2241', ti: '其他应付款', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '2401', ti: '递延收益', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '2501', ti: '长期借款', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '2701', ti: '长期应付款', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 }
  ],
  // 默认科目【共同】
  defaultGongTong07: [
    { nu: '3001', ti: '实收资本', ca: '共同', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '3002', ti: '资本公积', ca: '共同', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '3101', ti: '盈余公积', ca: '共同', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '3103', ti: '本年利润', ca: '共同', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '3104', ti: '利润分配', ca: '共同', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 }
  ],
  // 默认科目【权益】
  defaultQuanYiKeMu07: [
    { nu: '4001', ti: '生产成本', ca: '权益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '4101', ti: '制造费用', ca: '权益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '4301', ti: '研发支出', ca: '权益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '4401', ti: '工程施工', ca: '权益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '4403', ti: '机械作业', ca: '权益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 }
  ],
  // 默认科目【成本】
  defaultChengBenKeMu07: [
    { nu: '5001', ti: '主营业务收入', ca: '成本', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '5051', ti: '其他业务收入', ca: '成本', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '5111', ti: '投资收益', ca: '成本', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '5301', ti: '营业外收入', ca: '成本', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '5401', ti: '主营业务成本', ca: '成本', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '5402', ti: '其他业务成本', ca: '成本', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '5403', ti: '税金及附加', ca: '成本', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '5601', ti: '销售费用', ca: '成本', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '5602', ti: '管理费用', ca: '成本', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '5603', ti: '财务费用', ca: '成本', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '5711', ti: '营业外支出', ca: '成本', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '5801', ti: '所得税费用', ca: '成本', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 }
  ],
  // 默认科目【损益】
  defaultSunYiKeMu07: [
    { nu: '6001', ti: '主营业务收入', ca: '损益', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '6011', ti: '利息收入', ca: '损益', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '6021', ti: '手续费及佣金收入', ca: '损益', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '6031 ', ti: '保费收入', ca: '损益', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '6041', ti: '租赁收入', ca: '损益', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '6051', ti: '其他业务收入', ca: '损益', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '6061', ti: '汇兑损益', ca: '损益', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '6101', ti: '公允价值变动损益', ca: '损益', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '6111', ti: '投资收益', ca: '损益', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '6201', ti: '摊回保险责任准备金', ca: '损益', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '6202', ti: '摊回赔付支出', ca: '损益', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '6203', ti: '摊回分保费用', ca: '损益', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '6301', ti: '营业外收入', ca: '损益', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '6401', ti: '主营业务成本', ca: '损益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '6402', ti: '其他业务成本', ca: '损益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '6403', ti: '税金及附加', ca: '损益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '6411', ti: '利息支出', ca: '损益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '6421', ti: '手续费及佣金支出', ca: '损益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '6501', ti: '提取未到期责任准备金', ca: '损益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '6502', ti: '提取保险责任准备金', ca: '损益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '6511', ti: '赔付支出', ca: '损益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '6521', ti: '保单红利支出', ca: '损益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '6531', ti: '退保金', ca: '损益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '6541', ti: '分出保费', ca: '损益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '6542', ti: '分保费用', ca: '损益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '6601', ti: '销售费用', ca: '损益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0, cd: [
      { num: '6601001', ti: '销售费用-销售人员职工薪酬', ca: '损益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 6601 }
    ] },
    { nu: '6602', ti: '管理费用', ca: '损益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0, cd: [
      { num: '6602001', ti: '管理费用-管理人员职工薪酬', ca: '损益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 6602 },
      { num: '6602007', ti: '管理费用-差旅费', ca: '损益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 6002 }
    ] },
    { nu: '6603', ti: '财务费用', ca: '损益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '6604', ti: '勘探费用', ca: '损益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '6701', ti: '资产减值损失', ca: '损益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '6711', ti: '营业外支出', ca: '损益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '6801', ti: '所得税费用', ca: '损益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '6901', ti: '以前年度损益调整', ca: '损益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 }
  ],

  // 默认科目【资产】13
  defaultZiChanKeMu13: [
    { nu: '1001', ti: '库存现金', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1002', ti: '银行存款', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1012', ti: '其他货币资金', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1101', ti: '短期投资', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1121', ti: '应收票据', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1122', ti: '应收账款', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1123', ti: '预付账款', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1131', ti: '应收股利', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1132', ti: '应收利息', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1221', ti: '其他应收款', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1401', ti: '材料采购', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1402', ti: '在途物资', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1403', ti: '原材料', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1404', ti: '材料成本差异', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1405', ti: '库存商品', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1407', ti: '商品进销差价', ca: '资产', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1408', ti: '委托加工物资', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1411', ti: '周转材料', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1421', ti: '消耗性生物资产', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1501', ti: '长期债券', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1511', ti: '长期股权投资', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1601', ti: '固定资产', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1602', ti: '累计折旧', ca: '资产', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1604', ti: '在建工程', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1605', ti: '工程物资', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1606', ti: '固定资产清理', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1621', ti: '生产性生物资产', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1622', ti: '生产性生物资产累计折旧', ca: '资产', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1701', ti: '无形资产', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1702', ti: '累计摊销', ca: '资产', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1801', ti: '长期待摊费用', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '1901', ti: '待处理资产损溢', ca: '资产', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 }
  ],
  // 默认科目【负债】
  defaultFuZhaiKeMu13: [
    { nu: '2001', ti: '短期借款', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '2201', ti: '应付票据', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '2202', ti: '应付账款', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '2203', ti: '预收账款', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '2211', ti: '应付职工薪酬', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '2221', ti: '应交税费', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0, cd: [
      { nu: '2221001', ti: '应交税费-应交增值税', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 2221 },
      { nu: '2221002', ti: '应交税费-未交增值税', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 2221 },
      { nu: '2221003', ti: '应交税费-应交营业税', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 2221 },
      { nu: '2221004', ti: '应交税费-应交消费税', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 2221 },
      { nu: '2221005', ti: '应交税费-应交资源税', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 2221 },
      { nu: '2221006', ti: '应交税费-应交企业所得税', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 2221 },
      { nu: '2221007', ti: '应交税费-应交土地增值税', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 2221 },
      { nu: '2221008', ti: '应交税费-应交城市维护建设税', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 2221 },
      { nu: '2221009', ti: '应交税费-应交房产税', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 2221 },
      { nu: '2221010', ti: '应交税费-应交城镇土地使用税', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 2221 },
      { nu: '2221011', ti: '应交税费-应交车船使用税', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 2221 },
      { nu: '2221012', ti: '应交税费-应交个人所得税', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 2221 },
      { nu: '2221013', ti: '应交税费-教育费附加', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 2221 },
      { nu: '2221014', ti: '应交税费-矿产资源补偿费', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 2221 },
      { nu: '2221015', ti: '应交税费-排污费', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 2221 },
      { nu: '2221016', ti: '应交税费-印花税', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 2221 },
      { nu: '2221017', ti: '应交税费-地方教育费附加', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 2221 },
      { nu: '2221018', ti: '应交税费-地方水利建设基金', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 2221 }
    ] },
    { nu: '2231', ti: '应付利息', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '2232', ti: '应付利润', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '2241', ti: '其他应付款', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '2401', ti: '递延收益', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '2501', ti: '长期借款', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '2701', ti: '长期应付款', ca: '负债', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 }
  ],
  // 默认科目【共同】
  defaultGongTongKeMu13: [
    { nu: '3001', ti: '实收资本', ca: '共同', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '3002', ti: '资本公积', ca: '共同', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '3101', ti: '盈余公积', ca: '共同', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '3103', ti: '本年利润', ca: '共同', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '3104', ti: '利润分配', ca: '共同', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 }
  ],
  // 默认科目【权益】
  defaultQuanYiKeMu13: [
    { nu: '4001', ti: '生产成本', ca: '权益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '4101', ti: '制造费用', ca: '权益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '4301', ti: '研发支出', ca: '权益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '4401', ti: '工程施工', ca: '权益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '4403', ti: '机械作业', ca: '权益', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 }
  ],
  // 默认科目【成本】
  defaultChengBenKeMu13: [
    { nu: '5001', ti: '主营业务收入', ca: '成本', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '5051', ti: '其他业务收入', ca: '成本', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '5111', ti: '投资收益', ca: '成本', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '5301', ti: '营业外收入', ca: '成本', dw: '', ye: '贷', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '5401', ti: '主营业务成本', ca: '成本', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '5402', ti: '其他业务成本', ca: '成本', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '5403', ti: '税金及附加', ca: '成本', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '5601', ti: '销售费用', ca: '成本', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0, cd: [
      { nu: '5601001', ti: '销售费用-销售人员职工薪酬', ca: '成本', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 }
    ] },
    { nu: '5602', ti: '管理费用', ca: '成本', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0, cd: [
      { nu: '5602001', ti: '管理费用-管理人员职工薪酬', ca: '成本', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
      { nu: '5602007', ti: '管理费用-差旅费', ca: '成本', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 }
    ] },
    { nu: '5603', ti: '财务费用', ca: '成本', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '5711', ti: '营业外支出', ca: '成本', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 },
    { nu: '5801', ti: '所得税费用', ca: '成本', dw: '', ye: '借', fz: '', wb: '', sc: '', pi: 0 }
  ],
  // 默认科目【损益】
  defaultSunYiKeMu13: [],
  answer: {
    material: '',
    accountData: [],
    // month: ['201909', '201910'],
    heSuan: {},
    keMu: {},
    qiChu: {},
    baoBiao: {},
    yeWu: {},
    kai_piao: {},
    guo_shui: {},
    ge_shui: {}
  },
  scoreRecord: {
    heSuan: {},
    keMu: {},
    qiChu: {},
    baoBiao: {},
    yeWu: {}
  }
}

const mutations = {
  SET_MODULE: (state, data) => {
    state.module = data
  },
  SET_TIKU: (state, data) => {
    state.tiKuModule = data
  },
  SAVE_POINT: (state, data) => {
    state.chosePoints = state.chosePoints.concat(data)
  },
  CLEAR_POINT: (state) => {
    state.chosePoints = []
  },
  // 当前账套基本信息
  SAVE_CURRENT_ACCOUNT_DATA: (state, data) => {
    state.currentAccountData = data
  },
  // 保存答案
  SAVE_ANSWER: (state, data) => {
    state.answer = data
  },
  // 得分纪录
  SAVE_SCORE_RECORD: (state, data) => {
    state.scoreRecord = data
  },
  // 保存背景信息
  SAVE_BG_INFO: (state, data) => {
    state.answer.material = data
  },
  // 保存税种
  SAVE_TAX: (state, data) => {
    state.answer.material.taxCate = data
  },
  // 保存月份
  SAVE_MONTH: (state, data) => {
    state.answer.month = data
  },
  // 保存核算
  SAVE_HE_SUAN: (state, data) => {
    state.answer.heSuan = data
  },
  // 保存科目
  SAVE_KE_MU: (state, data) => {
    state.answer.keMu = data
  },
  // 保存期初
  SAVE_QI_CHU: (state, data) => {
    state.answer.qiChu = data
  },
  // 保存业务
  SAVE_YE_WU: (state, data) => {
    state.answer.yeWu = data
  },
  // 保存报表
  SAVE_BAO_BIAO: (state, data) => {
    state.answer.baoBiao = data
  },
  // 保存开票
  SAVE_KAI_PIAO: (state, data) => {
    state.answer.kai_piao = data
  },
  // 保存个税
  SAVE_GE_SHUI: (state, data) => {
    state.answer.ge_shui = data
  },
  // 保存国税
  SAVE_GUO_SHUI: (state, data) => {
    state.answer.guo_shui = data
  },
  // 保存账套数据
  SAVE_ACCOUNT_DATA: (state, data) => {
    state.answer.accountData = data
  }
}

const actions = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
