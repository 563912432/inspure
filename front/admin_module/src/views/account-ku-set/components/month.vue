<template>
  <div class="month">
    <el-table
      size="mini"
      :data="listData"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="月份" width="" prop="month" align="center" />
      <el-table-column label="操作" width="" prop="" align="center">
        <template slot-scope="{ row }">
          <el-button v-if="row.enable" type="text" size="small" @click="addMonth(row.month, row.enable)">新增月份</el-button>
          <el-button v-if="row.enable" type="text" size="small" @click="delMonth(row.month)">删除月份</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-10">
      <el-button class="mb-12" type="primary" size="mini" @click="saveMonth">
        保存
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Month',
  data() {
    return {
      listData: [
        // { month: '2019-09', enable: 0 },
        // { month: '2019-10', enable: 1 }
      ]
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      const accountAnswer = this.$store.getters.accountAnswer
      if (accountAnswer.month && accountAnswer.month.length > 0) {
        this.listData = []
        accountAnswer.month.forEach(v => {
          this.listData.push({ month: v, enable: 1 })
        })
        this.listData[0].enable = 0
      }
    },
    // 月份增加
    addMonth(month, enable) {
      let date = new Date(month)
      date.setMonth(date.getMonth() + 1)
      date = date.getFullYear() + '-' + (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1)
      this.listData.forEach(v => {
        if (v.month === month) {
          v.enable = 0
        }
      })
      this.listData.push({ month: date, enable: 1 })
    },
    // 月份删除
    delMonth(month) {
      if (this.listData.length > 1) {
        this.listData.forEach((v, i) => {
          if (v.month === month) {
            this.listData.splice(i, 1)
            this.listData[i - 1].enable = 1
          }
        })
      }
    },
    // 保存月份
    saveMonth() {
      const month = []
      this.listData.forEach(v => {
        month.push(v.month)
      })
      this.$store.commit('account/SAVE_MONTH', month)
      this.$message.success('保存成功')
      // console.log(this.$store.getters.accountAnswer)
    }
  }
}
</script>

<style lang="scss" scoped>
  .month{
    padding: 10px 0 10px 10px;
  }
</style>
