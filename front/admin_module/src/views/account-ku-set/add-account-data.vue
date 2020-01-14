<template>
  <div class="addAccountData bg-white box-shadow p-10">
    <el-steps :active="active" simple>
      <el-step title="第一步：维护账套基本情况" icon="el-icon-edit" />
      <el-step title="第二步：维护账套数据" icon="el-icon-edit" />
      <el-step title="第三步：维护开票数据" icon="el-icon-edit" />
      <el-step title="第四步：维护税务数据" icon="el-icon-edit" />
      <el-step title="第五步：维护账套评分点" icon="el-icon-edit" />
    </el-steps>
    <div>
      <BgInfo v-if="active === 0" :status="bgStatus" @next="next" />
      <AccountData v-if="active === 1" @back="back" @next="next" />
      <KaiPiao v-if="active === 2" @back="back" @next="next" />
      <ShenBao v-if="active === 3" @back="back" @next="next" />
      <div v-if="active === 4" class="flex">
        <!--左边菜单-->
        <div class="left text-center">
          <div class="mt-10">保存账套</div>
          <div class="line" />
          <div class="text-center"><el-button class="w-120 mb-12" type="primary" size="small" icon="el-icon-finished" @click="saveAccount">保存</el-button></div>
          <div class="text-center mb-20"><el-button class="w-120" size="small" icon="el-icon-back" plain @click="back">返回</el-button></div>
          <div style="margin-top: 30px">数据录入</div>
          <div class="line" />
          <div :class="['account-button', 'mb-12', addType===addAccountKuType.HeSuan?'active': '']" @click="changeState(addAccountKuType.HeSuan)">辅助核算</div>
          <div :class="['account-button', 'mb-12', addType===addAccountKuType.KeMu?'active': '']" @click="changeState(addAccountKuType.KeMu)">科目设置</div>
          <div :class="['account-button', 'mb-12', addType===addAccountKuType.QiChu?'active': '']" @click="changeState(addAccountKuType.QiChu)">期初数据</div>
          <div :class="['account-button', 'mb-12', addType===addAccountKuType.YeWu?'active': '']" @click="changeState(addAccountKuType.YeWu)">每月经济业务</div>
          <div :class="['account-button', 'mb-12', addType===addAccountKuType.BaoBiao?'active': '']" @click="changeState(addAccountKuType.BaoBiao)">财务报表</div>
          <div :class="['account-button', 'mb-12', addType===addAccountKuType.KaiPiao?'active': '']" @click="changeState(addAccountKuType.KaiPiao)">开票系统</div>
          <div :class="['account-button', 'mb-12', addType===addAccountKuType.ShenBao?'active': '']" @click="changeState(addAccountKuType.ShenBao)">申报系统</div>
          <div style="margin-top: 30px">汇总预览</div>
          <div class="line" />
          <div class="text-center mb-12"><el-button class="w-120" type="primary" size="small" @click="changeState(addAccountKuType.AccountPreview)">账套预览</el-button></div>
          <div class="text-center"><el-button class="w-120" type="primary" size="small" @click="changeState(addAccountKuType.ScorePreview)">评分点总览</el-button></div>
        </div>
        <!--右边详情-->
        <div v-loading="loading" class="right flex-1">
          <HeSuan v-if="addType === addAccountKuType.HeSuan" />
          <KeMu v-if="addType === addAccountKuType.KeMu" />
          <QiChu v-if="addType === addAccountKuType.QiChu" />
          <YeWu v-if="addType === addAccountKuType.YeWu" />
          <BaoBiao v-if="addType === addAccountKuType.BaoBiao" />
          <KaiPiaoScore v-if="addType === addAccountKuType.KaiPiao" />
          <ShenBaoScore v-if="addType === addAccountKuType.ShenBao" />
          <YuLan v-if="addType === addAccountKuType.AccountPreview" />
          <ScorePreview v-if="addType === addAccountKuType.ScorePreview" />
          <!--<div style="padding-left: 10px">
            <el-button type="primary" size="small" @click="back">上一步</el-button>
          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { saveAccountScore, getAccountInfo, getGuoShuiCompanyInfo } from '@/api/accountKu'
