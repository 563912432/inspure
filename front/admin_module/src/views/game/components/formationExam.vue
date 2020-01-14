<template>
  <div class="PaperChoseTimu">
    <!--试卷基本信息设置部分-->
    <div v-if="examShow === 1" style="width: 100%; min-height: 800px; display: flex;">
      <div class="createExam">
        <div class="con">
          <p class="mb-10">选择组卷方式</p>
          <div class="examform">
            <el-form ref="form" label-width="120px">
              <el-form-item label="试卷名称">
                <el-input v-model="title" size="small" clearable class="w-190" />
              </el-form-item>
              <el-form-item label="试卷分类">
                <el-select v-model="type" size="small" clearable class="w-190" placeholder="请选择试卷分类">
                  <el-option v-for="(item,index) in listProveType" :key="index" :label="item.category_title" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="组卷方式">
                <el-radio v-model="groupmode" label="2">选题组卷</el-radio>
                <el-radio v-model="groupmode" label="1">抽题组卷</el-radio>
              </el-form-item>
              <el-form-item label="时长/分值">
                <el-radio v-model="topicSetting" label="1">题型设置</el-radio>
                <el-radio v-model="topicSetting" label="2">单题设置</el-radio>
              </el-form-item>
              <el-form-item label="限制每题时长">
                <el-radio v-model="limit" label="0">不限制</el-radio>
                <el-radio v-model="limit" label="1">限制</el-radio>
              </el-form-item>
              <el-form-item>
                <el-button size="small" @click="toExam">取消</el-button>
                <el-button type="primary" size="small" @click="onSubmit">确认</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <!--组卷部分-->
    <div v-else-if="examShow === 2" class="flex f-13 col-333">
      <!--左侧题型区-->
      <div class="w-250 left-panel">
        <div class="mb-12 ml-10">
          <el-button icon="el-icon-view" size="small" plain @click="toPreview">预览</el-button>
          <el-button size="small" icon="el-icon-edit-outline" class="fr" plain @click="saveExam">保存</el-button>
        </div>
        <div class="mb-12 ml-10">总题数： <span class="text-blue">{{ topicSum }}</span> 题</div>
        <div class="mb-12 ml-10">总分： <span class="text-blue">{{ topicScore }}</span> 分</div>
        <div v-for="(item,index) in question" :key="index" class="card p-10" :class="(index+1) == questionShow? 'blue': ''" @click="questionType(item.key)">
          <div class="bold mb-12">{{ item.value }}</div>
          <div v-if="item.key == 2" class="mb-10">
            <el-checkbox v-model="missing" :true-label="1" :false-label="0">漏选给分</el-checkbox>
          </div>
          <div class="mb-12">
            <div v-if="item.key != 7">
              共 <span v-if="topic[item.key]">{{ ( Object.keys(topic[item.key])).length }}</span> <span v-else>0</span> 题，
              共 <span v-if="topic[item.key]">{{ item.totalScore }}</span> <span v-else>0</span> 分
            </div>
            <div v-else>
              共 <span v-if="topic[item.key]">1</span> <span v-else>0</span> 题，
              共 <span v-if="topic[item.key]">{{ item.totalScore }}</span> <span v-else>0</span> 分
            </div>
          </div>
          <div v-if="topicSetting === '1'" class="mb-12">每题答题时长 <el-input v-model="item.time" clearable size="mini" class="w-80" @input="editPicItem('time', item.time)" /> 分</div>
          <div v-if="topicSetting === '1'" class="mb-12">每题分数 <el-input v-model="item.score" clearable size="mini" class="w-80" @input="editPicItem('score', item.score)" /> 分</div>
        </div>
      </div>
      <!--右侧题目区-->
      <div class="flex-1 right-panel">
        <div>
          <span v-for="(item,index) in question" :key="index">
            <div v-show="question[index]" v-if="item.key == questionShow" class="card-content">
              <!--单选题-->
              <div v-if="questionShow == '1'">
                <div class="card-content-title pl-10">单选题 <el-button size="small" plain class="ml-20 fr" @click="addTopic(item.key)">添加试题</el-button></div>
                <div v-for="(arr,i) in topic[questionShow]" :key="i">
                  <div class="card-content-content p-20">
                    <!--题目部分-->
                    <div class="f-15 bold mb-20">
                      <span class="fl">{{ i+1 }}. </span>
                      <span v-html="arr.title" />
                      <!--功能区按钮-->
                      <div class="text-right">
                        <el-button size="mini" class="mr-20" icon="el-icon-delete" @click="delTopic(arr.id)" />
                        <p v-if="topicSetting === '2'" class="mt-10">
                          <span>时长 <el-input v-model="topicId[item.key][arr.id]['time']" size="mini" style="width: 80px;" @input="steTotal" /> 分</span>
                          <span>分数 <el-input v-model="topicId[item.key][arr.id]['score']" size="mini" style="width: 80px;" @input="steTotal" /> 分</span>
                        </p>
                      </div>
                    </div>
                    <!--题干部分-->
                    <div v-for="(res,k) in arr.ext.options" :key="k" class="mb-15 h-20 lh-20">
                      <div class="fl">
                        <span
                          class="circle fl"
                          :class="(arr.ext.answer).indexOf(k==0? 'A': k==1? 'B': k==2? 'C': k==3? 'D':'') > -1? 'text-white bg-blue border-blue': ''"
                        >{{ k==0? 'A': k==1? 'B': k==2? 'C': k==3? 'D':'' }}
                        </span>
                      </div>
                      <div class="fl h-20 lh-20 ml-10 opyions-style" v-html="res" />
                    </div>
                    <div class="mb-15">答案：<span v-for="(ans,k) in arr.ext.answer" :key="k">{{ ans }}</span></div>
                    <div class="mb-15">解析：<div class="mt-5" v-html="arr.ext.parse" /></div>
                  </div>
                </div>
              </div>
              <!--多选题-->
              <div v-if="questionShow == '2'">
                <div>
                  <div class="card-content-title pl-10">多选题 <el-button size="small" plain class="ml-20 fr" @click="addTopic(item.key)">添加试题</el-button></div>
                  <div v-for="(arr,i) in topic[questionShow]" :key="i">
                    <div class="card-content-content p-20">
                      <!--题目部分-->
                      <div class="f-15 bold mb-20">
                        <span class="fl">{{ i+1 }}. </span>
                        <span v-html="arr.title" />
                        <!--功能区按钮-->
                        <div class="text-right">
                          <el-button size="mini" class="mr-20" icon="el-icon-delete" @click="delTopic(arr.id)" />
                          <p v-if="topicSetting === '2'" class="mt-10">
                            <span>时长 <el-input v-model="topicId[item.key][arr.id]['time']" size="mini" style="width: 80px;" /> 分</span>
                            <span>分数 <el-input v-model="topicId[item.key][arr.id]['score']" size="mini" style="width: 80px;" /> 分</span>
                          </p>
                        </div>
                      </div>
                      <div v-for="(res,k) in arr.ext.options" :key="k" class="mb-15 h-20 lh-20">
                        <div class="fl">
                          <span
                            class="circle fl"
                            :class="(arr.ext.answer).indexOf(k==0? 'A': k==1? 'B': k==2? 'C': k==3? 'D':'') > -1? 'text-white bg-blue border-blue': ''"
                          >{{ k==0? 'A': k==1? 'B': k==2? 'C': k==3? 'D':'' }}
                          </span>
                        </div>
                        <div class="fl h-20 lh-20 ml-10 opyions-style" v-html="res" />
                      </div>
                      <div class="mb-15">答案：<span v-for="(ans,k) in arr.ext.answer" :key="k">{{ ans }}</span></div>
                      <div class="mb-15">解析：<div class="mt-5" v-html="arr.ext.parse" /></div>
                    </div>
                  </div>
                </div>
              </div>
              <!--判断题-->
              <div v-if="questionShow == '3'">
                <div class="card-content-title pl-10">判断题 <el-button size="small" plain class="ml-20 fr" @click="addTopic(item.key)">添加试题</el-button></div>
                <div v-for="(arr,i) in topic[questionShow]" :key="i">
                  <div class="card-content-content p-20">
                    <!--题目部分-->
                    <div class="f-15 bold mb-20">
                      <span class="fl">{{ i+1 }}. </span>
                      <span v-html="arr.title" />
                      <!--功能区按钮-->
                      <div class="text-right">
                        <el-button size="mini" class="mr-20" icon="el-icon-delete" @click="delTopic(arr.id)" />
                        <p v-if="topicSetting === '2'" class="mt-10">
                          <span>时长 <el-input v-model="topicId[item.key][arr.id]['time']" size="mini" style="width: 80px;" /> 分</span>
                          <span>分数 <el-input v-model="topicId[item.key][arr.id]['score']" size="mini" style="width: 80px;" /> 分</span>
                        </p>
                      </div>
                    </div>
                    <!--题干部分-->
                    <div class="mb-15 h-20 lh-20">
                      <div>
                        <span class="circle" :class="arr.ext.answer[0] == 'A'? 'text-white bg-blue border-blue': ''">√</span>
                      </div>
                    </div>
                    <div class="mb-15 h-20 lh-20">
                      <div>
                        <span class="circle" :class="arr.ext.answer[0] == 'B'? 'text-white bg-blue border-blue': ''">×</span>
                      </div>
                    </div>
                    <div class="mb-15">答案：<span v-for="(ans,k) in arr.ext.answer" :key="k">{{ ans }}</span></div>
                    <div class="mb-15">解析：<div class="mt-5" v-html="arr.ext.parse" /></div>
                  </div>
                </div>
              </div>
              <!--填空题-->
              <div v-if="questionShow == '4'">
                <div class="card-content-title pl-10">填空题 <el-button size="small" plain class="ml-20 fr" @click="addTopic(item.key)">添加试题</el-button></div>
                <div v-for="(arr,i) in topic[questionShow]" :key="i">
                  <div class="card-content-content p-20">
                    <!--题目部分-->
                    <div class="f-15 bold mb-20">
                      <span class="fl">{{ i+1 }}. </span>
                      <span v-html="arr.title" />
                      <!--功能区按钮-->
                      <div class="text-right">
                        <el-button size="mini" class="mr-20" icon="el-icon-delete" @click="delTopic(arr.id)" />
                        <p v-if="topicSetting === '2'" class="mt-10">
                          <span>时长 <el-input v-model="topicId[item.key][arr.id]['time']" size="mini" style="width: 80px;" /> 分</span>
                          <span>分数 <el-input v-model="topicId[item.key][arr.id]['score']" size="mini" style="width: 80px;" /> 分</span>
                        </p>
                      </div>
                    </div>
                    <!--题干部分-->
                    <div class="mb-15">答案：<span v-for="(ans,k) in arr.ext.answer" :key="k" class="mt-5" v-html="ans" /></div>
                    <div class="mb-15">解析：<div class="mt-5" v-html="arr.ext.parse" /></div>
                  </div>
                </div>
              </div>
              <!--简答题-->
              <div v-if="questionShow == '5'">
                <div class="card-content-title pl-10">简答题 <el-button size="small" plain class="ml-20 fr" @click="addTopic(item.key)">添加试题</el-button></div>
                <div v-for="(arr,i) in topic[questionShow]" :key="i">
                  <div class="card-content-content p-20">
                    <!--题目部分-->
                    <div class="f-15 bold mb-20">
                      <span class="fl">{{ i+1 }}. </span>
                      <span v-html="arr.title" />
                      <!--功能区按钮-->
                      <div class="text-right">
                        <el-button size="mini" class="mr-20" icon="el-icon-delete" @click="delTopic(arr.id)" />
                        <p v-if="topicSetting === '2'" class="mt-10">
                          <span>时长 <el-input v-model="topicId[item.key][arr.id]['time']" size="mini" style="width: 80px;" /> 分</span>
                          <span>分数 <el-input v-model="topicId[item.key][arr.id]['score']" size="mini" style="width: 80px;" /> 分</span>
                        </p>
                      </div>
                    </div>
                    <!--题干部分-->
                    <div class="mb-15">答案：<span v-for="(ans,k) in arr.ext.answer" :key="k" class="mt-5" v-html="ans" /></div>
                    <div class="mb-15">解析：<div class="mt-5" v-html="arr.ext.parse" /></div>
                  </div>
                </div>
              </div>
              <!--组合题-->
              <div v-if="questionShow == '6'">
                <div class="card-content-title pl-10">组合题 <el-button size="small" plain class="ml-20 fr" @click="addTopic(item.key)">添加试题</el-button></div>
                <div v-for="(arr,i) in topic[questionShow]" :key="i">
                  <div class="card-content-content p-20">
                    <!--题目部分-->
                    <div class="f-15 bold mb-20">
                      <span class="fl">{{ i+1 }}. </span>
                      <span v-html="arr.title" />
                      <!--功能区按钮-->
                      <div class="text-right">
                        <el-button size="mini" class="mr-20" icon="el-icon-delete" @click="delTopic(arr.id)" />
                      </div>
                    </div>
                    <!--题干部分-->
                    <div v-for="(smalltopic,k) in arr.children" :key="k" style="padding: 15px;background-color: #F5F8FB;">
                      <!--{{smalltopic}}-->
                      <!--题目部分-->
                      <div class="f-15 bold mb-20">
                        <span class="fl">({{ k+1 }}) </span>
                        <div>
                          <span v-html="smalltopic.title" />
                        </div>
                        <p v-if="topicSetting === '2'" class="mt-10 text-right">
                          <span>时长 <el-input v-model="topicId[item.key][arr.id][smalltopic.id]['time']" size="mini" style="width: 80px;" @input="steTotal" /> 分</span>
                          <span>分数 <el-input v-model="topicId[item.key][arr.id][smalltopic.id]['score']" size="mini" style="width: 80px;" @input="steTotal" /> 分</span>
                        </p>
                      </div>
                      <!--组合题内题型 - 单选-->
                      <div v-if="smalltopic.type == 1">
                        <div v-for="(res,k) in smalltopic.ext.options" :key="k" class="mb-15 h-20 lh-20">
                          <div class="fl">
                            <span
                              class="circle fl"
                              :class="(smalltopic.ext.answer).indexOf(k==0? 'A': k==1? 'B': k==2? 'C': k==3? 'D':'') > -1? 'text-white bg-blue border-blue': ''"
                            >{{ k==0? 'A': k==1? 'B': k==2? 'C': k==3? 'D':'' }}
                            </span>
                          </div>
                          <div class="fl h-20 lh-20 ml-10 opyions-style" v-html="res" />
                        </div>
                        <div class="mb-15">答案：<span v-for="(ans,k) in smalltopic.ext.answer" :key="k">{{ ans }}</span></div>
                        <div class="mb-15">解析：<div class="mt-5" v-html="smalltopic.ext.parse" /></div>
                      </div>
                      <!--组合题内题型 - 多选-->
                      <div v-if="smalltopic.type == 2">
                        <div v-for="(res,k) in smalltopic.ext.options" :key="k" class="mb-15 h-20 lh-20">
                          <div class="fl">
                            <span
                              class="circle"
                              :class="(smalltopic.ext.answer).indexOf(k==0? 'A': k==1? 'B': k==2? 'C': k==3? 'D':'') > -1? 'text-white bg-blue border-blue': ''"
                            >{{ k==0? 'A': k==1? 'B': k==2? 'C': k==3? 'D':'' }}
                            </span>
                          </div>
                          <div class="h-20 lh-20 ml-30 opyions-style" v-html="res" />
                        </div>
                        <div class="mb-15">答案：<span v-for="(ans,k) in smalltopic.ext.answer" :key="k">{{ ans }}</span></div>
                        <div class="mb-15">解析：<div class="mt-5" v-html="smalltopic.ext.parse" /></div>
                      </div>
                      <!--组合题内题型 - 判断-->
                      <div v-if="smalltopic.type == 3">
                        <div class="mb-15 h-20 lh-20">
                          <div>
                            <span class="circle" :class="smalltopic.ext.answer[0] == 'A'? 'text-white bg-blue border-blue': ''">√</span>
                          </div>
                        </div>
                        <div class="mb-15 h-20 lh-20">
                          <div>
                            <span class="circle" :class="smalltopic.ext.answer[0] == 'B'? 'text-white bg-blue border-blue': ''">×</span>
                          </div>
                        </div>
                        <div class="mb-15">答案：<span v-for="(ans,k) in smalltopic.ext.answer" :key="k">{{ ans }}</span></div>
                        <div class="mb-15">解析：<div class="mt-5" v-html="smalltopic.ext.parse" /></div>
                      </div>
                      <!--组合题内题型 - 填空-->
                      <div v-if="smalltopic.type == 4">
                        <div class="mb-15">答案：<span v-for="(ans,k) in smalltopic.ext.answer" :key="k" class="mt-5" v-html="ans" /></div>
                        <div class="mb-15">解析：<div class="mt-5" v-html="smalltopic.ext.parse" /></div>
                      </div>
                      <!--组合题内题型 - 简答-->
                      <div v-if="smalltopic.type == 5">
                        <div class="mb-15">答案：<span v-for="(ans,k) in smalltopic.ext.answer" :key="k" class="mt-5" v-html="ans" /></div>
                        <div class="mb-15">解析：<div class="mt-5" v-html="smalltopic.ext.parse" /></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--张套题-->
              <div v-if="questionShow == '7'">
                <div class="card-content-title pl-10">账套题 <el-button size="small" plain class="ml-20 fr" @click="addTopic(item.key)">添加试题</el-button></div>
                <div v-if="topic[questionShow]">
                  <div class="card-content-content p-20">
                    <div class="f-15 bold mb-15">
                      1. 已选账套：{{ topic[questionShow].title }} <br>
                      <p class="mt-5">月份：{{ topicId[questionShow][Object.keys(topicId[questionShow])]['month'] }}月份</p>
                    </div>
                    <!--功能区按钮-->
                    <div class="text-right">
                      <el-button size="mini" class="mr-20" icon="el-icon-delete" @click="delTopic(topic[questionShow].id)" />
                      <p v-if="topicSetting === '2'" class="mt-10">
                        <span>时长 <el-input v-model="topicId[item.key][topic[questionShow].id]['time']" size="mini" style="width: 80px;" @input="steTotal" /> 分</span>
                        <span>分数 <el-input v-model="topicId[item.key][topic[questionShow].id]['score']" size="mini" style="width: 80px;" @input="steTotal" /> 分</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </span>
        </div>
      </div>
      <div v-if="dialogAddTopicVisible">
        <!--题目增加-->
        <el-dialog
          v-el-drag-dialog
          class="exam-type-dialog"
          :modal="false"
          title="试题添加"
          :visible.sync="dialogAddTopicVisible"
          :close-on-click-modal="false"
          width="800px"
          @dragDialog="handleAddTopicCateDrag"
        >
          <div ref="Topic">
            <AddTopic v-if="groupmode == 2" ref="addTopics" :topic-type="topicType" :topic-check="topicCheck" />
            <AddExtractTopic v-if="groupmode == 1" ref="addExtractTopic" :topic-type="topicType" />
          </div>
        </el-dialog>
      </div>
      <!--账套新增弹窗-->
      <div v-if="dialogAddAccountVisible">
        <el-dialog
          v-el-drag-dialog
          class="exam-type-dialog"
          :modal="false"
          title="试题添加"
          :visible.sync="dialogAddAccountVisible"
          :close-on-click-modal="false"
          width="1000px"
          @dragDialog="handleAddAccountCateDrag"
        >
          <div ref="Account">
            <AddAccount ref="addAccount" />
          </div>
        </el-dialog>
      </div>
    </div>
    <!--预览部分-->
    <div v-else-if="examShow === 3">
      <ExamPreciew :answers="answers" />
    </div>
  </div>
