<template>
  <div class="plan-stu">
    <div class="filter-container">
      <div class="search-more fl mr-20" @click="searchState = !searchState">
        <span>高级搜索</span>
        <i :class="searchState?'el-icon-arrow-up':'el-icon-arrow-down'" />
      </div>
      <el-collapse-transition>
        <div v-show="searchState" class="search-more-content">
          <div class="mb-20 fl w-half">
            <span class="w-80 inline-block text-right">姓名：</span>
            <el-input v-model="listQuery.name" size="small" clearable placeholder="请输入考生名称" class="w-190" />
          </div>
          <div class="mb-20 fr w-half text-right">
            <span class="w-80 inline-block text-right">性别：</span>
            <el-select v-model="listQuery.sex" size="small" clearable placeholder="请选择考生性别">
              <el-option label="男" value="0" />
              <el-option label="女" value="1" />
            </el-select>
          </div>
          <div class="mb-20 fl w-half">
            <span class="w-80 inline-block text-right">所属机构：</span>
            <el-select v-model="listQuery.org" size="small" class="w-190" clearable placeholder="请选择考试分类">
              <el-option v-for="(item,index) in orgList" :key="index" :label="item.org_name" :value="item.id" />
            </el-select>
          </div>
          <div class="mb-20 fl" style="width: 100%;">
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
          <div class="text-right fr">
            <el-button size="mini" type="primary">
              查询
            </el-button>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="con-table">
      <el-table
        size="mini"
        :data="stuList.slice((pageQuery.page - 1) * pageQuery.page_size, pageQuery.page * pageQuery.page_size)"
        border
        style="width: 100%"
        @selection-change="tableSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="username" label="姓名" width="" />
        <el-table-column label="性别" width="40">
          <template slot-scope="{ row }">
            {{ row.student.sex === 1? '男': '女' }}
          </template>
        </el-table-column>
        <el-table-column label="手机号">
          <template slot-scope="{ row }">
            {{ row.student.tel }}
          </template>
        </el-table-column>
        <el-table-column prop="num" label="所属机构" width="">
          <template slot-scope="{ row }">
            <span v-for="(item,index) in orgList" :key="index">
              <span v-if="item.id == row.org_id">{{ item.org_name }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="invigilation" label="报名时间" width="">
          <template slot-scope="{ row }">
            {{ row.created_at | formatDate }}
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <pagination :total="total" class="text-center" :page.sync="pageQuery.page" :limit.sync="pageQuery.page_size" />
    </div>
    <div class="text-right fr">
      <el-button size="mini" type="primary" @click="saveCheck">
        确定
      </el-button>
    </div>
  </div>
</template>

<script>
import { getSignupStudents, orgList } from '@/api/game'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'PlanStu',
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
  props: {
    // 教室 ID
    roomId: {
      type: String,
      required: true,
      defaults: ''
    },
    // 报名 ID
    appid: {
      type: Number,
      required: true
    },
    // 待分配的学生集合
    planItem: {
      type: Object,
      required: true,
      defaults: {}
    }
  },
  data() {
    return {
      searchState: false,
      listQuery: {
        name: '',
        sex: '',
        org: '',
        at: []
      },
      stuList: [],
      orgList: [], // 机构集合
      // 分页控件数据
      total: 0, // 分页总条数
      pageQuery: {
        page: 1,
        page_size: 10
      },
      checks: [] // 已勾选学生
    }
  },
  mounted() {
    this.getList()
    this.getOrgList()
  },
  methods: {
    getOrgList() {
      orgList().then(res => {
        this.orgList = res.data.data
      })
    },
    getList() {
      setTimeout(() => {
        var data = [] // 所有待安排考生的id
        var arranged = this.planItem.arranged
        var un_arrange = this.planItem.un_arrange
        // 已安排不为空  未安排为空
        if (Object.keys(arranged).length !== 0 && Object.keys(un_arrange).length !== 0) {
          // 随机安排之后的
          data = this.planItem.un_arrange
          getSignupStudents({ id: data }, this.appid).then(res => {
            this.stuList = res.data
            this.total = this.stuList.length
          })
        } else if (Object.keys(arranged).length !== 0 && Object.keys(un_arrange).length === 0) {
          // 1、全部安排完
          // 2、编辑进来后有剩余未安排的人员
          // 上次安排人员未全部安排
          getSignupStudents({ id: data }, this.appid).then(res => {
            // 全部考生信息
            for (var i in res.data) {
              // 已选考生信息
              for (var k in arranged) {
                // 教室层
                for (var s in arranged[k]) {
                  // 排除已安排的考生
                  if (res.data[i].stu_id === arranged[k][s].stu_id) {
                    res.data.splice(i, 1)
                  }
                }
              }
            }
            this.stuList = res.data
            this.total = res.data.length
          })
        } else {
          getSignupStudents({ id: data }, this.appid).then(res => {
            this.stuList = res.data
            this.total = this.stuList.length
          })
        }
      })
    },
    tableSelectionChange(val) {
      this.checks = val
    },
    // 保存已选择的学生
    saveCheck() {
      var data = {
        students: [], // 学生对象
        check_ids: [], // 学生id
        no_check_ids: [], // 剩余没安排学生的id集合
        roomId: this.roomId // 当前教室ID
      }
      for (var i = 0; i < this.checks.length; i++) {
        data.students.push({ 'stu_id': this.checks[i].stu_id, 'username': this.checks[i].username })
        data.check_ids.push(this.checks[i].stu_id)
      }
      // 查找剩余未安排的学生
      for (var k in this.stuList) {
        if (data.check_ids.indexOf(this.stuList[k].stu_id) < 0) {
          data.no_check_ids.push(this.stuList[k].stu_id)
        }
      }
      this.$root.$emit('saveStuCheck', data)
    }
  }
}
</script>

<style scoped>
  .plan-stu{
    min-height: 300px;
  }
  .w-half{
    width: 50%;
  }
</style>
