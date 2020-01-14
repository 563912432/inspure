<template>
  <div class="exam-manage">
    <div class="filter-container">
      <Header :title="title" class="fl mr-20" />
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
    <div class="mb-12" style="height: 30px;">
      <span class="fr">
        <el-button size="mini" type="primary" @click="handleExamType">
          管理试卷分类
        </el-button>
        <el-button size="mini" plain @click="toAddExam()">
          创建试卷
        </el-button>
        <el-button size="mini" plain @click="allDel()">
          删除
        </el-button>
      </span>
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
        @selection-change="ChosePaper"
      >
        <el-table-column type="selection" width="30" align="center" />
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
        <el-table-column label="限制每题时长" width="110" prop="limittime" align="center">
          <template slot-scope="{ row }">
            {{ row.limit_per_exam_time === 0? '否': '是' }}
          </template>
        </el-table-column>
        <el-table-column label="总分" width="60" prop="full_score" align="center" />
        <el-table-column label="创建人" width="" prop="create_user" align="center" />
        <el-table-column label="创建时间" width="" prop="created_at" align="center">
          <template slot-scope="{ row }">
            {{ row.created_at | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="{ row }">
            <el-button type="text" size="mini" @click="toAddExam(row.id)">编辑</el-button>
            <el-button type="text" size="mini" @click="allDel(row.id)">删除</el-button>
            <el-button type="text" size="mini" @click="paperCopyItem(row.id)">复制试卷</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <Pagination :total="total" class="text-center" :page-sizes="[10, 20, 35, 50]" :page.sync="pageQuery.page" :limit.sync="pageQuery.page_size" @pagination="getList" />
    </div>
    <!--管理考试分类-->
    <el-dialog
      v-el-drag-dialog
      class="exam-type-dialog"
      :modal="false"
      title="管理试卷分类"
      :visible.sync="dialogExamCateVisible"
      :close-on-click-modal="false"
      width="500px"
      @dragDialog="handleExamCateDrag"
    >
      <div ref="examCateDiv">
        <ExamTypeTree ref="examType" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { setPaperCategoryList, getPaperList, paperDel, paperCopy } from '@/api/game'

import Header from '@/views/common/header-span'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import ExamTypeTree from './components/examTypeTree'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Exam',
  components: { Header, ExamTypeTree, Pagination },
  directives: { elDragDialog },
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
        paper_title: '',
        create_type: ''
      },
      examType: [], // 试卷分类
      // 分页控件数据
      total: 0, // 分页总条数
      pageQuery: {
        page: 1,
        page_size: 10
      },
      ListLoading: false,
      List: [], // 试卷列表集合
      dialogExamCateVisible: false,
      chosePaper: [] // 选中行集合
    }
  },
  computed: {
    title() {
      return '试卷管理'
    }
  },
  mounted() {
    this.getList() // 查询试卷列表
    this.getExamType() // 查询试卷分类
  },
  methods: {
    // 表格check控件
    ChosePaper(val) {
      this.chosePaper = val
    },
    // 高级条件查询
    getList() {
      getPaperList(this.listQuery, this.pageQuery).then(res => {
        this.total = res.data.total
        this.List = res.data.data
      })
    },
    // 管理考试分类
    handleExamType() {
      // 取默认数据
      this.dialogExamCateVisible = true
      setTimeout(() => {
        this.$refs.examType.setsetPaperList()
      })
    },
    // 创建试卷
    toAddExam(id) {
      if (id) {
        this.$router.push('formationExam/' + id)
      } else {
        this.$router.push('formationExam')
      }
    },
    // 弹窗拖拽
    handleExamCateDrag() {
      this.$refs.examCateDiv.blur()
    },
    // 查询试卷分类
    getExamType() {
      setPaperCategoryList().then(res => {
        this.examType = res.data
      })
    },
    // 单项删除/批量删除
    allDel(id) {
      var idSet = [] // 要删除试卷的id数组
      if (id) {
        // 单项删除
        idSet.push(id)
      } else {
        // 批量删除
        var chosePaper = this.chosePaper
        for (var i = 0; i < chosePaper.length; i++) {
          idSet.push(chosePaper[i].id)
        }
      }
      this.$confirm('删除试卷信息确认', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消删除',
        type: 'warning'
      }).then(() => {
        paperDel({ id: idSet }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getList() // 重新获取试卷列表信息
        })
      })
    },
    // 复制试卷
    paperCopyItem(id) {
      paperCopy({ paper_id: id }).then(res => {
        this.getList()
      })
    }
  }
}
</script>

<style>
  .exam-manage .el-table--border th:first-child .cell, .exam-manage .el-table--border td:first-child .cell{
    padding: 0px;
  }
</style>
<style scoped>
  .exam-manage {
    width: 100%;
    height: 100%;
  }
</style>