import { mapGetters } from 'vuex'
import BgInfo from './components/bgInfo'
import HeSuan from './components/heSuan'
import KeMu from './components/keMu'
import QiChu from './components/qiChu'
import BaoBiao from './components/baoBiao'
import YeWu from './components/yeWu'
import KaiPiao from './components/kaiPiao'
import ShenBao from './components/shenBao'
import YuLan from './components/yuLan'
import AccountData from './components/accountData'
import KaiPiaoScore from './components/kaiPiaoScore'
import ShenBaoScore from './components/shenBaoScore'
import ScorePreview from './components/scorePreview'
export default {
  name: 'AddAccountData',
  components: { ScorePreview, ShenBaoScore, KaiPiaoScore, AccountData, YuLan, ShenBao, KaiPiao, YeWu, BaoBiao, QiChu, KeMu, HeSuan, BgInfo },
  data() {
    return {
      addType: 1,
      active: 0,
      loading: false,
      state: false,
      kaiPiaoInfo: {},
      guoShuiInfo: {},
      geShuiInfo: {},
      baoBiaoInfo: {},
      keMuInfo: {},
      scoreKeMuSum: 0,
      scoreQiChuSum: 0,
      // 提交的数据
      submitData: {
        material: '',
        month: [],
        heSuan: {},
        keMu: {},
        qiChu: {},
        baoBiao: {},
        yeWu: {},
        kai_piao: {},
        guo_shui: {},
        ge_shui: {},
        gz_ls: {}
      },
      bgStatus: false,
      guoShuiStatus: false
    }
  },
  computed: {
    ...mapGetters(['addAccountKuType', 'accountAnswer']),
    scoreRecordHeSuan() {
      return this.$store.state.account.scoreRecord.heSuan
    },
    scoreRecordKeMu() {
      return this.$store.state.account.scoreRecord.keMu
    },
    scoreRecordQiChu() {
      return this.$store.state.account.scoreRecord.qiChu
    },
    scoreRecordYeWu() {
      return this.$store.state.account.scoreRecord.yeWu
    },
    scoreRecordBaoBiao() {
      return this.$store.state.account.scoreRecord.baoBiao
    }
  },
  watch: {
    active(value) {
      if (value === 4) {
        this.getEYunData()
      }
    }
  },
  created() {
    // 拿设置分数的记录
    this.getScoreRecord()
  },
  destroyed() {
    // 清一下总线数据
    const answer = { material: '', accountData: [], heSuan: {}, keMu: {}, qiChu: {}, baoBiao: {}, yeWu: {}, kai_piao: {}, guo_shui: {}, ge_shui: {}}
    this.$store.commit('account/SAVE_ANSWER', answer)
  },
  methods: {
    getScoreRecord() {
      const account_id = this.$store.state.account.currentAccountData.id
      getAccountInfo(account_id).then(response => {
        if (response.data) {
          // 背景信息
          this.$store.commit('account/SAVE_BG_INFO', response.data.material)
          this.bgStatus = true
          // 账套数据、开票、国税、个税数据
          const accountData = []
          const kaiPiaoData = {}
          const guoShuiData = {}
          const geShuiData = {}
          const responseKaiPiao = response.data.kai_piao
          const responseGuoShui = response.data.guo_shui
          const responseGeShui = response.data.ge_shui
          for (const i in response.data.gz_ls) {
            accountData.push({ month: i, gongZiFile: response.data.gz_ls[i].gongZiFile, gongZiUrl: response.data.gz_ls[i].gongZiUrl, liuShuiFile: response.data.gz_ls[i].liuShuiFile, liuShuiUrl: response.data.gz_ls[i].liuShuiUrl })
            if (responseKaiPiao[i]) {
              kaiPiaoData[i] = { state: 1, score: responseKaiPiao[i]['score'], account_id: responseKaiPiao[i]['account_id'], company_id: responseKaiPiao[i]['company_id'] }
            }
            if (responseGuoShui[i]) {
              getGuoShuiCompanyInfo({ account_id: responseGeShui[i]['account_id'] }).then(response => {
                guoShuiData[i] = { state: 1, score: responseGuoShui[i]['score'], account_id: responseGuoShui[i]['account_id'], company_id: responseGuoShui[i]['company_id'], config: response.data.preset }
              })
            }
            if (responseGeShui[i]) {
              // 查内置信息
              geShuiData[i] = { state: 1, score: responseGeShui[i]['score'], account_id: responseGeShui[i]['account_id'], company_id: responseGeShui[i]['company_id'] }
            }
          }
          const scoreRecord = {}
          scoreRecord['heSuan'] = response.data.fu_zhu_he_suan
          scoreRecord['keMu'] = response.data.ke_mu
          scoreRecord['qiChu'] = response.data.qi_chu
          scoreRecord['baoBiao'] = response.data.bao_biao
          scoreRecord['yeWu'] = response.data.ye_wu
          this.$store.commit('account/SAVE_ACCOUNT_DATA', accountData)
          this.$store.commit('account/SAVE_KAI_PIAO', kaiPiaoData)
          this.$store.commit('account/SAVE_GUO_SHUI', guoShuiData)
          this.$store.commit('account/SAVE_GE_SHUI', geShuiData)
          this.$store.commit('account/SAVE_SCORE_RECORD', scoreRecord)
        }
      }).catch()
    },
    getGuoShuiConfig(id) {
      getGuoShuiCompanyInfo({ account_id: id }).then(response => {
        return response.data.preset
      })
    },
    getEYunData() {
      this.loading = true
      // 取参数 userid pwd dbid month
      // const userid = this.$store.state.user.userInfo.tel
      const userid = this.$store.state.account.currentAccountData.create_user_tel
      const pwd = 'abcd123456789'
      const dbid = this.$store.state.account.currentAccountData.dbid
      let zhunZe = this.$store.state.account.currentAccountData.account_rule
      zhunZe = zhunZe.substring(0, 4)
      // 取month，可能有多个
      if (this.accountAnswer.accountData && this.accountAnswer.accountData.length > 0) {
        const heSuan = {}
        const qiChu = {}
        const yeWu = {}
        this.accountAnswer.accountData.forEach(v => {
          const monthRequest = (v.month.substring(0, 4) + v.month.substring(5, 7))
          const data = JSON.stringify({ 'userid': userid, 'pwd': pwd, 'dbid': dbid, 'month': monthRequest })
          this.post(`http://117.50.43.204:8888/yunkj/export/getExport?dbid=${dbid}&month=${monthRequest}`, { 'jsonstr': data }, response => {
            if (response.status) {
              // 直接存 => 然后到各个页面去处理组合数据
              // const month = response.data['mo'].substring(0, 4) + '-' + response.data['mo'].substring(4, 6)
              const month = v.month
              // 一、处理核算
              heSuan[month] = response.data['heSuan'] ? response.data['heSuan'] : []
              // 还原核算分数
              this.resetHeSuanScore(heSuan[month], month)
              // 二、处理科目 组完整结构
              // 1、资产
              const basicZiChanKeMu = zhunZe === '2007' ? this.$store.state.account.defaultZiChanKeMu07 : this.$store.state.account.defaultZiChanKeMu13
              // 2、负债
              const basicFuZhaiKeMu = zhunZe === '2007' ? this.$store.state.account.defaultFuZhaiKeMu07 : this.$store.state.account.defaultFuZhaiKeMu13
              // 3、共同
              const basicGongTongKeMu = zhunZe === '2007' ? this.$store.state.account.defaultGongTong07 : this.$store.state.account.defaultGongTongKeMu13
              // 4、权益
              const basicQuanYiKeMu = zhunZe === '2007' ? this.$store.state.account.defaultQuanYiKeMu07 : this.$store.state.account.defaultQuanYiKeMu13
              // 5、成本
              const basicChengBenKeMu = zhunZe === '2007' ? this.$store.state.account.defaultChengBenKeMu07 : this.$store.state.account.defaultChengBenKeMu13
              // 6、损益
              const basicSunYiKeMu = zhunZe === '2007' ? this.$store.state.account.defaultSunYiKeMu07 : this.$store.state.account.defaultSunYiKeMu13
              const jieKouZiChanKeMu = response.data['keMu'][0]['li'] ? response.data['keMu'][0]['li'] : {}
              const jieKouFuZhaiKeMu = response.data['keMu'][1]['li'] ? response.data['keMu'][1]['li'] : {}
              const jieKouGongTongKeMu = response.data['keMu'][2]['li'] ? response.data['keMu'][2]['li'] : {}
              const jieKouQuanYiKeMu = response.data['keMu'][3]['li'] ? response.data['keMu'][3]['li'] : {}
              const jieKouChengBenKeMu = response.data['keMu'][4]['li'] ? response.data['keMu'][4]['li'] : {}
              const jieKouSunYiKeMu = response.data['keMu'][5]['li'] ? response.data['keMu'][5]['li'] : {}
              basicZiChanKeMu.forEach(v => {
                const data = this.getTree(jieKouZiChanKeMu, v.nu)
                if (data.length > 0) {
                  this.$set(v, 'children', data)
                }
              })
              basicFuZhaiKeMu.forEach(v => {
                const data = this.getTree(jieKouFuZhaiKeMu, v.nu)
                if (data.length > 0) {
                  this.$set(v, 'children', data)
                }
              })
              basicGongTongKeMu.forEach(v => {
                const data = this.getTree(jieKouGongTongKeMu, v.nu)
                if (data.length > 0) {
                  this.$set(v, 'children', data)
                }
              })
              basicQuanYiKeMu.forEach(v => {
                const data = this.getTree(jieKouQuanYiKeMu, v.nu)
                if (data.length > 0) {
                  this.$set(v, 'children', data)
                }
              })
              basicChengBenKeMu.forEach(v => {
                const data = this.getTree(jieKouChengBenKeMu, v.nu)
                if (data.length > 0) {
                  this.$set(v, 'children', data)
                }
              })
              if (basicSunYiKeMu.length > 0) {
                basicSunYiKeMu.forEach(v => {
                  const data = this.getTree(jieKouSunYiKeMu, v.nu)
                  if (data.length > 0) {
                    this.$set(v, 'children', data)
                  }
                })
              }
              // this.keMuInfo[month] = [{ name: '资产', info: basicZiChanKeMu }, { name: '负债', info: basicFuZhaiKeMu }, { name: '权益', info: basicQuanYiKeMu }, { name: '成本', info: basicChengBenKeMu }, { name: '损益', info: basicSunYiKeMu }]
              // this.$set(this.keMuInfo, month, [{ name: '资产', info: basicZiChanKeMu }, { name: '负债', info: basicFuZhaiKeMu }, { name: '权益', info: basicQuanYiKeMu }, { name: '成本', info: basicChengBenKeMu }, { name: '损益', info: basicSunYiKeMu }])
              this.keMuInfo[month] = [{ name: '资产', info: basicZiChanKeMu }, { name: '负债', info: basicFuZhaiKeMu }, { name: '权益', info: basicQuanYiKeMu }, { name: '成本', info: basicChengBenKeMu }, { name: '损益', info: basicSunYiKeMu }]
              // 还原科目分数设置
              this.resetKeMuScore(this.keMuInfo[month], month)
              // 三、期初
              qiChu[month] = response.data['qiChu'] ? response.data['qiChu'] : []
              // 还原期初分数设置
              this.resetQiChuScore(qiChu[month], month)
              // 四、报表
              this.baoBiaoInfo[month] = response.data['baoBiao'] ? response.data['baoBiao'] : []
              // 还原报表分数设置
              this.resetBaoBiaoScore(this.baoBiaoInfo[month], month)
              // 五、业务 组完整业务包含发票信息li、日期da、原始资料、材料、编号bh
              yeWu[month] = []
              if (response.data.yeWu && response.data.yeWu.length > 0) {
                response.data.yeWu.forEach(v => {
                  yeWu[month].push(
                    { info: v.li, date: v.da, materialImg: [], material: '', number: v.bh }
                  )
                })
              }
              // 还原业务内容和分数设置
              this.resetYeWuScore(yeWu[month], month)
            } else {
              this.$message.error('同步云会计数据失败')
            }
          })
        })
        // 组合完整的结构 data肯定是包含多个月份的一个结构
        this.$store.commit('account/SAVE_HE_SUAN', heSuan)
        this.$store.commit('account/SAVE_KE_MU', this.keMuInfo)
        this.$store.commit('account/SAVE_QI_CHU', qiChu)
        this.$store.commit('account/SAVE_BAO_BIAO', this.baoBiaoInfo)
        this.$store.commit('account/SAVE_YE_WU', yeWu)
        this.loading = false
        console.log(this.$store.state.account.answer)
      }
    },
    // 还原核算分数
    resetHeSuanScore(data, month) {
      if (data.length > 0) {
        data.forEach((v, i) => {
          if (v.info.length > 0) {
            v.info.forEach(value => {
              const monthRecord = this.scoreRecordHeSuan[month]
              if (monthRecord && monthRecord.length > 0) {
                monthRecord.forEach(obj => {
                  if (obj.hasOwnProperty(i + '|' + value.ti)) {
                    this.$set(value, 'sc', obj[i + '|' + value.ti])
                  }
                })
              }
            })
          }
        })
      }
    },
    // 还原科目分数
    resetKeMuScore(data, month) {
      if (data.length > 0) {
        data.forEach((v, i) => {
          if (v.info.length > 0) {
            v.info.forEach(value => {
              const monthRecord = this.scoreRecordKeMu[month]
              if (monthRecord && monthRecord.length > 0) {
                monthRecord.forEach(obj => {
                  if (obj.hasOwnProperty(value.pi + value.ti + '|' + value.ye)) {
                    this.$set(value, 'sc', obj[value.pi + value.ti + '|' + value.ye])
                  }
                  // 子科目
                  this.resetKeMuChildScore(value, obj)
                })
              }
            })
          }
        })
      }
    },
    // 还原期初分数设置
    resetQiChuScore(data, month) {
      if (data.length > 0) {
        data.forEach((v, i) => {
          if (v.li.length > 0) {
            v.li.forEach(value => {
              const monthRecord = this.scoreRecordQiChu[month]
              if (monthRecord && monthRecord.length > 0) {
                monthRecord.forEach(obj => {
                  if (obj.hasOwnProperty(value.nu + '|' + value.bw)) {
                    this.$set(value, 'sc', obj[value.nu + '|' + value.bw])
                  }
                  // 子科目
                  this.resetQiChuChildScore(value, obj)
                })
              }
            })
          }
        })
      }
    },
    // 还原报表分数设置
    resetBaoBiaoScore(data, month) {
      if (data.length > 0) {
        data.forEach((v, i) => {
          if (v.name === '资产负债表') {
            if (v.li.length > 0) {
              let index = 1
              v.li.forEach(value => {
                const monthRecord = this.scoreRecordBaoBiao[month]['zcfj']
                if (monthRecord && monthRecord.length > 0) {
                  monthRecord.forEach(obj => {
                    if (obj.hasOwnProperty(index + '|' + value.fy)) {
                      this.$set(value, 'fs', obj[index + '|' + value.fy])
                    }
                    if (value.zc !== '') {
                      index = index + 1
                      if (obj.hasOwnProperty(index + '|' + value.zy)) {
                        this.$set(value, 'zs', obj[index + '|' + value.zy])
                      }
                    }
                  })
                }
                index++
              })
            }
          }
          if (v.name === '利润表') {
            if (v.li.length > 0) {
              v.li.forEach(value => {
                const monthRecord = this.scoreRecordBaoBiao[month]['lr']
                if (monthRecord && monthRecord.length > 0) {
                  monthRecord.forEach(obj => {
                    if (obj.hasOwnProperty(value.hang + '|' + value.jin_e)) {
                      this.$set(value, 'score', obj[value.hang + '|' + value.jin_e])
                    }
                  })
                }
              })
            }
          }
          if (v.name === '现金流量表') {
            if (v.li.length > 0) {
              v.li.forEach(value => {
                const monthRecord = this.scoreRecordBaoBiao[month]['xj']
                if (monthRecord && monthRecord.length > 0) {
                  monthRecord.forEach(obj => {
                    if (obj.hasOwnProperty(value.hh + '|' + value.je)) {
                      this.$set(value, 'sc', obj[value.hh + '|' + value.je])
                    }
                  })
                }
              })
            }
          }
        })
      }
    },
    // 还原业务内容和分数设置
    resetYeWuScore(data, month) {
      if (data.length > 0) {
        data.forEach((v, i) => {
          // 业务
          const monthRecord = this.scoreRecordYeWu[month]
          if (monthRecord && monthRecord.length > 0) {
            monthRecord.forEach((all, allIndex) => {
              if (allIndex === i) {
                this.$set(v, 'date', all.date)
                this.$set(v, 'material', all.material)
                this.$set(v, 'materialImg', all.materialImg)
                // 循环info
                if (v.info.length > 0) {
                  v.info.forEach(value => {
                    const monthRecordInfo = all['info']
                    if (monthRecordInfo && monthRecordInfo.length > 0) {
                      monthRecordInfo.forEach(obj => {
                        if (obj.hasOwnProperty(value.jie + value.da + value.su + value.di)) {
                          this.$set(value, 'sc', obj[value.jie + value.da + value.su + value.di])
                        }
                      })
                    }
                  })
                }
              }
            })
          }
        })
      }
    },
    resetKeMuChildScore(item, obj) {
      if (item.children && item.children.length > 0) {
        item.children.forEach(v => {
          if (obj.hasOwnProperty(v.pi + v.ti + '|' + v.ye)) {
            this.$set(v, 'sc', obj[v.pi + v.ti + '|' + v.ye])
          }
          this.resetKeMuChildScore(v, obj)
        })
      } else {
        return false
      }
    },
    resetQiChuChildScore(item, obj) {
      if (item.cd && item.cd.length > 0) {
        item.cd.forEach(v => {
          if (obj.hasOwnProperty(v.nu + '|' + v.bw)) {
            this.$set(v, 'sc', obj[v.nu + '|' + v.bw])
          }
          this.resetQiChuChildScore(v, obj)
        })
      } else {
        return false
      }
    },
    post(url, data, fn) { // datat应为'a=a1&b=b1'这种字符串格式，在jq里如果data为对象会自动将对象转成这种字符串格式
      const obj = new XMLHttpRequest()
      obj.open('POST', url, true)
      obj.onreadystatechange = function() {
        if (+obj.readyState === 4 && (+obj.status === 200 || +obj.status === 304 || +obj.status === 0)) { // 304未修改
          fn.call(this, JSON.parse(obj.responseText))
        }
      }
      obj.send(data)
    },
    getTree(treeData, parentId) {
      const treeArr = []
      for (const i in treeData) {
        if (parseInt(treeData[i].pi) === parseInt(parentId)) {
          const newNode = { fz: treeData[i].fz, nu: treeData[i].nu, ye: treeData[i].ye, dw: treeData[i].dw, ca: treeData[i].ca, sc: treeData[i].sc, wb: treeData[i].wb, ti: treeData[i].ti, pi: treeData[i].pi, children: this.getTree(treeData, treeData[i].nu) }
          treeArr.push(newNode)
        }
      }
      /* treeData.forEach(value => {
        if (parseInt(value.pi) === parseInt(parentId)) {
          const newNode = { fz: value.fz, nu: value.nu, ye: value.ye, dw: value.dw, ca: value.ca, sc: value.sc, wb: value.wb, ti: value.ti, pi: value.pi, children: this.getTree(treeData, value.nu) }
          treeArr.push(newNode)
        }
      })*/
      return treeArr
    },
    changeState(state) {
      this.addType = state
    },
    back() {
      this.active--
    },
    next() {
      this.active++
    },
    saveAccount() {
      if (this.accountAnswer.accountData && this.accountAnswer.accountData.length > 0) {
        let bool = true
        // 遍历
        this.accountAnswer.accountData.forEach(item => {
          let dataSum = 0
          // 第一个月份的百分比统计
          let scoreHeSuan = 0
          let scoreYeWu = 0
          let scoreBaoBiao = 0
          let scoreKaiPiao = 0
          let scoreGuoShui = 0
          let scoreGeShui = 0
          this.scoreKeMuSum = 0
          this.scoreQiChuSum = 0
          // 月份
          this.submitData['month'].push(item.month)
          // 辅助核算
          if (this.accountAnswer['heSuan'][item.month] && this.accountAnswer['heSuan'][item.month].length > 0) {
            this.submitData['heSuan'][item.month] = []
            this.accountAnswer['heSuan'][item.month].forEach((v, i) => {
              if (v['info'].length > 0) {
                v['info'].forEach(value => {
                  scoreHeSuan += value['sc'] ? parseInt(value['sc']) : 0
                  if (value.sc !== '' && parseInt(value.sc) > 0) {
                    const obj = {}
                    obj[i + '|' + value.ti] = value.sc
                    this.submitData['heSuan'][item.month].push(obj)
                  }
                })
              }
            })
          }
          // 科目设置
          if (this.accountAnswer['keMu'][item.month] && this.accountAnswer['keMu'][item.month].length > 0) {
            this.submitData['keMu'][item.month] = []
            this.accountAnswer['keMu'][item.month].forEach(v => {
              v['info'].forEach(value => {
                this.scoreKeMuSum += value['sc'] ? parseInt(value['sc']) : 0
                if (value.sc !== '' && parseInt(value.sc) > 0) {
                  const obj = {}
                  obj[value.pi + value.ti + '|' + value.ye] = value.sc
                  this.submitData['keMu'][item.month].push(obj)
                }
                this.addKeMuChildScore(value)
              })
            })
          }
          // 期初数据
          if (this.accountAnswer['qiChu'][item.month] && this.accountAnswer['qiChu'][item.month].length > 0) {
            this.submitData['qiChu'][item.month] = []
            this.accountAnswer['qiChu'][item.month].forEach((v, i) => {
              v['li'].forEach(value => {
                this.scoreQiChuSum += value['sc'] ? parseInt(value['sc']) : 0
                if (value.sc !== '' && parseInt(value.sc) > 0) {
                  const obj = {}
                  obj[value.nu + '|' + value.bw ] = value.sc
                  this.submitData['qiChu'][item.month].push(obj)
                }
                this.addQiChuChildScore(value)
              })
            })
          }
          // 每月经济业务
          if (this.accountAnswer['yeWu'][item.month] && this.accountAnswer['yeWu'][item.month].length > 0) {
            this.submitData['yeWu'][item.month] = []
            this.accountAnswer['yeWu'][item.month].forEach((v, i) => {
              if (v.material !== '' || v.materialImg.length > 0) {
                this.submitData['yeWu'][item.month][i] = {}
                this.submitData['yeWu'][item.month][i]['date'] = v.date
                this.submitData['yeWu'][item.month][i]['material'] = v.material
                this.submitData['yeWu'][item.month][i]['materialImg'] = v.materialImg
                this.submitData['yeWu'][item.month][i]['index'] = i
                this.submitData['yeWu'][item.month][i]['info'] = []
                v['info'].forEach(value => {
                  if (value.sc !== '' && parseInt(value.sc) > 0) {
                    const obj = {}
                    obj[value.jie + value.da + value.su + value.di] = value.sc
                    this.submitData['yeWu'][item.month][i]['info'].push(obj)
                  }
                  scoreYeWu += value['sc'] ? parseInt(value['sc']) : 0
                })
              }
            })
          }
          // 财务报表
          if (this.accountAnswer['baoBiao'][item.month] && this.accountAnswer['baoBiao'][item.month].length > 0) {
            this.submitData['baoBiao'][item.month] = {}
            this.accountAnswer['baoBiao'][item.month].forEach((v, i) => {
              if (v.name === '资产负债表') {
                this.submitData['baoBiao'][item.month]['zcfj'] = []
                if (v['li'].length > 0) {
                  let index = 1
                  v['li'].forEach(value => {
                    const obj_zc = {}
                    const obj_fz = {}
                    if (value.fs !== '' && parseInt(value.fs) > 0) {
                      obj_fz[index + '|' + value.fy] = value.fs
                      this.submitData['baoBiao'][item.month]['zcfj'].push(obj_fz)
                    }
                    if (value.zc !== '') {
                      index = index + 1
                      if (value.zs !== '' && parseInt(value.zs) > 0) {
                        obj_zc[ index + '|' + value.zy] = value.zs
                        this.submitData['baoBiao'][item.month]['zcfj'].push(obj_zc)
                      }
                    }
                    scoreBaoBiao += value['zs'] ? parseInt(value['zs']) : 0
                    scoreBaoBiao += value['fs'] ? parseInt(value['fs']) : 0
                    index++
                  })
                }
              }
              if (v.name === '利润表') {
                this.submitData['baoBiao'][item.month]['lr'] = []
                if (v['li'].length > 0) {
                  v['li'].forEach(value => {
                    if (value.score !== '' && parseInt(value.score) > 0) {
                      const obj = {}
                      obj[value.hang + '|' + value.jin_e] = value.score
                      this.submitData['baoBiao'][item.month]['lr'].push(obj)
                    }
                    scoreBaoBiao += value['score'] ? parseInt(value['score']) : 0
                  })
                }
              }
              if (v.name === '现金流量表') {
                this.submitData['baoBiao'][item.month]['xj'] = []
                if (v['li'].length > 0) {
                  v['li'].forEach(value => {
                    if (value.sc !== '' && parseInt(value.sc) > 0) {
                      const obj = {}
                      obj[value.hh + '|' + value.je] = value.sc
                      this.submitData['baoBiao'][item.month]['xj'].push(obj)
                    }
                    scoreBaoBiao += value['sc'] ? parseInt(value['sc']) : 0
                  })
                }
              }
            })
          }
          // 开票系统
          const accountKaiPiaoAnswer = this.accountAnswer['kai_piao'][item.month]
          scoreKaiPiao = this.accountAnswer['kai_piao'] ? accountKaiPiaoAnswer ? accountKaiPiaoAnswer['score'] ? parseInt(accountKaiPiaoAnswer['score']) : 0 : 0 : 0
          if (accountKaiPiaoAnswer['score'] && parseInt(accountKaiPiaoAnswer['score']) > 0) {
            this.submitData['kai_piao'][item.month] = { score: accountKaiPiaoAnswer['score'], account_id: accountKaiPiaoAnswer['account_id'], company_id: accountKaiPiaoAnswer['company_id'] }
          }
          // 国税系统
          const accountGuoShuiAnswer = this.accountAnswer['guo_shui'][item.month]
          scoreGuoShui = this.accountAnswer['guo_shui'] ? accountGuoShuiAnswer ? accountGuoShuiAnswer['score'] ? parseInt(accountGuoShuiAnswer['score']) : 0 : 0 : 0
          if (accountGuoShuiAnswer['score'] && parseInt(accountKaiPiaoAnswer['score']) > 0) {
            this.submitData['guo_shui'][item.month] = { score: accountGuoShuiAnswer['score'], account_id: accountGuoShuiAnswer['account_id'], company_id: accountGuoShuiAnswer['company_id'] }
          }
          // 个税系统
          const accountGeShuiAnswer = this.accountAnswer['ge_shui'][item.month]
          scoreGeShui = this.accountAnswer['ge_shui'] ? accountGeShuiAnswer ? accountGeShuiAnswer['score'] ? parseInt(accountGeShuiAnswer['score']) : 0 : 0 : 0
          if (accountGuoShuiAnswer['score'] && parseInt(accountKaiPiaoAnswer['score']) > 0) {
            this.submitData['ge_shui'][item.month] = { score: accountGeShuiAnswer['score'], account_id: accountGeShuiAnswer['account_id'], company_id: accountGeShuiAnswer['company_id'] }
          }
          // 流水和工资
          this.submitData['gz_ls'][item.month] = { gongZiFile: item.gongZiFile, gongZiUrl: item.gongZiUrl, liuShuiFile: item.liuShuiFile, liuShuiUrl: item.liuShuiUrl }

          dataSum = scoreHeSuan + this.scoreKeMuSum + this.scoreQiChuSum + scoreYeWu + scoreBaoBiao + scoreKaiPiao + scoreGuoShui + scoreGeShui
          if (dataSum !== 100) {
            bool = false
          }
        })
        if (bool) {
          // 提交数据
          const account_id = this.$store.state.account.currentAccountData.id
          /*
          *  material: '',month: '',heSuan: {},keMu: {},qiChu: {},baoBiao: {},yeWu: {},kai_piao: {},guo_shui: {},ge_shui: {}
          * */
          saveAccountScore({
            account_id: account_id,
            fu_zhu_he_suan: JSON.stringify(this.submitData.heSuan),
            ke_mu: JSON.stringify(this.submitData.keMu),
            qi_chu: JSON.stringify(this.submitData.qiChu),
            ye_wu: JSON.stringify(this.submitData.yeWu),
            bao_biao: JSON.stringify(this.submitData.baoBiao),
            gz_ls: JSON.stringify(this.submitData.gz_ls),
            kai_piao: JSON.stringify(this.submitData.kai_piao),
            ge_shui: JSON.stringify(this.submitData.ge_shui),
            guo_shui: JSON.stringify(this.submitData.guo_shui),
            material: this.accountAnswer.material,
            has_month: this.submitData.month.join(',')
          }).then(response => {
            this.$message.success('保存成功')
          })
        } else {
          this.$message.warning('请保证账套库总和为100%')
          setTimeout(() => {
            this.addType = this.addAccountKuType.ScorePreview
          }, 1000)
        }
      }
    },
    addKeMuChildScore(item) {
      if (item.children && item.children.length > 0) {
        item.children.forEach(v => {
          this.scoreKeMuSum += v['sc'] ? parseInt(v['sc']) : 0
          if (v.sc !== '' && parseInt(v.sc) > 0) {
            const obj = {}
            obj[v.pi + v.ti + v.ye] = v.sc
            this.submitData['keMu'][this.month].push(obj)
          }
          this.addKeMuChildScore(v)
        })
      } else {
        return this.scoreKeMuSum
      }
    },
    addQiChuChildScore(item) {
      if (item.cd && item.cd.length > 0) {
        item.cd.forEach(v => {
          this.scoreQiChuSum += v['sc'] ? parseInt(v['sc']) : 0
          if (v.sc !== '' && parseInt(v.sc) > 0) {
            const obj = {}
            obj[v.nu + '|' + v.bw] = v.sc
            this.submitData['qiChu'][this.month].push(obj)
          }
          this.addQiChuChildScore(v)
        })
      } else {
        return this.scoreQiChuSum
      }
    }
  }
}
</script>
<style>
  .addAccountData .el-steps--simple{
    /*background-color: #ffffff;*/
    padding: 10px;
  }
  .addAccountData .el-step.is-simple .el-step__title{
    font-size: 13px;
  }
</style>
<style lang="scss" scoped>
  .addAccountData{
    font-size: 13px;
    color: #333333;
    .w-120{
      width: 120px;
    }
    .mb-12{
      margin-bottom: 12px!important;
    }
    .mb-20{
      margin-bottom: 20px!important;
    }
    .account-button{
      font-size: 12px;
      width: 120px;
      margin: 0 auto;
      height: 32px;
      line-height: 32px;
      border-radius: 3px;
      border: solid 1px #93c343;
      cursor: pointer;
      background-color: #ffffff;
      color: #606266;
    }
    .account-button:hover{
      background-color: #93c343;
      color: #ffffff;
    }
    .account-button.active{
      background-color: #93c343;
      color: #ffffff;
    }
    .line{
      height: 1px;
      background-color: #efefef;
      margin: 10px 10px;
    }
    .left{
      width: 190px;
      border-right: solid 1px #EFEFEF;
      padding-bottom: 12px;
    }
    .right{
      overflow-x: auto;
    }
  }
</style>
