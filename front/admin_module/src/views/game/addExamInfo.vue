<template>
  <div class="SetExamInfo bg-white box-shadow">
    <div class="flex p-10">
      <div class="flex-1">
        <el-form ref="paperForm" :model="paperForm" :rules="paperRules" label-width="100px">
          <el-form-item label="考试名称" prop="title">
            <el-input v-model="paperForm.title" clearable class="w-400" size="small" />
          </el-form-item>
          <el-form-item label="考试分类" prop="category_id">
            <el-select v-model="paperForm.category_id" placeholder="请选择" clearable class="w-400" size="small">
              <el-option v-for="(item, index) in examTypeList" :key="index" :label="item.category_title" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="选择试卷" prop="paper_title">
            <div @click="selectExam">
              <el-input v-model="paperForm.paper_title" :readonly="true" clearable class="w-400" size="small" />
            </div>
          </el-form-item>
          <el-form-item label="考试时间" prop="at">
            <el-date-picker
              v-model="paperForm.at"
              size="small"
              clearable
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item label="答卷时长" prop="match_duration">
            <el-input v-model="paperForm.match_duration" placeholder="时长" size="small" class="w-400" clearable>
              <template slot="append">分钟</template>
            </el-input>
          </el-form-item>
          <div class="clear-float" />
          <el-form-item label="考试说明" prop="info">
            <el-input v-model="paperForm.exam_information" type="textarea" placeholder="请输入考试说明" :rows="5" />
          </el-form-item>
          <el-form-item label="更多设置">
            <p style="cursor: pointer;color: #606266;" @click="setStatus = !setStatus">
              {{ setStatus?'收起':'展开' }}<i :class="setStatus?'el-icon-caret-top':'el-icon-caret-bottom'" />
            </p>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!--更多设置-->
    <div v-show="setStatus" class="setContent flex pt-10">
      <!--左-->
      <div class="flex-1" style="margin-right: 10px;border-right: solid 1px #e7e7e7">
        <div class="flex flex-align-center f-15 col-333 bold mb-12"><span class="line-icon" /><span class="ml-10">考试信息</span></div>
        <el-form :model="paperForm" label-width="120px">
          <el-form-item label="考试状态">
            <el-radio-group v-model="paperForm.examStatus" size="small">
              <el-radio-button :label="1">启用考试</el-radio-button>
              <el-radio-button :label="2">禁用考试</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="考前校验密码">
            <span>
              <el-input v-model="paperForm.validate_code" size="small" class="w-190" />
              <p class="f-12 col-999">
                密码可设置为6-8位的非中文字符组合
                <el-tooltip effect="dark" content="设置后，考生需填写正确的考试密码，才能进入考试" placement="top-start">
                  <i class="el-icon-question pointer col-999" />
                </el-tooltip>
              </p>
            </span>
          </el-form-item>
          <el-form-item label="考试迟到限时">
            <span>
              <span class="f-12 col-999">
                <el-input v-model="paperForm.late_min" size="small" class="w-190" />
                <p>
                  考生可迟到分钟数
                  <el-tooltip effect="dark" content="设置后，当考试已开始的时长超过迟到限时后，考生无法进入考试" placement="top-start">
                    <i class="el-icon-question pointer col-999" />
                  </el-tooltip>
                </p>
              </span>
            </span>
          </el-form-item>
          <el-form-item label="防作弊功能" style="margin-bottom: 0" />
          <div class="p-10 bg-fa ml-30">
            <div class="mb-10">
              <el-checkbox v-model="paperForm.switchPaper" :true-label="1" :false-label="0">
                切换页面超过 <el-input v-model="paperForm.switchTime" size="small" class="w-50" /> 次强制交卷
                <el-tooltip effect="dark" content="低版本IE浏览器不支持" placement="top-start"><i class="el-icon-question pointer col-999" /></el-tooltip>
              </el-checkbox>
            </div>
            <div class="mb-10">
              <el-checkbox v-model="paperForm.answerSecondsStatus" :true-label="1" :false-label="0">
                答题时超过 <el-input v-model="paperForm.answerSeconds" size="small" class="w-50" /> 秒没有操作会强制交卷
                <el-tooltip effect="dark" content="没有新操作后会出现10秒倒计时交卷提示，点击屏幕即可取消" placement="top-start"><i class="el-icon-question pointer col-999" /></el-tooltip>
              </el-checkbox>
            </div>
            <div class="mb-10">
              <el-checkbox v-model="paperForm.randomPhoto" size="small" :true-label="1" :false-label="0">
                答题时随机拍照
                <el-tooltip effect="dark" content="随机拍照，照片数量=试题数量/10" placement="top-start">
                  <i class="el-icon-question pointer col-999" />
                </el-tooltip>
              </el-checkbox>
            </div>
            <div>
              <el-checkbox v-model="paperForm.confirmIdentityStatus" size="small" :true-label="1" :false-label="0">
                考前 <el-input v-model="paperForm.confirmIdentity" size="small" class="w-50" /> 分钟开始身份认证
                <el-tooltip effect="dark" content="什么是'考前身份认证'？考生提供身份证号及姓名，系统将会采集考生照片，并通过公安局数据库进行身份比对，比对身份信息与考生本人一致后，即可进入考试。每次比对需要收取一定的费用。去充值" placement="top-start"><i class="el-icon-question pointer col-999" /></el-tooltip>
              </el-checkbox>
            </div>
          </div>
          <el-form-item label="限制考试访问IP" style="margin-bottom: 0">
            <el-switch
              v-model="paperForm.checkIP"
              active-color="#55A625"
              inactive-color="#999999"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
          <div class="p-10 bg-fa ml-30 f-14 col-666">
            IP范围：当前还未设置ip范围 <el-button size="small" plain>编辑</el-button>
          </div>
        </el-form>
        <div class="flex flex-align-center f-15 col-333 bold mb-12"><span class="line-icon" /><span class="ml-10">自定义设置</span></div>
        <el-form :model="paperForm" label-width="120px">
          <el-form-item label="自定义考试背景">
            <el-switch
              v-model="paperForm.examBackground"
              active-color="#55A625"
              inactive-color="#999999"
              :active-value="1"
              :inactive-value="0"
            />
            <el-tooltip effect="dark" content="开启后，可针对每场考试单独设置考试背景" placement="top-start">
              <i class="el-icon-question pointer col-999" />
            </el-tooltip>
            <el-button size="small" plain>内容设置</el-button>
          </el-form-item>
        </el-form>
        <el-form :model="paperForm" label-width="120px">
          <el-form-item label="试题水印">
            <el-switch
              v-model="paperForm.watermark"
              active-color="#55A625"
              inactive-color="#999999"
              :active-value="1"
              :inactive-value="0"
            />
            <el-tooltip effect="dark" content="开启后，考生答题时试题显示水印，水印同样适用于考生查看答案解析与错题本页面，水印内容为“机构名称-考生姓名”" placement="top-start">
              <i class="el-icon-question pointer col-999" />
            </el-tooltip>
            <el-button size="small" plain>水印预览</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--右-->
      <div class="flex-1">
        <div class="flex flex-align-center f-15 col-333 bold mb-12"><span class="line-icon" /><span class="ml-10">分数设置</span></div>
        <div class="p-10 bg-fa ml-30 f-14 col-666 mb-12">
          <span>试题分数对考生可见</span>
          <el-switch
            v-model="paperForm.exam_score_show"
            active-color="#55A625"
            inactive-color="#999999"
            :active-value="1"
            :inactive-value="0"
          />
          <el-tooltip effect="dark" content="关闭后，考生答卷时不显示试题分数，该功能与考后是否显示成绩无关" placement="top-start">
            <i class="el-icon-question pointer col-999" />
          </el-tooltip>
        </div>
        <div class="flex flex-align-center f-15 col-333 bold mb-12"><span class="line-icon" /><span class="ml-10">成绩设置</span></div>
        <div class="p-10 bg-fa ml-30 f-14 col-666 mt-10">
          <el-radio-group v-model="paperForm.show_parse_answer">
            <el-radio size="small" :label="1">显示正确答案和解析</el-radio>
            <el-radio size="small" :label="0">不显示正确答案和解析</el-radio>
          </el-radio-group>
        </div>
        <el-form :model="paperForm" label-width="120px">
          <el-form-item label="显示成绩" style="margin-bottom: 0">
            <el-radio-group v-model="paperForm.show_score_type">
              <el-radio size="small" :label="1">考后显示成绩</el-radio>
              <el-radio size="small" :label="2">批改后显示成绩</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-form :model="paperForm" label-width="120px">
          <el-form-item label="允许查看试卷" style="margin-bottom: 0">
            <el-input v-model="paperForm.exam_review_days" size="mini" class="w-190" />
            <p>
              考试结束后多少天内可查看
              <el-tooltip effect="dark" content="查看历史考试时，支持查看试卷进行回顾考试" placement="top-start">
                <i class="el-icon-question pointer col-999" />
              </el-tooltip>
            </p>
          </el-form-item>
        </el-form>
        <el-form :model="paperForm" label-width="120px">
          <el-form-item label="显示名次">
            <el-switch
              v-model="paperForm.show_rank"
              active-color="#55A625"
              inactive-color="#999999"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
          <el-form-item label="显示排行榜">
            <el-switch
              v-model="paperForm.displayRankList"
              active-color="#55A625"
              inactive-color="#999999"
              :active-value="1"
              :inactive-value="0"
            />
            <el-tooltip effect="dark" content="开启后，考生进入考试前与考试交卷后可查看排行榜，排行榜显示内容为实时排名前十名的考生姓名与成绩。显示成绩开关将会影响排行榜内容的展示" placement="top-start">
              <i class="el-icon-question pointer col-999" />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="显示批改评语">
            <el-switch
              v-model="paperForm.displayComment"
              active-color="#55A625"
              inactive-color="#999999"
              :active-value="1"
              :inactive-value="0"
            />
            <el-tooltip effect="dark" content="教师批改时可录入批改评语，考生在考试结束页将能看到批改评语" placement="top-start">
              <i class="el-icon-question pointer col-999" />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="试题乱序">
            <el-switch
              v-model="paperForm.is_shuffle"
              active-color="#55A625"
              inactive-color="#999999"
              :active-value="1"
              :inactive-value="0"
            />
            <el-tooltip effect="dark" content="开启后试卷内相同题型内的题目顺序将随机组成" placement="top-start">
              <i class="el-icon-question pointer col-999" />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="考试结束语" style="margin-bottom: 0" />
          <div class="p-10 bg-fa ml-30">
            <el-input v-model="paperForm.exam_end_message" type="textarea" placeholder="请输入考试说明" :rows="2" />
          </div>
        </el-form>
      </div>
    </div>
    <div class="text-right mt-10 mb-10 mr-10">
      <el-button size="mini" type="primary" @click="addExamInfo('paperForm')">
        保存
      </el-button>
    </div>
    <!--选择试卷弹窗-->
    <div v-if="dialogSelectExamVisible">
      <el-dialog
        v-el-drag-dialog
        class="exam-type-dialog"
        :modal="false"
        title="选择试卷"
        :visible.sync="dialogSelectExamVisible"
        :close-on-click-modal="false"
        width="800px"
        @dragDialog="handleSelectExamDrag"
      >
        <div ref="exam">
          <SelectExam ref="examInfo" />
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getMatchCategoryList, matchAdd, matchItem } from '@/api/game'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import SelectExam from './components/selectExam'

