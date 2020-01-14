<template>
  <div class="handleLog">
    <div class="filter-container mb-12">
      <Header :title="title" class="fl mr-20" />
      <!--      <div class="search-more mr-20" @click="searchState = !searchState">-->
      <!--        <span>高级搜索</span>-->
      <!--        <i :class="searchState?'el-icon-arrow-up':'el-icon-arrow-down'"></i>-->
      <!--      </div>-->
      <!--      <el-collapse-transition>-->
      <!--        <div v-show="searchState" class="search-more-content">-->
      <!--          <div class="mb-20">-->
      <!--            <span class="w-80 inline-block text-right">操作日期：</span>-->
      <!--            <el-date-picker-->
      <!--              v-model="listQuery.time"-->
      <!--              class="w-135 mr-20"-->
      <!--              type="daterange"-->
      <!--              align="right"-->
      <!--              unlink-panels-->
      <!--              size="mini"-->
      <!--              range-separator="至"-->
      <!--              start-placeholder="开始日期"-->
      <!--              end-placeholder="结束日期"-->
      <!--            />-->
      <!--          </div>-->
      <!--          <div class="mb-20">-->
      <!--            <span class="w-80 inline-block text-right">日志类型：</span>-->
      <!--            <el-select v-model="listQuery.type" placeholder="请选择日志类型" size="mini" clearable class="w-190">-->
      <!--              <el-option label="全部" value="" />-->
      <!--              <el-option v-for="item in handleLogTypeList" :key="item.key" :label="item.value" :value="item.key" />-->
      <!--            </el-select>-->
      <!--          </div>-->
      <!--          <div class="mb-20">-->
      <!--            <span class="w-80 inline-block text-right">操作结果：</span>-->
      <!--            <el-select v-model="listQuery.result" placeholder="请选择结果" size="mini" clearable class="w-190 mr-20">-->
      <!--              <el-option label="全部" value="" />-->
      <!--              <el-option v-for="item in handleResultList" :key="item.key" :label="item.value" :value="item.key" />-->
      <!--            </el-select>-->
      <!--          </div>-->
      <!--          <div class="mb-20">-->
      <!--            <span class="w-80 inline-block text-right">日志内容：</span>-->
      <!--            <el-input v-model="listQuery.content" size="mini" placeholder="请输入日志内容" class="w-190 mr-20" />-->
      <!--          </div>-->
      <!--          <div class="text-right">-->
      <!--            <el-button v-waves size="small" type="primary" @click="handleFilter">-->
      <!--              查询-->
      <!--            </el-button>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </el-collapse-transition>-->
    </div>
    <div class="box-shadow bg-white">
      <el-table
        v-loading="listLoading"
        size="mini"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="操作日期" width="" align="center">
          <template slot-scope="{row}">
            {{ row.created_at }}
          </template>
        </el-table-column>
        <el-table-column label="日志内容" :show-overflow-tooltip="true" prop="message" align="left" width="" />
        <el-table-column label="用户" prop="op_user" align="center" width="" />
        <el-table-column label="来源IP" prop="ip" align="center" width="" />
        <!--        <el-table-column label="操作结果" prop="result" width="120" align="center" />-->
      </el-table>
    </div>
    <!--分页-->
    <pagination :total="total" class="text-center" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" @pagination="getList" />
  </div>
</template>

<script>
import { fetchHandleLogList } from '@/api/handle-log'
import Header from '@/views/common/header-span'
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'HandleLog',
  components: { Header, Pagination },
  directives: { waves, elDragDialog },
  data() {
    return {
      searchState: false,
      total: 0,
      listQuery: {
        time: '',
        type: '',
        result: '',
        content: ''
      },
      pageQuery: {
        page: 1,
        page_size: 10
      },
      listLoading: false,
      list: null
    }
  },
  computed: {
    // 类型
    handleLogTypeList() {
      return this.$store.getters.handleLogTypeList
    },
    handleResultList() {
      return this.$store.getters.handleResultList
    },
    title() {
      return this.$route.meta.title
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchHandleLogList(this.listQuery, this.pageQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .filter-container{
    .search-more-content{
      width: 550px;
    }
  }
</style>
