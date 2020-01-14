<template>
  <div class="foul">
    <div class="filter-container">
      <Header :title="title" class="fl mr-20" />
      <el-input v-model="listQuery.studentname" size="mini" clearable placeholder="请输入学生姓名" class="w-190">
        <el-button slot="append" icon="el-icon-search" @click="getList" />
      </el-input>
      <el-input v-model="listQuery.examname" size="mini" clearable placeholder="请输入考试名称" class="w-190">
        <el-button slot="append" icon="el-icon-search" @click="getList" />
      </el-input>
    </div>
    <div class="mb-12" style="height: 30px;">
      <span class="fl">
        <el-button size="mini" @click="manageFoulType">
          违纪类型设置
        </el-button>
      </span>
      <span class="fr">
        <el-button size="mini" type="primary" @click="addFoulUser">
          增加违纪学生
        </el-button>
        <el-button size="mini" plain @click="allDelIndiscipline">
          批量删除违纪学生
        </el-button>
      </span>
    </div>
    <div class="con-table">
      <el-table
        size="mini"
        :data="foulStudentData"
        border
        style="width: 100%"
        @selection-change="selectionChange"
      >
        <el-table-column type="selection" width="30" />
        <el-table-column prop="truename" label="姓名" width="80" />
        <el-table-column prop="sex" label="性别" width="50">
          <template slot-scope="scope">
            <span v-if="scope.row.sex == 1">男</span>
            <span v-else>女</span>
          </template>
        </el-table-column>
        <el-table-column prop="tel" label="手机号" />
        <el-table-column prop="org_name" label="所属机构" />
        <el-table-column prop="signup_name" label="比赛名称" />
        <el-table-column prop="match_name" label="考试名称" />
        <el-table-column prop="remark" label="违纪原因" />
        <el-table-column prop="date" label="违纪时间" />
        <el-table-column label="操作" width="50" align="center">
          <template slot-scope="{ row }">
            <el-button type="text" size="mini" @click="delIndiscipline(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <pagination :total="total" class="text-center" :page.sync="pageQuery.page" :limit.sync="pageQuery.page_size" @pagination="getList" />
    </div>
    <div class="foul-dialog">
      <el-dialog v-el-drag-dialog :visible.sync="dialogFoulUserVisible" :close-on-click-modal="false" :modal="false" title="证书类型设置" @dragDialog="handleDrag">
        <div ref="top">
          <table class="foulUserTable" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <th>准考证号</th>
              <td>
                <el-input v-model="foulUserInfo.exam_no" clearable placeholder="请输入准考证号" @clear="delUserInfo">
                  <el-button slot="append" icon="el-icon-search" @click="setStudent" />
                </el-input>
              </td>
              <th>姓名</th>
              <td><el-input v-model="userInfo.student.username" :readonly="true" placeholder="考生姓名" /></td>
            </tr>
            <tr>
              <th>性别</th>
              <td><el-input v-model="userInfo.student.sex" :readonly="true" placeholder="考生性别" /></td>
              <th>手机号</th>
              <td><el-input v-model="userInfo.student.tel" :readonly="true" placeholder="手机号" /></td>
            </tr>
            <tr>
              <th>所属机构</th>
              <td><el-input v-model="userInfo.student.org.org_name" :readonly="true" placeholder="所属机构" /></td>
              <th>比赛名称</th>
              <td><el-input v-model="userInfo.student.signup.title" placeholder="请输入比赛名称" /></td>
            </tr>
            <tr>
              <th>考试名称</th>
              <td>
                <el-select v-model="foulUserInfo.match_id" clearable placeholder="请选择考试" style="width: 100%;">
                  <el-option
                    v-for="(item,index) in userInfo.match"
                    :key="index"
                    :label="item"
                    :value="index"
                  />
                </el-select>
              </td>
              <th>违纪时间</th>
              <td>
                <el-date-picker
                  v-model="foulUserInfo.date"
                  type="date"
                  value-format="yyyy-MM-dd"
                  clearable
                  placeholder="选择日期时间"
                />
              </td>
            </tr>
            <tr>
              <th>违纪类型</th>
              <td>
                <el-select v-model="foulUserInfo.category_id" clearable placeholder="请选择考试" style="width: 100%;">
                  <el-option
                    v-for="(item,index) in proveTypeList"
                    :key="index"
                    :label="item.category_title"
                    :value="item.id"
                  />
                </el-select>
              </td>
              <th />
              <td />
            </tr>
            <tr>
              <th>违纪原因</th>
              <td colspan="3">
                <el-input
                  v-model="foulUserInfo.remark"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入违纪原因"
                />
              </td>
            </tr>
          </table>
        </div>
        <div class="text-right mt-10">
          <el-button size="mini" type="primary" @click="saveFoul">
            保存
          </el-button>
        </div>
      </el-dialog>
    </div>
    <!--管理违纪类型-->
    <div v-if="dialogFoulTypeVisible">
      <el-dialog
        v-el-drag-dialog
        class="exam-type-dialog"
        :modal="false"
        title="违纪类型设置"
        :visible.sync="dialogFoulTypeVisible"
        :close-on-click-modal="false"
        width="500px"
        @dragDialog="handleFoulTypeDrag"
      >
        <div ref="foultop">
          <FoulType ref="foulType" />
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { indisciplineList, getUserByExamNo, indisciplineCategoryList, indisciplineAdd, indisciplineDel } from '@/api/game'
import Header from '@/views/common/header-span'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import FoulType from './components/foulType'
export default {
  name: 'Foul',
  components: { Header, Pagination, FoulType },
  directives: { elDragDialog },
  data() {
    return {
      listQuery: {
        studentname: '', // 学生姓名
        examname: '' // 考试名称
      },
      foulStudentData: [],
      dialogFoulUserVisible: false,
      // 违纪考生信息
      foulUserInfo: {
        exam_no: '', // 准考证号
        match_id: '', // 考试id
        date: '', // 违纪时间
        category_id: '', // 违纪类型
        remark: '' // 违纪原因
      },
      userInfo: {
        match: {},
        student: {
          username: '',
          tel: '',
          sex: '',
          org: {},
          signup: {}
        }
      }, // 准考证相关信息
      // 分页控件
      total: 400, // 总条数
      pageQuery: {
        page: 1,
        page_size: 10
      },
      dialogFoulTypeVisible: false,
      proveTypeList: [], // 违纪类型
      checks: [] // 已选择的违纪信息
    }
  },
  computed: {
    title() {
      return '考试违纪管理'
    }
  },
  mounted() {
    this.getList()
    this.setsetPaperList() // 获取违纪类型
  },
  methods: {
    // 高级条件查询
    getList() {
      indisciplineList(this.listQuery, this.pageQuery).then(res => {
        console.log(res.data.data)
        this.foulStudentData = res.data.data
        this.total = res.data.total
      })
    },
    // 新增违纪学生
    addFoulUser() {
      this.dialogFoulUserVisible = true
    },
    // 弹窗拖拽
    handleDrag() {
      this.$refs.top.blur()
    },
    // 违纪类型设置
    manageFoulType() {
      this.dialogFoulTypeVisible = true
    },
    // 弹窗拖拽
    handleFoulTypeDrag() {
      this.$refs.foultop.blur()
    },
    // 根据准考证号查询考生信息
    setStudent() {
      getUserByExamNo({ exam_no: this.foulUserInfo.exam_no }).then(res => {
        this.userInfo = res.data
        if (this.userInfo.student.sex === 1) {
          this.userInfo.student.sex = '男'
        } else {
          this.userInfo.student.sex = '女'
        }
      })
    },
    // 保存违纪信息
    saveFoul() {
      if (this.foulUserInfo.exam_no !== '') {
        if (this.foulUserInfo.match_id !== '') {
          if (this.foulUserInfo.date !== '') {
            if (this.foulUserInfo.category_id !== '') {
              if (this.userInfo.student.sex === '男') {
                this.userInfo.student.sex = 1
              } else {
                this.userInfo.student.sex = 0
              }
              this.foulUserInfo['truename'] = this.userInfo.student.username
              this.foulUserInfo['sex'] = this.userInfo.student.sex
              this.foulUserInfo['tel'] = this.userInfo.student.tel
              this.foulUserInfo['org_name'] = this.userInfo.student.org.org_name
              this.foulUserInfo['signup_name'] = this.userInfo.student.signup.title
              this.foulUserInfo['match_name'] = this.userInfo.match[this.foulUserInfo.match_id]
              this.foulUserInfo['signup_id'] = this.userInfo.student.signup.id
              indisciplineAdd(this.foulUserInfo).then(res => {
                this.$message.success('新增成功')
                Object.assign(this.$data, this.$options.data())
                this.getList()
              })
            } else {
              this.$message.error('违纪类型不能为空')
            }
          } else {
            this.$message.error('违纪时间不能为空')
          }
        } else {
          this.$message.error('考试不能为空')
        }
      } else {
        this.$message.error('准考证号不能为空')
      }
    },
    // 获取违纪类型列表
    setsetPaperList() {
      indisciplineCategoryList().then(res => {
        this.proveTypeList = res.data.data
      })
    },
    // 清除以查询到的学生信息
    delUserInfo() {
      Object.assign(this.$data.userInfo, this.$options.data().userInfo)
      Object.assign(this.$data.foulUserInfo, this.$options.data().foulUserInfo)
    },
    // 删除违纪信息
    delIndiscipline(id) {
      this.$confirm('删除违纪信息确认', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消删除',
        type: 'warning'
      }).then(() => {
        indisciplineDel({ id: id }).then(res => {
          this.$message.success('删除成功')
          this.getList()
        })
      }).catch(() => {})
    },
    // 批量删除违纪信息
    allDelIndiscipline() {
      this.$confirm('批量删除违纪信息确认', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消删除',
        type: 'warning'
      }).then(() => {
        indisciplineDel({ id: this.checks }).then(res => {
          this.$message.success('删除成功')
          this.getList()
        })
      }).catch(() => {})
    },
    // 勾选事件
    selectionChange(val) {
      this.checks = []
      for (var i in val) {
        this.checks.push(val[i].id)
      }
    }
  }
}
</script>