export default {
  name: 'AddExamInfo',
  components: { SelectExam },
  directives: { elDragDialog },
  props: {
    // 要筛选的题型
    examId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      paperForm: {
        title: '', // 考试名称
        category_id: '', // 考试分类
        paper_id: '', // 绑定的试卷ID
        at: [], // 考试起止时间集合
        start_at: '', // 考试开始时间
        end_at: '', // 考试结束时间
        match_duration: '', // 答卷时长
        exam_information: '', // 考试说明
        validate_code: '', // 考前校验码
        late_min: '', // 可迟到分钟数
        exam_score_show: 1, // 试题分数是否对考生可见
        show_score_type: 1, // 考后显示成绩/批改后显示成绩
        show_rank: 0, // 是否显示名次
        exam_end_message: '', // 考试结束语
        show_parse_answer: 0, // 是否显示答案和解析
        exam_review_days: '', // 考试结束后多少天内可查看试卷
        is_shuffle: 0, // 是否乱序

        examStatus: 0, // 考试状态
        paper_title: '', // 绑定的试卷名称

        switchPaper: 0,
        switchTime: '',
        answerSecondsStatus: 0,
        answerSeconds: '',
        randomPhoto: 0,
        confirmIdentityStatus: 0,
        confirmIdentity: '',
        checkIP: 0,
        examBackground: 0,
        watermark: 0,

        displayPaper: 0,
        displayPaperTime: '',

        displayRankList: 0,
        displayComment: 0
      },
      paperRules: {
        title: [{ required: true, message: '考试名称不能为空', trigger: 'blur' }],
        category_id: [{ required: true, message: '考试分类不能为空', trigger: 'blur' }],
        // paper_title: [{ required: true, message: '绑定的试卷不能为空', trigger: 'blur' }],
        at: [{ required: true, message: '考试时间不能为空', trigger: 'blur' }],
        passscore: [{ required: true, message: '及格分不能为空', trigger: 'blur' }]
      },
      setStatus: false,
      examTypeList: [], // 考试分类
      paperList: [],
      dialogSelectExamVisible: false
    }
  },
  mounted() {
    this.getExamTypeList() // 获取考试分类
    this.getExamInfo() // 获取考试信息
    this.$root.$on('examInfo', (examInfo) => {
      this.$set(this.paperForm, ['paper_id'], examInfo.id)
      this.$set(this.paperForm, ['paper_title'], examInfo.paper_title)
    })
  },
  methods: {
    // 获取考试分类
    getExamTypeList() {
      getMatchCategoryList().then(response => {
        this.examTypeList = response.data.data
      })
    },
    // 获取考试信息
    getExamInfo() {
      if (this.examId !== 0) {
        matchItem(this.examId).then(res => {
          for (var i in res.data) {
            if (i === 'paper') {
              this.$set(this.paperForm, ['paper_title'], res.data[i]['paper_title'])
            } else {
              this.$set(this.paperForm, i, res.data[i])
            }
          }
          // 时间处理
          this.$set(this.paperForm.at, [0], res.data.start_at)
          this.$set(this.paperForm.at, [1], res.data.end_at)
        })
      }
    },
    // 选择试卷
    selectExam() {
      this.dialogSelectExamVisible = true
    },
    // 弹窗拖拽
    handleSelectExamDrag() {
      this.$refs.exam.blur()
    },
    // 新增考试
    addExamInfo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.examId !== 0) {
            this.paperForm['id'] = this.examId
          }
          this.paperForm['start_at'] = this.paperForm.at[0]
          this.paperForm['end_at'] = this.paperForm.at[1]
          matchAdd(this.paperForm).then(res => {
            if (this.examId !== 0) {
              this.$message.success('考试修改成功')
            } else {
              this.$message.success('考试添加成功')
            }
            this.$emit('save')
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style>
  .SetExamInfo .el-textarea__inner{
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  .line-icon{
    width: 5px;
    height: 20px;
    display: inline-block;
    background-color: #93C343;
  }
  .bg-fa {
    background-color: #FAFAFA;
  }
  .SetExamInfo .el-input--small .el-input__inner{
    padding: 0px 5px;
  }
</style>
<style lang="scss" scoped>
  .SetExamInfo {
    height: 520px;
    overflow-x: hidden;
    overflow-y: auto;
    .exam-info-title{
      background-color: #e3e3e3;
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
    }
  }
  .w-50 {
    width: 50px;
  }
  .w-400{
    width: 400px;
  }
  .mr-10 {
    margin-right: 10px;
  }
  .setContent{
    border-bottom: 1px solid #E7E7E7;
  }
</style>
