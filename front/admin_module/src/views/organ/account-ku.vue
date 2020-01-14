<template>
  <div class="accountKu">
    <!--模块开启信息-->
    <div class="w-100p">
      <div class="filter-container">
        <Header :title="title" class="fl mr-20" />
        <div class="search-more fl" @click="searchState = !searchState">
          <span>高级搜索</span>
          <i :class="searchState?'el-icon-arrow-up':'el-icon-arrow-down'" />
        </div>
        <span class="fr">
          <el-button size="small" type="primary" class="btn-plain" @click="save">保存</el-button>
          <el-button size="small" plain class="btn-plain" @click="goBack">返回</el-button>
        </span>
        <el-collapse-transition>
          <div v-show="searchState" class="search-more-content">
            <div class="flex flex-justify-space-between mb-20">
              <span><span class="w-65 inline-block text-right">账套编号：</span>
                <el-input v-model="listQuery.number" size="mini" class="w-190" />
              </span>
              <span><span class="w-65 inline-block text-right">账套名称：</span>
                <el-input v-model="listQuery.name" size="mini" class="w-190" />
              </span>
            </div>
            <div class="flex flex-justify-space-between mb-20">
              <span><span class="w-65 inline-block text-right">月份数：</span>
                <el-input v-model="listQuery.month" size="mini" class="w-190" />
              </span>
              <span><span class="w-65 inline-block text-right">纳税类型：</span>
                <el-select v-model="listQuery.payTaxType" size="mini" placeholder="请选择" class="w-190">
                  <el-option label="全部" value="" />
                  <el-option v-for="(item, index) in payTaxTypeList" :key="index" :lable="item.key" :value="item.value" />
                </el-select>
              </span>
            </div>
            <div class="flex flex-justify-space-between mb-20">
              <span><span class="w-65 inline-block text-right">会计制度：</span>
                <el-select v-model="listQuery.accountSystem" placeholder="请选择会计制度" size="mini" clearable class="w-190">
                  <el-option label="全部" value="" />
                  <el-option v-for="item in accountSystemList" :key="item.key" :label="item.key" :value="item.value" />
                </el-select>
              </span>
              <span><span class="w-65 inline-block text-right">所属行业：</span>
                <el-select v-model="listQuery.trade" size="mini" placeholder="请选择所属行业" clearable class="w-190">
                  <el-option label="全部" value="" />
                  <el-option v-for="(item, index) in tradeList" :key="index" :lable="item.key" :value="item.value" />
                </el-select>
              </span>
            </div>
            <div class="flex flex-justify-space-between mb-20">
              <span><span class="w-65 inline-block text-right">账套类型：</span>
                <el-select v-model="listQuery.accountType" placeholder="请选择账套类型" size="mini" clearable class="w-190">
                  <el-option label="全部" value="" />
                  <el-option v-for="item in accountTypeList" :key="item.key" :label="item.key" :value="item.value" />
                </el-select>
              </span>
              <span><span class="w-65 inline-block text-right">上架状态：</span>
                <el-select v-model="listQuery.showStatus" size="mini" placeholder="请选择上架状态" clearable class="w-190">
                  <el-option label="全部" value="" />
                  <el-option v-for="(item, index) in showStatusList" :key="index" :lable="item.key" :value="item.value" />
                </el-select>
              </span>
            </div>
            <div class="flex flex-justify-space-between">
              <span><span class="w-65 inline-block text-right">账套用途：</span>
                <el-select v-model="listQuery.accountUse" placeholder="请选择账套用途" size="mini" clearable class="w-190 mr-20">
                  <el-option label="全部" value="" />
                  <el-option v-for="item in accountUseList" :key="item.key" :label="item.key" :value="item.value" />
                </el-select>
              </span>
              <span>
                <el-button v-waves size="mini" type="primary" @click="getList">
                  查询
                </el-button>
              </span>
            </div>
          </div>
        </el-collapse-transition>
      </div>
      <el-table
        v-loading="listLoading"
        size="mini"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <!--        <el-table-column type="selection" align="center" />-->
        <el-table-column label="账套编号" width="" type="index" align="center" />
        <el-table-column label="账套名称" width="" prop="title" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="启用时间" width="" prop="enable_date" align="center" />
        <el-table-column label="月份数" width="" prop="" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span v-for="(item, index) in row.has_month" :key="index">
              <span v-if="index === Object.keys(row.has_month).length - 1"> {{ item }} </span>
              <span v-else> {{ item }}， </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="纳税类型" prop="tax_type" width="" align="center" show-overflow-tooltip />
        <el-table-column label="会计制度" prop="account_rule" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="所属行业" prop="industry_name" width="80" align="center">
          <template slot-scope="{row}">{{ row['industry']?row['industry']['industry_name']: row['industry_id'] }}</template>
        </el-table-column>
        <el-table-column label="账套类型" prop="tax_type" width="" align="center" show-overflow-tooltip />
        <el-table-column label="启用状态" width="80" align="center">
          <template slot-scope="{row}">
            <el-checkbox v-model="row.state" :true-label="1" :false-label="0">开启</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="开始日期" align="center" width="160">
          <template slot-scope="{row}">
            <el-date-picker
              v-model="row.start_at"
              value-format="yyyy-MM-dd"
              style="width: 135px"
              align="right"
              type="date"
              size="mini"
              placeholder="选择开始日期"
            />
          </template>
        </el-table-column>
        <el-table-column label="开启日期" width="120" align="center">
          <template slot-scope="{row}">
            <el-select v-model="row.year" size="mini" placeholder="请选择">
              <el-option v-for="(item, index) in openTime" :key="index" :label="item.value" :value="item.key" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="结束日期" width="120" align="center">
          <template slot-scope="{row}">
            {{ calculate(row.start_at, row.year) }}
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="pageQuery.page" :limit.sync="pageQuery.page_size" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import Header from '@/views/common/header-span'
import { fetchAccountKuListDetail } from '@/api/accountKu'
import { handleGetOrgOrder, handleAddAccountOrder } from '@/api/organ'
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import Pagination from '@/components/Pagination'
export default {
  name: 'AccountKu',
  components: { Pagination, Header },
  directives: { elDragDialog, waves },
  data() {
    return {
      module: {
        plan: ''
      },
      listLoading: true,
      list: [],
      total: 10,
      listQuery: {
        number: '',
        name: '',
        month: '',
        payTaxType: '',
        accountSystem: '',
        trade: '',
        accountType: '',
        showStatus: '',
        accountUse: ''
      },
      pageQuery: {
        page: 1,
        page_size: 10
      },
      searchState: false,
      haveOrders: []
    }
  },
  computed: {
    title() {
      return this.$route.meta.title
    },
    // 期限
    openTime() {
      return this.$store.getters.openTime
    },
    // 纳税人类型
    payTaxTypeList() {
      return this.$store.getters.payTaxTypeList
    },
    // 会计制度
    accountSystemList() {
      return this.$store.getters.accountSystemList
    },
    // 行业
    tradeList() {
      return this.$store.getters.tradeList
    },
    // 账套类型
    accountTypeList() {
      return this.$store.getters.accountTypeList
    },
    // 上架状态
    showStatusList() {
      return this.$store.getters.showStatusList
    },
    // 账套用途
    accountUseList() {
      return this.$store.getters.accountUseList
    },
    host() {
      return window.host
    },
    headers() {
      return {
        token: this.$store.state.access_token_teacher
      }
    }
  },
  created() {
    this.getOrgOrder()
  },
  methods: {
    getOrgOrder() {
      const id = this.$route.params.id
      handleGetOrgOrder({ id: id }).then(response => {
        this.haveOrders = response.msg
        this.getList()
      })
    },
    getList() {
      this.listLoading = true
      fetchAccountKuListDetail(this.listQuery, this.pageQuery).then(response => {
        this.list = response.data.data
        this.list.forEach((v, i) => {
          if (this.haveOrders['account'] && this.haveOrders['account'].length > 0) {
            this.haveOrders['account'].forEach(value => {
              if (value.module_id === v.id) {
                this.$set(v, 'state', parseInt(value.state))
                this.$set(v, 'start_at', value.start_at)
                this.$set(v, 'year', value.year)
              }
            })
          }
        })
        this.total = response.data.total
        this.listLoading = false
      })
    },
    calculate(dataStr, num) {
      let numInt = 0
      let resultStr = ''
      if (dataStr) {
        if (num) {
          numInt = num
        }
        resultStr = (parseInt(dataStr.slice(0, 4)) + numInt) + dataStr.slice(4, dataStr.length)
      }
      return resultStr
    },
    // 保存
    save() {
      const account = []
      this.list.forEach(v => {
        if (v.state) {
          account.push({ module_id: v.id, state: v.state, start_at: v.start_at, year: v.year })
        }
      })
      handleAddAccountOrder({ org_id: this.$route.params.id, account: account }).then(response => {
        this.$message.success('保存成功')
      })
    },
    goBack() {
      this.$router.push('/organ/account')
    }
  }
}
</script>

<style lang="scss" scoped>
  .accountKu {
    .header{
      height: 40px;
      line-height: 40px;
      border-bottom: solid 1px #EEEEEE;
    }
    .search-more-content{
      left: 85px;
    }
  }
</style>