<style>
  .foul .el-table--border th:first-child .cell,
  .foul .el-table--border td:first-child .cell {
    padding: 0px;
  }
  .foul .con-table .el-table__row td{
    text-align: center;
  }
  .foul .foul-dialog .el-dialog__body{
    padding: 7px;
  }
  .foul .foul-dialog .foulUserTable .el-select>.el-input,
  .foul .foul-dialog .el-input--small .el-input__inner{
    height: 100%;
  }
  .foul .foul-dialog .el-input__inner,
  .foul .foul-dialog .el-textarea__inner{
    border: 0px;
  }
  .foul .foul-dialog .foulUserTable .el-input-group__append{
    background-color: #ffffff;
    border: 0px;
  }
</style>
<style scoped>
  .foul{
    width: 100%;
    height: 100%;
  }
  .foul .foul-dialog .foulUserTable{
    width: 100%;
    border-top: 1px solid #CACACA;
    border-left: 1px solid #CACACA;
  }
  .foul .foul-dialog .foulUserTable td,
  .foul .foul-dialog .foulUserTable th {
    height: 30px;
    border-bottom: 1px solid #CACACA;
    border-right: 1px solid #CACACA;
  }
  .foul .foul-dialog .foulUserTable th {
    padding: 5px;
    width: 80px;
    background-color: #EEEEEE;
    text-align: left;
  }
</style>
