<template>
  <div class="select-exam">
    <div class="filter-container">
      <el-input v-model="listQuery.paper_title" size="mini" clearable placeholder="请输入试卷名称" class="w-190">
        <el-button slot="append" icon="el-icon-search" @click="getList" />
      </el-input>
      <el-select v-model="listQuery.create_type" size="mini" placeholder="请选择试卷分类">
        <el-option
          v-for="item in examType"
          :key="item.id"
          :label="item.category_title"
          :value="item.id"
          @change="getList"
        />
      </el-select>
    </div>
    <div class="con-table">
      <el-table
        ref="listTable"
        v-loading="ListLoading"
        size="mini"
        :data="List"
        border
        fit
        style="width: 100%;"
        highlight-current-row
        @current-change="chosePaper"
      >
        <el-table-column label="试卷名称" width="" prop="paper_title" align="center" />
        <el-table-column label="试卷分类" width="" prop="examtype" align="center">
          <template slot-scope="{ row }">
            {{ row.category? row.category.category_title: '' }}
          </template>
        </el-table-column>
        <el-table-column label="组卷方式" width="80" prop="create_type" align="center">
          <template slot-scope="{ row }">
            {{ row.create_type === 1? '抽题组卷': '选题组卷' }}
          </template>
        </el-table-column>
        <el-table-column label="总分" width="60" prop="full_score" align="center" />
        <el-table-column label="创建人" width="" prop="create_user" align="center" />
        <el-table-column label="创建时间" width="" prop="created_at" align="center">
          <template slot-scope="{ row }">
            {{ row.created_at | formatDate }}
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <Pagination :total="total" class="text-center" :page-sizes="[10, 20, 35, 50]" :page.sync="pageQuery.page" :limit.sync="pageQuery.page_size" @pagination="getList" />
    </div>
    <div class="text-right mt-10">
      <el-button size="mini" type="primary" @click="confirmCheck">
        确定
      </el-button>
    </div>
  </div>
</template>

<script>
import { getPaperList, setPaperCategoryList } from '@/api/game'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'SelectExam',
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
      // 高级搜索集合
      listQuery: {
        title: '',
        category_id: '',
        at: [], // 开始/结束时间
        type: 0, // 0:比赛用试卷  1:闯关赛用试卷
        enable: 0 // 仅显示发布的考试
      },
      // 分页控件数据
      total: 0, // 分页总条数
      pageQuery: {
        page: 1,
        page_size: 10
      },
      List: [], // 试卷列表集合
      examType: [], // 试卷分类
      ListLoading: false,
      currentRow: null // 选中行
    }
  },
  mounted() {
    this.getList() // 查询试卷列表
    this.getExamType() // 查询试卷分类
  },
  methods: {
    // 试卷列表查询
    getList() {
      getPaperList(this.listQuery, this.pageQuery).then(res => {
        this.total = res.data.total
        this.List = res.data.data
      })
    },
    // 查询试卷分类
    getExamType() {
      setPaperCategoryList().then(res => {
        this.examType = res.data
      })
    },
    // 列表选中
    chosePaper(val) {
      this.currentRow = val
    },
    // 确认选择
    confirmCheck() {
      if (this.currentRow) {
        this.$root.$emit('examInfo', this.currentRow)
        this.$message.success('选择成功')
      } else {
        this.$message.error('请先选择试卷')
      }
    }
  }
}
</script>

<style scoped>
  .select-exam {
    padding: 15px;
  }
</style>
