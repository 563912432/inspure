<template>
  <div class="binding-exam">
    <div class="filter-container">
      <div class="search-more fl mr-20" @click="searchState = !searchState">
        <span>高级搜索</span>
        <i :class="searchState?'el-icon-arrow-up':'el-icon-arrow-down'" />
      </div>
      <el-collapse-transition>
        <div v-show="searchState" class="search-more-content">
          <div class="mb-20 fl w-half">
            <span class="w-80 inline-block text-right">考试名称：</span>
            <el-input v-model="listQuery.title" size="small" clearable placeholder="请输入考试名称" class="w-190" />
          </div>
          <div class="mb-20 fl w-half text-right">
            <span class="w-80 inline-block text-right">考试分类：</span>
            <el-select v-model="listQuery.category_id" size="small" clearable placeholder="请选择考试分类">
              <el-option
                v-for="item in examInfoType"
                :key="item.id"
                :label="item.category_title"
                :value="item.id"
              />
            </el-select>
          </div>
          <div class="mb-20 fl">
            <span class="w-80 inline-block text-right">报名时间：</span>
            <el-date-picker
              v-model="listQuery.at"
              size="small"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              clearable
              range-separator="至"
              start-placeholder="考试开始"
              end-placeholder="考试结束"
            />
          </div>
          <div class="text-right">
            <el-button size="mini" type="primary" @click="getList">
              查询
            </el-button>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="con-table">
      <el-table
        ref="listTable"
        v-loading="ListLoading"
        size="mini"
        :data="List"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @current-change="handleCurrentChange"
      >
        <el-table-column width="40" align="center">
          <template slot-scope="{ row }">
            <!--<input type="radio" v-model="radio" :value="row.id"/>-->
            <el-radio v-model="radio" :label="row.id" />
          </template>
        </el-table-column>
        <el-table-column label="考试名称" width="" prop="title" align="center" />
        <el-table-column label="分类" width="" prop="category_id" align="center">
          <template slot-scope="{ row }">
            {{ row.category? row.category.category_title: '' }}
          </template>
        </el-table-column>
        <el-table-column label="总分" width="80" prop="validate_code" align="center">
          <template slot-scope="{ row }">
            {{ row.paper? row.paper.full_score: '0' }}
          </template>
        </el-table-column>
        <el-table-column label="开始时间" width="140" prop="start_at" align="center" />
        <el-table-column label="结束时间" width="140" prop="end_at" align="center" />
        <el-table-column label="创建人" width="80" prop="create_user" align="center" />
        <el-table-column label="状态" width="60" prop="enable" align="center">
          <template slot-scope="{ row }">
            {{ row.enable === 0? '未发布': '已发布' }}
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <Pagination :total="total" class="text-center" :page-sizes="[10, 20, 35, 50]" :page.sync="pageQuery.page" :limit.sync="pageQuery.page_size" @pagination="getList" />
    </div>
    <div class="text-right">
      <el-button size="small" type="primary" @click="peopleSubmit">
        确定
      </el-button>
    </div>
  </div>
</template>

<script>
import { getMatchCategoryList, matchList } from '@/api/game'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'BindingExam',
  components: { Pagination },
  data() {
    return {
      // 高级搜索集合
      listQuery: {
        title: '',
        category_id: '',
        at: [], // 开始/结束时间
        enable: 0 // 仅显示发布的考试
      },
      // 分页控件数据
      total: 0, // 分页总条数
      pageQuery: {
        page: 1,
        page_size: 10
      },
      List: [], // 考试列表集合
      searchState: false,
      examInfoType: [],
      ListLoading: false,
      currentRow: '', // 选中行
      radio: ''
    }
  },
  mounted() {
    this.getList() // 查询试卷列表
    this.getExamInfoType() // 查询试卷分类
  },
  methods: {
    getList() {
      matchList(this.listQuery, this.pageQuery).then(res => {
        this.total = res.data.total
        this.List = res.data.data
      })
    },
    // 查询考试分类
    getExamInfoType() {
      getMatchCategoryList().then(res => {
        this.examInfoType = res.data.data
      })
    },
    // 单选选中行
    handleCurrentChange(val) {
      this.currentRow = val
      this.radio = val.id
    },
    // 确认选择
    peopleSubmit() {
      this.$root.$emit('checkExam', this.currentRow)
    }
  }
}
</script>

<style>
  .binding-exam .el-radio__label {
    padding-left: 0px;
    display: none;
  }
  .binding-exam tr {
    cursor: pointer;
  }
</style>
<style scoped>

</style>
