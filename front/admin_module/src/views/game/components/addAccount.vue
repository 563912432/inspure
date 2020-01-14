<template>
  <div class="account">
    <div class="filter-container">
      <div class="search-more fl mr-20" @click="searchState = !searchState">
        <span>高级搜索</span>
        <i :class="searchState?'el-icon-arrow-up':'el-icon-arrow-down'" />
      </div>
      <el-collapse-transition>
        <div v-show="searchState" class="search-more-content">
          <div class="mb-20 fl w-half">
            <span class="w-80 inline-block text-right">账套编号：</span>
            <el-input v-model="listQuery.accountcode" size="small" clearable placeholder="请输入账套编号" class="w-190" />
          </div>
          <div class="mb-20 fl w-half text-right">
            <span class="w-80 inline-block text-right">月份数 ≥：</span>
            <el-input v-model="listQuery.month" size="small" clearable placeholder="几月" class="w-190" />
          </div>
          <div class="mb-20 fl w-half">
            <span class="w-80 inline-block text-right">纳税类型：</span>
            <el-select v-model="listQuery.taxtype" placeholder="请选择纳税类型" size="small" clearable class="w-190">
              <el-option label="一般纳税人" value="1" />
              <el-option label="小规模纳税人" value="2" />
            </el-select>
          </div>
          <div class="mb-20 fl w-half text-right">
            <span class="w-80 inline-block text-right">会计制度：</span>
            <el-select v-model="listQuery.system" placeholder="请选择会计制度" size="small" clearable class="w-190">
              <el-option label="2013" value="1" />
              <el-option label="2017" value="2" />
            </el-select>
          </div>
          <div class="mb-20 fl w-half">
            <span class="w-80 inline-block text-right">账套来源：</span>
            <el-select v-model="listQuery.source" placeholder="请选择账套来源" size="small" clearable class="w-190">
              <el-option label="浪潮账套" value="1" />
              <el-option label="自建账套" value="2" />
            </el-select>
          </div>
          <div class="mb-20 fl w-half text-right">
            <span class="w-80 inline-block text-right">所属行业：</span>
            <el-select v-model="listQuery.trade" placeholder="请选择所属行业" size="small" clearable class="w-190">
              <el-option label="商业" value="1" />
              <el-option label="工业" value="2" />
            </el-select>
          </div>
          <div class="mb-20 fl w-half">
            <span class="w-80 inline-block text-right">账套类型：</span>
            <el-select v-model="listQuery.type" placeholder="请选择账套类型" size="small" clearable class="w-190">
              <el-option label="真实账目" value="1" />
              <el-option label="仿编账目" value="2" />
            </el-select>
          </div>
          <div class="text-right">
            <el-button size="mini" type="primary" @click="getList">
              查询
            </el-button>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div v-if="currentRow != ''" class="h-30 mb-10">
      <p class="fl">
        <span>选择账套月份:</span>
        <el-tag type="success">{{ currentRow.title }}</el-tag>
      </p>
      <p class="fl" style="margin-left: 15px; line-height: 30px;">
        <el-radio v-model="currentRowMonth" label="1">1月</el-radio>
        <el-radio v-model="currentRowMonth" label="2">2月</el-radio>
        <el-radio v-model="currentRowMonth" label="3">3月</el-radio>
      </p>
    </div>
    <div class="con-table">
      <!--列表部分-->
      <el-table
        :data="tableData"
        border
        size="mini"
        highlight-current-row
        style="width: 100%"
        @current-change="handleCurrentChange"
      >
        <el-table-column prop="id" label="编号" width="50" />
        <el-table-column prop="title" label="账套名称" width="" />
        <el-table-column prop="enable_date" label="启用时间" width="90" />
        <el-table-column prop="has_month" label="月份" width="50" />
        <el-table-column prop="tax_type" label="纳税类型" width="100" />
        <el-table-column prop="account_rule" label="会计制度" />
        <el-table-column prop="industry" label="所属行业" width="80">
          <template slot-scope="{ row }">
            {{ row['industry']?row['industry']['industry_name']: '' }}
          </template>
        </el-table-column>
        <el-table-column prop="account_type" label="账套类型" width="80" />
        <el-table-column prop="created_at" label="更新时间">
          <template slot-scope="{ row }">
            <span>{{ row.created_at | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="is_top" label="来源" width="60">
          <template slot-scope="{ row }">
            {{ row.is_top == 1? '浪潮': '非浪潮' }}
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <pagination :total="total" class="text-center" :page.sync="pageQuery.page" :limit.sync="pageQuery.page_size" @pagination="setAccountList" />
      <div class="text-right mt-10">
        <el-button size="mini" type="primary" @click="saveCheck">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getAccountList } from '@/api/game'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'AddAccount',
  components: { Pagination },
  filters: {
    formatDate: function(value) {
      const date = new Date(value * 1000)
      const y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
    }
  },
  data() {
    return {
      searchState: false,
      listQuery: {
        accountcode: '', // 账套编号
        month: '', // 账套月份数
        taxtype: '', // 纳税类型
        source: '', // 账套来源
        trade: '' // 所属行业
      },
      tableData: [],
      currentRow: '', // 选中的行
      currentRowMonth: '', // 选中行绑定的月份
      // 分页控件数据
      total: 0, // 分页总条数
      pageQuery: {
        page: 1,
        page_size: 10
      }
    }
  },
  created() {
    this.setAccountList()
  },
  methods: {
    handleCurrentChange(val) {
      this.currentRow = val
      // console.log(this.currentRow)
    },
    getList() {
      console.log(123123)
    },
    // 查询账套列表信息
    setAccountList() {
      var data = {}

      getAccountList(data, this.pageQuery).then(res => {
        // console.log(res.data.total)
        this.total = res.data.total
        this.tableData = res.data.data
      })
    },
    saveCheck() {
      if (this.currentRowMonth !== '') {
        var structure = {}
        structure[this.currentRow.id] = {
          time: 0,
          score: 0,
          month: this.currentRowMonth
        }
        var data = {}
        data['currentRow'] = this.currentRow
        data['currentRow']['month'] = this.currentRowMonth
        data['key'] = '7'
        data['item'] = {}
        data['item'] = structure
        this.$root.$emit('ztSelection', data)
        this.$message.success('保存成功')
      } else {
        this.$message.error('请选择账套月份')
      }
    }
  }
}
</script>

<style>
  .account .el-table--border th:first-child .cell, .account .el-table--border td:first-child .cell{
    padding: 0px;
  }
  .account .con-table .el-table__row td{
    text-align: center;
  }
</style>
<style scoped>
  .account{
    min-height: 300px;
  }
  .account .w-half{
    width: 50%;
  }
</style>