</template>

<script>
import { getTkTms, setPaperCategoryList, getPaperAdd, getPaperItem, getAccountItem } from '@/api/game'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import AddTopic from './addTopic'
import AddExtractTopic from './addExtractTopic'
import AddAccount from './addAccount'
import ExamPreciew from './preview'
export default {
  name: 'FormationExam',
  components: { AddTopic, AddExtractTopic, AddAccount, ExamPreciew },
  directives: { elDragDialog },
  data() {
    return {
      examId: '', // 试卷id 空=新增  非空=编辑
      title: '', // 试卷名称
      type: '', // 试卷分类
      limit: '0', // 是否限制每题时长 0:不限制时长 1:限制时长
      groupmode: '2', // 2:选题模式  1:抽题模式
      topicSetting: '1', // 题目设置方式 1:题型设置 2:单题设置
      missing: 0, // 多选题漏选是否给分
      examShow: 1, // 试卷组织显示部分 试卷标题/试卷内容/试卷预览
      questionShow: '1', // 当前点击题目类型
      question: {}, // 全部题型集合
      topic: {}, // 全部题目内容集合
      topicId: {}, // 全部题目id
      topicSum: 0, // 全部题目总数量
      topicScore: 0, // 全部题目总得分
      // 抽取的题目内容
      extractTopic: {},
      dialogAddTopicVisible: false, // 选题弹窗判断
      dialogAddAccountVisible: false, // 账套添加
      knowledgepoint: [
        '固定资产',
        '财产清算',
        '利润表'
      ],
      topicType: '', // 已选中的题目类型
      topicCheck: '', // 已选中的题目
      listProveType: [],
      answers: {} // 预览用题目集合
    }
  },
  mounted() {
    this.setExamType() // 获取试卷分类
    this.$root.$on('tmSelection', (tmSelection) => {
      this.$set(this.topicId, [tmSelection.key], tmSelection[tmSelection.key])
      // 根据题目id获取题目详细信息
      this.getTmItem(tmSelection.key, Object.keys(tmSelection['tmItem']))
    })
    this.$root.$on('ztSelection', (ztSelection) => {
      this.$set(this.topicId, [ztSelection.key], ztSelection.currentRow.id)
      this.$set(this.topicId, [ztSelection.key], ztSelection.item)
      this.$set(this.topic, [ztSelection.key], ztSelection.currentRow)
      this.steTotal()
    })
  },
  methods: {
    questionType(type) {
      this.questionShow = type
    },
    // 添加题目
    addTopic(type) {
      if (type !== 7) {
        if (this.groupmode === '2') {
          // 选题模式
          this.topicType = type
          if (this.topicId[type]) {
            this.topicCheck = this.topicId[type]
          } else {
            this.topicCheck = {}
          }
        } else if (this.groupmode === '1') {
          // 抽题模式
          this.topicType = type
        }
        this.dialogAddTopicVisible = true
      } else {
        // 添加账套
        this.dialogAddAccountVisible = true
      }
    },
    // 添加抽题
    addExtractTopic(type) {

    },
    // 弹窗拖拽
    handleAddTopicCateDrag() {
      this.$refs.Topic.blur()
    },
    // 账套弹窗拖拽
    handleAddAccountCateDrag() {
      this.$refs.Account.blur()
    },
    // 获取题目详细信息
    getTmItem(type, ids) {
      getTkTms({ id: ids }).then(res => {
        this.topic[type] = res.data
        var obj = {
          time: 0,
          score: 0
        }
        // 组合题结构重组
        if (type === 6) {
          var zhtm = this.topic[type]
          for (var i = 0; i < zhtm.length; i++) {
            // 大题层
            this.$set(this.topicId[type], zhtm[i].id, {})
            for (var k in zhtm[i].children) {
              // 小题层
              this.$set(this.topicId[type][zhtm[i].id], zhtm[i].children[k].id, { ...obj })
            }
          }
        }
        this.steTotal()
      })
    },
    // 删除题目
    delTopic(id) {
      if (this.questionShow === 7) {
        this.$delete(this.topicId, this.questionShow)
      } else {
        this.$delete(this.topicId[this.questionShow], id)
        var Tmtopic = this.topic[this.questionShow]
        for (var i = 0; i < Tmtopic.length; i++) {
          if (Tmtopic[i].id === id) {
            Tmtopic.splice(i, 1)
          }
        }
      }
      // 重组数据后进行替换
      this.$set(this.topic, this.questionShow, Tmtopic)

      // tableData的值修改成功，没有渲染到页面上，是数据层次太多，没有触发render函数进行自动更新，需手动调用，调用方式如下:
      this.$forceUpdate()
      this.steTotal()
    },
    // 确认后的下一步
    onSubmit() {
      if (this.title !== '' && this.type !== '') {
        // formationExam/组卷方式/试卷名称/试卷分类
        this.examShow = 2
      } else {
        this.$message.error('试卷名称或分类不能为空')
      }
    },
    toExam() {
      this.$router.push('/game/exam')
    },
    setExamType() {
      // 获取试卷分类
      setPaperCategoryList().then(res => {
        this.listProveType = res.data
        this.question = this.$store.getters.timuTypeList // 获取题目类型
      })

      // 判断试卷id是否存在
      if (this.$route.params.id !== undefined) {
        this.examId = this.$route.params.id
        // 编辑试卷
        getPaperItem(this.examId).then(res => {
          // 数据渲染
          this.title = res.data.paper_title // 试卷标题
          this.type = res.data.category_id // 试卷类型
          this.groupmode = String(res.data.create_type) // 组卷方式
          this.topicSetting = '2'
          this.missing = res.data.duo_xuan_lou_xuan_is_right // 多选题，多选漏选是否给分
          this.topicId = res.data.ext.exam_data
          this.limit = String(res.data.limit_per_exam_time)
          for (var i in this.topicId) {
            if (i !== '7') {
              this.getTmItem(i, Object.keys(this.topicId[i]))
            } else {
              getAccountItem(Object.keys(this.topicId[i])).then(res => {
                this.$set(this.topic, '7', res.data)
              })
            }
          }
        })
      }
    },
    // 计算得分
    steTotal() {
      setTimeout(() => {
        // 计算题目总数量及总分
        var sum = 0 // 总题数
        var score = 0 // 总分
        // 计算全部题目
        for (var i in this.topicId) {
          var typeScore = 0
          // this.topicId[i] 题型层
          // 计算总分
          // 判断是否是组合题
          if (i !== '6') {
            for (var k in this.topicId[i]) {
              if (this.topicId[i][k].score !== 0 && this.topicId[i][k].score !== '') {
                score = score + Number(this.topicId[i][k].score) // 计算总题数
                typeScore = typeScore + Number(this.topicId[i][k].score) // 除组合题、张套题外的总得分
              }
            }
          } else {
            // 组合题得分
            // 大题层
            for (var s in this.topicId[i]) {
              // 小题层
              for (var q in this.topicId[i][s]) {
                // console.log(this.topicId[i][s][q].score)
                score = score + Number(this.topicId[i][s][q].score) // 计算总题数
                typeScore = typeScore + Number(this.topicId[i][s][q].score)
              }
            }
          }

          for (var x = 0; x < this.question.length; x++) {
            if (Number(this.question[x].key) === Number(i)) {
              this.question[x].totalScore = typeScore
            }
          }
          sum = sum + Object.keys(this.topicId[i]).length
        }
        this.topicSum = sum // 题目总数量
        this.topicScore = score
      })
    },
    // 保存试卷
    saveExam() {
      // 验证结构是否为空
      var answer = this.topicId
      if (Object.keys(this.topicId).length !== 0) {
        // 循环判断每题时长及得分是否为空
        var paperData = this.filterTopic()
        if (paperData.type === 0) {
          // 检测结果总分是否等于100
          if (Number(this.topicScore) < 100 || Number(this.topicScore) > 100) {
            this.$confirm('当前总分不等于100分，是否继续保存操作？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              getPaperAdd({
                id: this.$route.params.id,
                exam_data: answer,
                paper_title: this.title,
                category_id: this.type,
                create_type: this.groupmode,
                full_score: this.topicScore,
                duo_xuan_lou_xuan_is_right: this.missing,
                limit_per_exam_time: this.limit
              }).then(res => {
                this.$message.success('保存成功')
                setTimeout(() => {
                  Object.assign(this.$data, this.$options.data())
                  this.$router.push('/game/exam')
                })
              }).catch(() => {})
            }).catch(() => {})
          }
        } else {
          this.$message.error(paperData.msg)
        }
      } else {
        this.$message.error('已选题目不能为空')
      }
    },
    // 预览
    toPreview() {
      this.examShow = 3
      var data = {}
      data['exam_data'] = this.topicId // 右侧题目ID集合
      data['config'] = this.question // 左侧题目类型集合
      data['paper_title'] = this.title // 试卷名称
      data['topic'] = this.topic
      data['missing'] = this.missing
      this.answers = data
    },
    // 根据题型修改题目内的得分及时长
    editPicItem(type, val) {
      var picType = this.questionShow
      // 判断题目集合内是否有题
      if (Object.keys(this.topicId).length !== 0) {
        // 判断当前题型内是否有题
        if (this.topicId[picType]) {
          if (Object.keys(this.topicId[picType]).length !== 0) {
            // 组合题区分
            if (picType !== 6) {
              for (var i in this.topicId[picType]) {
                // 循环修改题目内的值
                this.topicId[picType][i][type] = val
              }
            } else {
              for (var k in this.topicId[picType]) {
                for (var s in this.topicId[picType][k]) {
                  this.topicId[picType][k][s][type] = val
                }
              }
            }
          }
        }
      }
      // 计算总得分和总题数
      this.steTotal()
    },
    // 处理结果集，检测是否存在漏填时间及得分的题目
    filterTopic() {
      var allTopicId = this.topicId
      var data = {
        type: 0,
        msg: ''
      }
      for (var i in allTopicId) {
        var index = 0
        // allTopicId[i] 题目类型层
        // 组合题验证标准除外
        if (i !== '6') {
          for (var k in allTopicId[i]) {
            if (data.type === 0) {
              index++
              var tmItem = allTopicId[i][k] // 每道题的time/score集合
              if (this.limit === '0') {
                if (tmItem.score === '' || Number(tmItem.score) === 0) {
                  data.type = 1
                  if (i === '1') {
                    data.msg = '单选题 第' + index + '小题未设置分值'
                  } else if (i === '2') {
                    data.msg = '多选题 第' + index + '小题未设置分值'
                  } else if (i === '3') {
                    data.msg = '判断题 第' + index + '小题未设置分值'
                  } else if (i === '4') {
                    data.msg = '填空题 第' + index + '小题未设置分值'
                  } else if (i === '5') {
                    data.msg = '简答题 第' + index + '小题未设置分值'
                  } else if (i === '7') {
                    data.msg = '账套题未设置分值'
                  }
                }
              } else {
                if (tmItem.time === '' || Number(tmItem.time) === 0 || tmItem.score === '' || Number(tmItem.score) === 0) {
                  data.type = 1
                  if (i === '1') {
                    data.msg = '单选题 第' + index + '小题未设置时长或分值'
                  } else if (i === '2') {
                    data.msg = '多选题 第' + index + '小题未设置时长或分值'
                  } else if (i === '3') {
                    data.msg = '判断题 第' + index + '小题未设置时长或分值'
                  } else if (i === '4') {
                    data.msg = '填空题 第' + index + '小题未设置时长或分值'
                  } else if (i === '5') {
                    data.msg = '简答题 第' + index + '小题未设置时长或分值'
                  } else if (i === '6') {
                    data.msg = '组合题 第' + index + '小题未设置时长或分值'
                  } else if (i === '7') {
                    data.msg = '账套题未设置时长或分值'
                  }
                }
              }
            }
          }
        } else {
          for (var x = 0; x < Object.keys(allTopicId[i]).length; x++) {
            for (var q in Object.keys(allTopicId[i][Object.keys(allTopicId[i])[x]])) {
              if (data.type === 0) {
                index++
                var zhtmItem = allTopicId[i][Object.keys(allTopicId[i])[x]][Object.keys(allTopicId[i][Object.keys(allTopicId[i])[x]])[q]] // 每道题的time/score集合
                if (this.limit === '0') {
                  if (zhtmItem.score === '' || Number(zhtmItem.score) === 0) {
                    data.type = 1
                    data.msg = '组合题 第' + (parseInt(x) + 1) + '大题内' + (parseInt(q) + 1) + '小题未设置分值'
                  }
                } else {
                  if (zhtmItem.time === '' || Number(zhtmItem.time) === 0 || zhtmItem.score === '' || Number(zhtmItem.score) === 0) {
                    data.type = 1
                    data.msg = '组合题 第' + (parseInt(x) + 1) + '大题内' + (parseInt(q) + 1) + '小题未设置时长或分值'
                  }
                }
              }
            }
          }
        }
      }
      return data
    }
  }
}
</script>

