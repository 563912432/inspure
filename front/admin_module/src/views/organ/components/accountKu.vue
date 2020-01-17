<template>
  <div class="accountKu">
    <!--模块开启信息-->
    <div class="w-100p">
      <div class="filter-container mt-12">
        <div class="search-more fl" @click="searchState = !searchState">
          <span>高级搜索</span>
          <i :class="searchState?'el-icon-arrow-up':'el-icon-arrow-down'" />
        </div>
        <div class="fr mb-12 text-right">
          <el-button size="small" type="primary" @click="exportAccountKu">导出</el-button>
        </div>
        <el-collapse-transition>
          <div v-show="searchState" class="search-more-content">
            <div class="flex flex-justify-space-between mb-20">
              <span><span class="w-65 inline-block text-right">实训类型：</span>
                <el-select v-model="listQuery.type" clearable size="mini" multiple placeholder="请选择实训类型" class="w-190">
                  <el-option label="全部" value="" />
                  <el-option v-for="(item, index) in payTaxTypeList" :key="index" :value="item.key" :label="item.value" />
                </el-select>
              </span>
              <span><span class="w-65 inline-block text-right">关联系统：</span>
                <el-select v-model="listQuery.type" clearable size="mini" multiple placeholder="请选择关联系统" class="w-190">
                  <el-option label="全部" value="" />
                  <el-option v-for="(item, index) in payTaxTypeList" :key="index" :value="item.key" :label="item.value" />
                </el-select>
              </span>
            </div>
            <div class="flex flex-justify-space-between mb-20">
              <span><span class="w-65 inline-block text-right">选择行业：</span>
                <el-select v-model="listQuery.industry_name" clearable size="mini" multiple placeholder="请选择行业" class="w-190">
                  <el-option label="全部" value="" />
                  <el-option v-for="(item, index) in payTaxTypeList" :key="index" :value="item.key" :label="item.value" />
                </el-select>
              </span>
              <span><span class="w-65 inline-block text-right">岗位筛选：</span>
                <el-select v-model="listQuery.type" clearable size="mini" multiple placeholder="请选择岗位" class="w-190">
                  <el-option label="全部" value="" />
                  <el-option v-for="(item, index) in payTaxTypeList" :key="index" :value="item.key" :label="item.value" />
                </el-select>
              </span>
            </div>
            <div class="flex flex-justify-space-between mb-20">
              <span><span class="w-65 inline-block text-right">账套名称：</span>
                <el-input v-model="listQuery.title" clearable size="mini" class="w-190" />
              </span>
              <span><span class="w-65 inline-block text-right">来源：</span>
                <el-select v-model="listQuery.from" clearable size="mini" multiple placeholder="请选择来源" class="w-190">
                  <el-option label="全部" value="" />
                  <el-option label="浪潮易云" :value="0" />
                  <el-option label="院校自建" :value="1" />
                </el-select>
              </span>
            </div>
            <div class="flex flex-justify-space-between mb-20">
              <span><span class="w-65 inline-block text-right">纳税类型：</span>
                <el-select v-model="listQuery.tax_type" clearable size="mini" placeholder="请选择" class="w-190">
                  <el-option label="全部" value="" />
                  <el-option v-for="(item, index) in payTaxTypeList" :key="index" :value="item.key" :label="item.value" />
                </el-select>
              </span>
              <span><span class="w-65 inline-block text-right">会计制度：</span>
                <el-select v-model="listQuery.accountSystem" placeholder="请选择会计制度" size="mini" clearable class="w-190">
                  <el-option label="全部" value="" />
                  <el-option v-for="item in accountSystemList" :key="item.key" :label="item.key" :value="item.value" />
                </el-select>
              </span>
            </div>
            <div class="flex flex-justify-space-between mb-20">
              <span><span class="w-65 inline-block text-right">引用次数：</span>
                <el-input v-model="listQuery.times_from" type="number" clearable size="mini" class="w-80" /> -
                <el-input v-model="listQuery.times_to" type="number" clearable size="mini" class="w-80" />
              </span>
              <span><span class="w-65 inline-block text-right">账套类型：</span>
                <el-select v-model="listQuery.account_type" placeholder="请选择账套类型" size="mini" clearable class="w-190">
                  <el-option label="全部" value="" />
                  <el-option v-for="(item, index) in accountTypeList" :key="index" :label="item.value" :value="item.key" />
                </el-select>
              </span>
            </div>
            <div class="mb-20">
              <span class="w-65 inline-block text-right">账期：</span>
              <el-date-picker
                v-model="listQuery.has_month"
                size="mini"
                type="monthrange"
                range-separator="-"
                start-placeholder="开始月份"
                end-placeholder="结束月份"
              />
            </div>
            <div class="text-right">
              <el-button v-waves size="mini" type="primary" @click="getList">
                查询
              </el-button>
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
        <el-table-column type="selection" align="center" />
        <el-table-column label="账套名称" width="" prop="title" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="编号" width="" type="index" align="center" />
        <el-table-column label="实训类型" prop="tax_type" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="业务数量" prop="tax_type" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="账期" prop="tax_type" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="引用次数" prop="tax_type" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="纳税类型" prop="tax_type" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="会计制度" prop="account_rule" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="所属行业" prop="industry_name" width="" align="center" :show-overflow-tooltip="true">
          <template slot-scope="{row}">{{ row['industry']?row['industry']['industry_name']: row['industry_id'] }}</template>
        </el-table-column>
        <el-table-column label="账套类型" prop="account_type" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="关联系统" prop="account_type" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="最后更新日期" prop="updated_at" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="上架状态" prop="enable" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="来源" prop="enable" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="查看" width="" align="center" :show-overflow-tooltip="true">
          <template slot-scope="{row}">
            <el-button type="text" class="text-add" size="mini" @click="watchDetail(row.id)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" class="text-center" :total="total" :page.sync="pageQuery.page" :limit.sync="pageQuery.page_size" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import { fetchAccountKuListDetail } from '@/api/accountKu'
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import Pagination from '@/components/Pagination'
export default {
  name: 'AccountKu',
  components: { Pagination },
  directives: { elDragDialog, waves },
  data() {
    return {
      module: {
        plan: ''
      },
      listLoading: true,
      list: null,
      total: 10,
      listQuery: {
        title: '',
        has_month: '',
        tax_type: '',
        accountSystem: '',
        industry_name: [],
        account_type: '',
        enable: '',
        purpose: ''
      },
      pageQuery: {
        page: 1,
        page_size: 10
      },
      searchState: false
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
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchAccountKuListDetail(this.listQuery, this.pageQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    exportAccountKu() {},
    watchDetail() {}
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
    }
  }
</style>
