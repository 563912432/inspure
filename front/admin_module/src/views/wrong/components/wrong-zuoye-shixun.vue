<template>
  <div class="wrongZuoyeShixun mt-12">
    <!--模块开启信息-->
    <div class="w-100p">
      <div class="filter-container">
        <div class="search-more fl" @click="searchState = !searchState">
          <span>高级搜索</span>
          <i :class="searchState?'el-icon-arrow-up':'el-icon-arrow-down'" />
        </div>
        <el-collapse-transition>
          <div v-show="searchState" class="search-more-content">
            <div class="flex flex-justify-space-between mb-20">
              <span><span class="w-80 inline-block text-right">实训类型：</span>
                <el-select v-model="listQuery.type" clearable size="mini" multiple placeholder="请选择实训类型" class="w-190">
                  <el-option label="全部" value="" />
                  <el-option v-for="(item, index) in payTaxTypeList" :key="index" :value="item.key" :label="item.value" />
                </el-select>
              </span>
              <span><span class="w-80 inline-block text-right">关联系统：</span>
                <el-select v-model="listQuery.type" clearable size="mini" multiple placeholder="请选择关联系统" class="w-190">
                  <el-option label="全部" value="" />
                  <el-option v-for="(item, index) in payTaxTypeList" :key="index" :value="item.key" :label="item.value" />
                </el-select>
              </span>
            </div>
            <div class="flex flex-justify-space-between mb-20">
              <span><span class="w-80 inline-block text-right">账套名称：</span>
                <el-input v-model="listQuery.title" clearable size="mini" class="w-190" />
              </span>
              <span><span class="w-80 inline-block text-right">来源：</span>
                <el-select v-model="listQuery.from" clearable size="mini" multiple placeholder="请选择来源" class="w-190">
                  <el-option label="全部" value="" />
                  <el-option label="浪潮易云" :value="0" />
                  <el-option label="院校自建" :value="1" />
                </el-select>
              </span>
            </div>
            <div class="mb-20">
              <span><span class="w-80 inline-block text-right">关键词搜索：</span>
                <el-input v-model="listQuery.title" clearable size="mini" class="w-190" />
              </span>
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
        :sort-orders="['ascending', 'descending']"
        @sort-change="changeTableSort"
      >
        <el-table-column label="业务类型" prop="tax_type" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="编号" width="" type="index" align="center" />
        <el-table-column label="账套名称" width="" prop="title" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="考试类型" width="" prop="exam_type" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="来源" prop="enable" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="关联系统" prop="account_type" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="做题人数" sortable prop="doneNum" width="" align="center" />
        <el-table-column label="答对人数" sortable prop="rightNum" width="" align="center" />
        <el-table-column label="答错人数" sortable prop="wrongNum" width="" align="center" />
        <el-table-column label="正确率" sortable="custom" prop="rightRate" width="" align="center" />
        <el-table-column label="最后更新日期" prop="updated_at" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="上架状态" prop="enable" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="操作" width="" align="center">
          <template slot-scope="{row}">
            <el-button type="text" class="text-add" size="mini" @click="copy(row.id)">
              参考制题
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination v-show="total>0" class="text-center" :total="total" :page.sync="pageQuery.page" :limit.sync="pageQuery.page_size" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import { fetchAccountKuListDetail } from '@/api/accountKu'
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import Pagination from '@/components/Pagination'
export default {
  name: 'WrongZuoyeShixun',
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
        this.list.forEach(v => {
          v['exam_type'] = '期末考试'
          v['from'] = '浪潮易云'
          v['doneNum'] = this.random(1, 100)
          v['rightNum'] = this.random(1, 100)
          v['wrongNum'] = this.random(1, 100)
          v['rightRate'] = this.random(1, 100) + '%'
        })
        this.total = response.data.total
        this.listLoading = false
      })
    },
    copy(id) {},
    changeTableSort(column) {
      // 获取字段名称和排序类型
      var fieldName = column.prop
      var sortingType = column.order

      // 如果字段名称为“创建时间”，将“创建时间”转换为时间戳，才能进行大小比较
      if (fieldName === 'rightRate') {
        if (sortingType === 'descending') {
          // 按照降序排序
          this.list = this.list.sort((a, b) => b[fieldName].substring(0, b[fieldName].length - 1) - a[fieldName].substring(0, a[fieldName].length - 1))
        } else {
          // 按照升序排序
          this.list = this.list.sort((a, b) => a[fieldName].substring(0, a[fieldName].length - 1) - b[fieldName].substring(0, b[fieldName].length - 1))
        }
      }
    },
    random(lower, upper) {
      return Math.floor(Math.random() * (upper - lower)) + lower
    }
  }
}
</script>

<style lang="scss" scoped>
  .wrongZuoyeShixun {
    .header{
      height: 40px;
      line-height: 40px;
      border-bottom: solid 1px #EEEEEE;
    }
    .search-more-content{
    }
  }
</style>
