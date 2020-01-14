<template>
  <div class="scorePreview">
    <div class="mb-12 flex flex-justify-space-between">
      <span>
        <el-select v-model="month" placeholder="请选择月份" size="small" @change="choseMonth">
          <el-option v-for="(item, index) in monthData" :key="index" :label="item" :value="item" />
        </el-select>
      </span>
    </div>
    <div>
      <el-table
        size="mini"
        :data="tableData"
        border
        fit
        highlight-current-row
        :stripe="true"
        style="width: 100%;"
      >
        <el-table-column label="模块" width="" prop="name" align="center" />
        <el-table-column label="模块合计评分占比" width="" align="center">
          <template slot-scope="{row}">
            <span>{{ row.score }}%</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex" style="height: 36px;line-height: 36px;font-size: 12px">
        <div class="text-center flex-1" style="border: solid 1px #E8E8E8;border-top: none">合计</div>
        <div class="text-center flex-1" style="border: solid 1px #E8E8E8;border-top: none;border-left: none">
          {{ sumScore }}%
        </div>
      </div>
      <div class="text-right" style="height: 36px;line-height: 36px;font-size: 13px;color: #ff0000">
        *注：合计值不等于100%，则该月份账套无法上架
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScorePreview',
  data() {
    return {
      monthData: [],
      month: '',
      tableData: [],
      sumScore: 0,
      submitData: {},
      scoreKeMu: 0,
      scoreQiChu: 0
    }
  },
  computed: {
    accountAnswer() {
      return this.$store.getters.accountAnswer
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      if (this.accountAnswer.accountData && this.accountAnswer.accountData.length > 0) {
        this.accountAnswer.accountData.forEach(v => {
          this.monthData.push(v.month)
        })
        this.month = this.monthData[0] // 第一个月份
        this.calTable()
      }
    },
    calTable() {
      // 第一个月份的百分比统计
      let scoreHeSuan = 0
      let scoreYeWu = 0
      let scoreBaoBiao = 0
      let scoreKaiPiao = 0
      let scoreGuoShui = 0
      let scoreGeShui = 0
      this.tableData = []
      // 辅助核算
      if (this.accountAnswer['heSuan'][this.month] && this.accountAnswer['heSuan'][this.month].length > 0) {
        this.accountAnswer['heSuan'][this.month].forEach(v => {
          if (v['info'].length > 0) {
            v['info'].forEach(value => {
              scoreHeSuan += value['sc'] ? parseInt(value['sc']) : 0
            })
          }
        })
      }
      // 科目设置
      if (this.accountAnswer['keMu'][this.month] && this.accountAnswer['keMu'][this.month].length > 0) {
        this.accountAnswer['keMu'][this.month].forEach(v => {
          v['info'].forEach(value => {
            this.scoreKeMu += value['sc'] ? parseInt(value['sc']) : 0
            this.addKeMuChildScore(value)
          })
        })
      }
      // 期初数据
      if (this.accountAnswer['qiChu'][this.month] && this.accountAnswer['qiChu'][this.month].length > 0) {
        this.accountAnswer['qiChu'][this.month].forEach(v => {
          v['li'].forEach(value => {
            this.scoreQiChu += value['sc'] ? parseInt(value['sc']) : 0
            this.addQiChuChildScore(value)
          })
        })
      }
      // 每月经济业务
      if (this.accountAnswer['yeWu'][this.month] && this.accountAnswer['yeWu'][this.month].length > 0) {
        this.accountAnswer['yeWu'][this.month].forEach(v => {
          v['info'].forEach(value => {
            scoreYeWu += value['sc'] ? parseInt(value['sc']) : 0
          })
        })
      }
      // 财务报表
      if (this.accountAnswer['baoBiao'][this.month] && this.accountAnswer['baoBiao'][this.month].length > 0) {
        this.accountAnswer['baoBiao'][this.month].forEach(v => {
          v['li'].forEach(value => {
            scoreBaoBiao += value['zs'] ? parseInt(value['zs']) : 0
            scoreBaoBiao += value['fs'] ? parseInt(value['fs']) : 0
            scoreBaoBiao += value['score'] ? parseInt(value['score']) : 0
            scoreBaoBiao += value['sc'] ? parseInt(value['sc']) : 0
          })
        })
      }
      // 开票系统
      scoreKaiPiao = this.accountAnswer['kai_piao'] ? this.accountAnswer['kai_piao'][this.month] ? this.accountAnswer['kai_piao'][this.month]['score'] ? parseInt(this.accountAnswer['kai_piao'][this.month]['score']) : 0 : 0 : 0
      // 国税系统
      scoreGuoShui = this.accountAnswer['guo_shui'] ? this.accountAnswer['guo_shui'][this.month] ? this.accountAnswer['guo_shui'][this.month]['score'] ? parseInt(this.accountAnswer['guo_shui'][this.month]['score']) : 0 : 0 : 0
      // 个税系统
      scoreGeShui = this.accountAnswer['ge_shui'] ? this.accountAnswer['ge_shui'][this.month] ? this.accountAnswer['ge_shui'][this.month]['score'] ? parseInt(this.accountAnswer['ge_shui'][this.month]['score']) : 0 : 0 : 0
      this.tableData.push(
        { name: '辅助核算', score: scoreHeSuan },
        { name: '科目设置', score: this.scoreKeMu },
        { name: '期初数据', score: this.scoreQiChu },
        { name: '每月经济业务', score: scoreYeWu },
        { name: '财务报表', score: scoreBaoBiao },
        { name: '开票业务', score: scoreKaiPiao },
        { name: '国税', score: scoreGuoShui },
        { name: '个税', score: scoreGeShui },
      )
      this.sumScore = scoreHeSuan + this.scoreKeMu + this.scoreQiChu + scoreYeWu + scoreBaoBiao + scoreKaiPiao + scoreGuoShui + scoreGeShui
    },
    addKeMuChildScore(item) {
      if (item.children && item.children.length > 0) {
        item.children.forEach(v => {
          this.scoreKeMu += v['sc'] ? parseInt(v['sc']) : 0
          this.addKeMuChildScore(v)
        })
      } else {
        return this.scoreKeMu
      }
    },
    addQiChuChildScore(item) {
      if (item.cd && item.cd.length > 0) {
        item.cd.forEach(v => {
          this.scoreQiChu += v['sc'] ? parseInt(v['sc']) : 0
          this.addQiChuChildScore(v)
        })
      } else {
        return this.scoreQiChu
      }
    },
    choseMonth() {
      this.scoreKeMu = 0
      this.scoreQiChu = 0
      this.calTable()
    }
  }
}
</script>

<style lang="scss" scoped>
  .scorePreview{
    padding: 10px;
  }
</style>