<style>
  .text-blue{
    color: #008DFF;
  }
  .text-white {
    color: #ffffff;
  }
  .bg-blue{
    background-color: #008DFF;
  }
  .border-blue {
    border-color: #008DFF!important;
  }
  .circle{
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 50%;
    border: solid 1px #999999;
  }
  .square{
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 4px;
    border: solid 1px #999999;
  }
  .p-20{
    padding: 20px;
  }
  .h-20{
    height: 20px;
  }
  .mt-5{
    margin-top: 5px;
  }
  lh-20{
    line-height: 20px;
  }
  .ml-30{
    margin-left: 30px;
  }
  .mb-15{
    margin-bottom: 15px;
  }
  .PaperChoseTimu .el-dialog__body{
    padding: 7px !important;
  }
  .opyions-style p{
    height: 20px;
    line-height: 20px;
  }
</style>
<style lang="scss" scoped>
  .PaperChoseTimu {
    background-color: #ffffff;
    .left-panel{
      border: solid 2px #EFF4F8;
      border-radius: 2px;
      margin: 10px;
      padding: 10px;
      .card{
        cursor: pointer;
      }
      .card:hover{
        box-shadow: 0 1px 2px 1px #EFF4F8;
      }
    }
    .right-panel{
      border: solid 2px #EFF4F8;
      margin: 10px 10px 10px 0;
      border-radius: 2px;
      padding: 10px;
      .card-content{
        border: solid 1px #DBDFE6;
        margin-top: 12px;
        border-radius: 2px;
        .card-content-title{
          padding: 0 15px;
          height: 50px;
          line-height: 50px;
          background-color: #F5F8FB;
          .el-button--small{
            margin: 8px;
          }
        }
        .content-title{
          margin-top: 12px;
        }
      }
    }
    .card span{
      color: #009CFF;
    }
  }
  .blue {
    border: 1px solid #008DFF;
    box-shadow: 0px 0px 5px #008DFF;
  }
  .createExam{
    margin: 0px auto;
  }
  .createExam .con{
    position: relative;
    margin: 0px auto;
    top: 25%;
    width: 400px;
  }
  .createExam .con p {
    text-align: center;
    font-size: 24px;
  }
</style>
