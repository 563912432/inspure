<template>
  <div class="apply-table">
    <table class="foulUserTable" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <th>比赛名称</th>
        <td><el-input v-model="applyInfo.title" clearable placeholder="请输入比赛名称" /></td>
      </tr>
      <tr>
        <th>报名时间</th>
        <td>
          <el-date-picker
            v-model="applyInfo.at"
            class="pl-15"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            style="width: 100%;"
            value-format="yyyy-MM-dd HH:mm:ss"
            end-placeholder="结束日期"
            @change="editAt"
          />
        </td>
      </tr>
      <tr>
        <th>关联证书</th>
        <td><el-switch v-model="applyInfo.certificateswitch" :active-value="1" :inactive-value="0" class="ml-15" @change="closeCertifi" /></td>
      </tr>
      <tr>
        <th>证书名称</th>
        <td>
          <el-select
            v-model="applyInfo.cert_id"
            size="small"
            clearable
            :disabled="!applyInfo.certificateswitch"
            style="width: 100%;height: 100%;"
            placeholder="请选择证书"
            @change="setAssociationExam"
          >
            <el-option v-for="(item, i) in certList" :key="i" :label="item.title" :value="item.id" />
          </el-select>
        </td>
      </tr>
      <tr>
        <th>关联考试</th>
        <td>
          <!--match_ids-->
          <div v-for="(item, i) in checkCertList" :key="i" class="associationExam b-b1" style="height: 35px; line-height: 35px;">
            {{ item }}:
            <span>{{ match_titles? match_titles[index]: '' }}</span>
            <el-button class="fr" style="margin: 2px 8px 0 0" size="mini" @click="bindingExam(index)">绑定考试</el-button>
          </div>
        </td>
      </tr>
      <!--<tr>-->
      <!--<th>人数要求</th>-->
      <!--<td>-->
      <!--<el-switch v-model="applyInfo.peoplesumswitch" class="ml-15" />-->
      <!--</td>-->
      <!--</tr>-->
      <!--<tr>-->
      <!--<th>报名人数</th>-->
      <!--<td>-->
      <!--<el-input v-model="applyInfo.peoplesum" :disabled="!applyInfo.peoplesumswitch" clearable placeholder="最大参与人数" />-->
      <!--</td>-->
      <!--</tr>-->
      <tr>
        <th>参与人员</th>
        <td>
          <el-radio v-model="applyInfo.limit" class="ml-15" :label="0" @change="delPeopleorg">全员参与</el-radio>
          <el-radio v-model="applyInfo.limit" :label="1">按机构/人员参与</el-radio>
        </td>
      </tr>
      <tr>
        <th>可报机构</th>
        <td>
          <el-input v-model="peopleorg" class="fl" style="width: 85%;" :readonly="true" :disabled="applyInfo.limit == 0? true: false" placeholder="请点击右侧展开后设置" />
          <el-button class="fr" style="margin: 4px 8px 0 0" size="mini" :disabled="applyInfo.limit == 0? true: false" @click="addApply">展开</el-button>
        </td>
      </tr>
    </table>
    <div class="text-right mt-10">
      <el-button size="mini" type="primary" @click="saveApply">
        保存
      </el-button>
    </div>
    <!--可报机构设置-->
    <div v-if="dialogPeopleOrgVisible">
      <el-dialog
        v-el-drag-dialog
        :visible.sync="dialogPeopleOrgVisible"
        :close-on-click-modal="false"
        :modal="false"
        title="可报机构设置"
        width="600px"
        @dragDialog="addPeopleOrgHandleDrag"
      >
        <div ref="peopleOrgTop">
          <PeopleOrg />
        </div>
      </el-dialog>
    </div>
    <!--绑定考试-->
    <div v-if="dialogExamVisible">
      <el-dialog
        v-el-drag-dialog
        :visible.sync="dialogExamVisible"
        :close-on-click-modal="false"
        :modal="false"
        title="选择要绑定的考试"
        width="800px"
        @dragDialog="bindingExamHandleDrag"
      >
        <div ref="examTop">
          <BindingExam />
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { certList, matchList, signupAdd, signupItem } from '@/api/game'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import PeopleOrg from './peopleOrg'
import BindingExam from './bindingExam'
export default {
  name: 'AddGameApply',
  components: { PeopleOrg, BindingExam },
  directives: { elDragDialog },
  props: {
    // 要筛选的题型
    applyId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      applyInfo: {
        title: '', // 比赛名称
        certificateswitch: 0, // 关联证书开关
        at: [], // 报名时间
        start_at: '', // 开始时间
        end_at: '', // 结束时间
        cert_id: '', // 证书名称
        match_ids: [], // 关联考试科目
        peoplesumswitch: 0, // 人数限制开关
        peoplesum: '', // 最大参与人数
        limit: 0, // 参与人员类型
        rules: {} // 可报机构人数设置
      },
      match_titles: [], // 考试名称集合
      peopleorg: '', // 可报机构人数
      examOptions: [],
      certList: [], // 全部证书
      dialogPeopleOrgVisible: false,
      dialogExamVisible: false,
      checkCertList: [], // 关联考试集合
      index: '' // 给第几条信息绑定考试
    }
  },
  mounted() {
    this.getList() // 查询试卷列表
    this.$root.$on('closeOrg', (orgSum) => {
      this.dialogPeopleOrgVisible = false
      var str = ''
      for (var i in orgSum) {
        this.$set(this.applyInfo.rules, orgSum[i].id, { num: orgSum[i].sum })
        str = str + orgSum[i].org_name + '(' + orgSum[i].sum + ')'
      }
      this.peopleorg = str
    })
    this.$root.$on('checkExam', (currentRow) => {
      this.dialogExamVisible = false
      this.$set(this.match_titles, this.index, currentRow.title)
      this.$set(this.applyInfo.match_ids, this.index, currentRow.id)
    })
  },
  methods: {
    // 查询试卷信息
    getList() {
      // 获取比赛列表
      matchList().then(res => {
        this.examOptions = res.data.data
      })
      if (this.applyId !== 0) {
        // 编辑
        signupItem(this.applyId).then(res => {
          this.applyInfo = res.data
          this.$set(this.applyInfo, ['at'], [res.data.start_at, res.data.end_at]) // 还原起止时间
          this.applyInfo.rules = {}
          // 循环组成机构限制结构
          var str = ''
          var orgs = res.data.org
          for (var i = 0; i < orgs.length; i++) {
            str = str + orgs[i].org_name + '(' + orgs[i].pivot.num + ')'
            this.$set(this.applyInfo.rules, orgs[i].id, { num: orgs[i].pivot.num })
          }
          this.peopleorg = str
          // 判断是否存在证书
          if (res.data.cert_id !== null) {
            this.$set(this.applyInfo, ['certificateswitch'], 1)
            certList().then(ext => {
              this.certList = ext.data.data
              this.setAssociationExam()
              this.applyInfo.match_ids = []
              var matchs = res.data.match
              for (var i = 0; i < matchs.length; i++) {
                this.applyInfo['match_ids'].push(matchs[i].id)
                this.match_titles.push(matchs[i].title)
              }
            })
          }
        })
      }
    },
    // 保存
    saveApply() {
      var data = {}
      data = this.applyInfo
      // 验证绑定考试是否有重复的
      var ary = this.applyInfo.match_ids
      var nary = this.applyInfo.match_ids.sort()
      var repeatTypec = true

      if (this.applyInfo.title !== '' && this.applyInfo.start_at !== '' && this.applyInfo.end_at !== '') {
        if (this.checkCertList.length === this.applyInfo.match_ids.length) {
          for (var i = 0; i < ary.length; i++) {
            if (nary[i] === nary[i + 1]) {
              repeatTypec = false
            }
          }
          if (repeatTypec) {
            if (this.applyId !== 0) {
              data['id'] = this.applyId
            }
            // console.log(data)
            signupAdd(data).then(res => {
              this.$message.success('保存成功')
              this.$root.$emit('saveSuccess')
            })
          } else {
            this.$message.error('绑定的考试不能重复')
          }
        } else {
          this.$message.error('关联考试项不全')
        }
      } else {
        this.$message.error('比赛名称或比赛时间不能为空')
      }
    },
    // 选中证书模板后查询关联考试科目
    setAssociationExam() {
      this.checkCertList = []
      this.index = ''
      if (this.applyInfo.cert_id !== '') {
        // 调取接口获取证书关联开始科目
        for (var i = 0; i < this.certList.length; i++) {
          if (this.certList[i].id === this.applyInfo.cert_id) {
            // 当前选择的证书下包含的科目
            this.checkCertList = this.certList[i].subjects
          }
        }
        this.match_titles = []
        this.applyInfo.match_ids = []
      }
    },
    // 可报机构人数设置
    addApply() {
      this.dialogPeopleOrgVisible = true
    },
    addPeopleOrgHandleDrag() {
      this.$refs.peopleOrgTop.blur()
    },
    bindingExamHandleDrag() {
      this.$refs.examTop.blur()
    },
    // 获取证书列表
    getCertList() {
      certList().then(res => {
        this.certList = res.data.data
      })
    },
    // 时间拆分
    editAt() {
      this.applyInfo.start_at = this.applyInfo.at[0]
      this.applyInfo.end_at = this.applyInfo.at[1]
    },
    // 证书开启关闭事件
    closeCertifi() {
      if (!this.applyInfo.certificateswitch) {
        this.$set(this.applyInfo, ['cert_id'], '')
        this.$set(this.applyInfo, ['match_ids'], [])
      }
      this.checkCertList = []
      this.index = ''
    },
    // 绑定考试
    bindingExam(index) {
      this.index = index
      this.dialogExamVisible = true
    },
    // 清除机构显示的人数
    delPeopleorg() {
      this.peopleorg = ''
      this.applyInfo.rules = {}
    }
  }
}
</script>

<style>
  .apply-table .foulUserTable .el-input__inner,
  .apply-table .foulUserTable .el-textarea__inner{
    border: 0px;
  }
  .apply-table .foulUserTable .el-select>.el-input,
  .apply-table .foulUserTable .el-input--small .el-input__inner{
    height: 100%;
  }
</style>
<style scoped>
  .apply-table .foulUserTable{
    width: 100%;
    border-top: 1px solid #CACACA;
    border-left: 1px solid #CACACA;
  }
  .apply-table .foulUserTable td,
  .apply-table .foulUserTable th {
    height: 35px;
    border-bottom: 1px solid #CACACA;
    border-right: 1px solid #CACACA;
  }
  .apply-table .foulUserTable th {
    padding: 5px;
    width: 80px;
    background-color: #EEEEEE;
    text-align: left;
  }
  .ml-15 {
    margin-left: 15px;
  }
  .pl-15 {
    padding-left: 15px !important;
  }
  .associationExam {
    padding-left: 15px;
    height: 35px;
    line-height: 35px;
  }
  .b-b1:not(:last-child){
    border-bottom: 1px solid #cccccc;
  }
</style>
