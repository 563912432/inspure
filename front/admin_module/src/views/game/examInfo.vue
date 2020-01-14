<template>
  <div class="exam-info">
    <div class="filter-container">
      <Header :title="title" class="fl mr-20" />
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
    <div class="mb-12" style="height: 30px;">
      <span class="fl">
        <el-checkbox v-model="listQuery.enable" size="mini" :true-label="1" :false-label="0" @change="getList">仅显示发布的考试</el-checkbox>
      </span>
      <span class="fr">
        <el-button size="mini" plain @click="toAddExam()">
          创建考试
        </el-button>
        <el-button size="mini" plain @click="releaseExam">
          发布考试
        </el-button>
        <el-button size="mini" @click="handleExamType">
          管理考试分类
        </el-button>
        <el-button size="mini" plain>
          导出
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
        <el-table-column label="考试名称" width="" prop="title" align="center" />
        <el-table-column label="分类" width="" prop="category_id" align="center">
          <template slot-scope="{ row }">
            {{ row.category? row.category.category_title: '' }}
          </template>
        </el-table-column>
        <el-table-column label="总分" width="80" prop="validate_code" align="center">
          <template slot-scope="{ row }">
            {{ row.paper.full_score }}
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
        <el-table-column label="操作" width="320" align="center">
          <template slot-scope="{ row }">
            <el-button type="text" size="mini" @click="toAddExam(row.id)">编辑</el-button>
            <el-button type="text" size="mini" @click="examLink(row)">考试链接</el-button>
            <el-button type="text" size="mini" @click="correction(row.id)">成绩查询批改</el-button>
            <el-button type="text" size="mini" @click="allDel(row.id)">删除</el-button>
            <el-button type="text" size="mini" @click="paperCopyItem(row.id)">复制考试</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <Pagination :total="total" class="text-center" :page-sizes="[10, 20, 35, 50]" :page.sync="pageQuery.page" :limit.sync="pageQuery.page_size" @pagination="getList" />
    </div>
    <!--管理考试分类-->
    <div v-if="dialogExamCateVisible">
      <el-dialog
        v-el-drag-dialog
        class="exam-type-dialog"
        :modal="false"
        title="管理考试分类"
        :visible.sync="dialogExamCateVisible"
        :close-on-click-modal="false"
        width="500px"
        @dragDialog="handleExamCateDrag"
      >
        <div ref="examCateDiv">
          <ExamInfoTypeTree ref="examType" />
        </div>
      </el-dialog>
    </div>
    <!--新增考试-->
    <div v-if="dialogAddExamInfoVisible">
      <el-dialog
        v-el-drag-dialog
        class="exam-type-dialog"
        :modal="false"
        title="创建考试"
        :visible.sync="dialogAddExamInfoVisible"
        :close-on-click-modal="false"
        width="1100px"
        @dragDialog="handleAddExamInfoDrag"
      >
        <div ref="addExamInfo">
          <ExamForm ref="examInfo" :exam-id="examId" @save="closeAddExam" />
        </div>
      </el-dialog>
    </div>
    <!--报名链接弹窗-->
    <div v-if="dialogLinkVisible">
      <el-dialog
        v-el-drag-dialog
        :visible.sync="dialogLinkVisible"
        :close-on-click-modal="false"
        :modal="false"
        title="考试链接"
        width="600px"
        @dragDialog="gameLinkDrag"
      >
        <div ref="linktop">
          <ExamLink ref="linkname" />
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getMatchCategoryList, matchList, matchDel, matchCopy, matchPublish } from '@/api/game'
import Header from '@/views/common/header-span'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import ExamInfoTypeTree from './components/examInfoTypeTree'
import ExamForm from './addExamInfo'
import ExamLink from './components/examLink'

export default {
  name: 'ExamInfo',
  components: { Header, Pagination, ExamInfoTypeTree, ExamForm, ExamLink },
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
      chosePaper: [], // 选中行集合
      examInfoType: [], // 考试分类集合
      ListLoading: false,
      searchState: false,
      dialogExamCateVisible: false,
      dialogAddExamInfoVisible: false,
      examId: 0, // 选中的考试id
      dialogLinkVisible: false
    }
  },
  computed: {
    title() {
      return '考试信息管理'
    }
  },
  mounted() {
    this.getList() // 查询试卷列表
    this.getExamInfoType() // 查询试卷分类
  },
  methods: {
    // 表格check控件
    ChosePaper(val) {
      this.chosePaper = val
    },
    // 高级条件查询
    getList() {
      matchList(this.listQuery, this.pageQuery).then(res => {
        this.total = res.data.total
        this.List = res.data.data
      })
    },
    // 管理考试分类
    handleExamType() {
      // 取默认数据
      this.dialogExamCateVisible = true
    },
    // 新建考试
    toAddExam(id) {
      if (id) {
        this.examId = id
        this.dialogAddExamInfoVisible = true
      } else {
        this.examId = 0
        this.dialogAddExamInfoVisible = true
      }
    },
    // 弹窗拖拽
    handleExamCateDrag() {
      this.$refs.examCateDiv.blur()
    },
    gameLinkDrag() {
      this.$refs.linktop.blur()
    },
    handleAddExamInfoDrag() {
      this.$refs.addExamInfo.blur()
    },
    // 查询考试分类
    getExamInfoType() {
      getMatchCategoryList().then(res => {
        this.examInfoType = res.data.data
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
        matchDel({ id: idSet }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getList() // 重新获取试卷列表信息
        })
      }).catch(() => {})
    },
    // 复制试卷
    paperCopyItem(id) {
      matchCopy({ id: id }).then(res => {
        this.getList()
      })
    },
    // 关闭考试新增弹窗
    closeAddExam() {
      this.dialogAddExamInfoVisible = false
      this.getList()
    },
    // 考试链接查询
    examLink(row) {
      this.dialogLinkVisible = true
      setTimeout(() => {
        this.$refs.linkname.enamName = row.title // 这句很重要
        this.$refs.linkname.examId = row.id // 这句很重要
      })
    },
    // 成绩查询批改
    correction(id) {
      // this.$router.push('correction/' + id)
      this.$router.push('correction')
    },
    // 考试发布
    releaseExam() {
      if (this.chosePaper.length !== 0) {
        var data = []
        for (var i = 0; i < this.chosePaper.length; i++) {
          data.push(this.chosePaper[i].id)
        }
        matchPublish({ id: data }).then(res => {
          this.$message.success('发布成功')
          this.getList()
        })
      } else {
        this.$message.error('请先勾选要发布的考试')
      }
    }
  }
}
</script>

<style>
  .exam-info .el-dialog__body {
    padding: 0 !important;
  }
</style>
<style scoped>
  .w-half {
    width: 50%;
  }
</style>
