<template>
  <div class="examItem">
    <el-container style="height: 100%;">
      <el-header style="height: 70px">
        <span>{{ answers.paper_title }}</span>
        <el-button type="primary" plain style="margin-left: 20px;">查看账套实训题</el-button>
      </el-header>
      <el-container class="card" style="margin-top: 20px;height: 100%;">
        <el-aside width="240px" style="margin-right: 15px;position: relative;">
          <div class="title">
            <div class="verticalLine fl-l" />
            <div class="fl-l ml-10" style="width: 90%;">答题卡</div>
          </div>
          <div id="con-list">
            <span v-for="(item,k) in answers.topic" :key="k">
              <div v-if="answers.topic[k] != undefined" class="con">
                <div v-for="(type,x) in answers.config" :key="x+10">
                  <span v-if="Number(type.key) === Number(k)">
                    {{ type.value }}(共{{ answers.topic[k].length }}题，合计 {{ type.totalScore }} 分)
                  </span>
                </div>
                <span v-if="k !== '7'">
                  <p v-for="(items,index) in answers.topic[k]" :key="index" @click="goAnchor('#anchor-'+k+index)">{{ index + 1 }}</p>
                </span>
                <span v-else>
                  <p @click="goAnchor('#anchor-'+k+1)">1</p>
                </span>
              </div>
            </span>
          </div>
          <el-container style="position: absolute;bottom: 0px;left: 0px;width: 100%;box-shadow: 1px -3px 10px #e2e2e2;">
            <div class="footer">
              <div class="footer-con">
                <div class="blue-ball" />
                <span>已答</span>
              </div>
              <div class="footer-con">
                <div class="white-ball" />
                <span>未答</span>
              </div>
              <div class="footer-con">
                <div class="yellow-ball" />
                <span>标记</span>
              </div>
            </div>
          </el-container>
        </el-aside>
        <el-main id="main-list" style="margin-right: 15px; padding: 0px; border-left: 1px solid #DEDEDE;border-right: 1px solid #DEDEDE;border-bottom: 1px solid #DEDEDE;">
          <!--循环解析题目内容-->
          <span v-for="(items,k) in answers.topic" :key="k">
            <div v-if="answers.topic[k] != undefined" class="main">
              <span v-for="(type,j) in answers.config" :key="j">
                <div v-if="type.key == k" class="title">
                  <span v-if="k !== '7'">
                    {{ type.value }}（共{{ answers.topic[k].length }}题，合计{{ type.totalScore }}分）
                  </span>
                  <span v-else>
                    {{ type.value }}（共1题，合计{{ type.totalScore }}分）
                  </span>
                </div>
              </span>
              <div class="exam-list">
                <span v-if="k !== '7'">
                  <div v-for="(item,index) in answers.topic[k]" :id="'anchor-'+k+index" :key="index" class="exam-item">
                    <div v-if="k !== '6'" class="topic">
                      <span class="blue">{{ index+1 }}.</span>
                      {{ ( item.title ).replace(/&lt;[^&gt;]+&gt;/g, "" ) }}（{{ answers.exam_data[k][item.id].score }}分）
                    </div>
                    <!--选项部分-->
                    <!--单选题-->
                    <span v-if="k === '1'">
                      <div v-for="(arr,s) in item.ext.options" :key="s" class="option">
                        <el-radio v-model="radio" disabled="disabled">{{ arr.replace(/&lt;[^&gt;]+&gt;/g, "" ) }}</el-radio>
                      </div>
                    </span>
                    <!--多选题-->
                    <span v-if="k === '2'">
                      <el-checkbox-group v-model="item.val">
                        <div v-for="(arr,s) in item.ext.options" :key="s" class="option">
                          <el-checkbox :label="arr.val" disabled="disabled">{{ arr.replace(/&lt;[^&gt;]+&gt;/g, "" ) }}</el-checkbox>
                        </div>
                      </el-checkbox-group>
                    </span>
                    <!--判断题-->
                    <span v-if="k === '3'">
                      <div class="option">
                        <el-radio disabled="disabled">√</el-radio>
                      </div>
                      <div class="option">
                        <el-radio disabled="disabled">×</el-radio>
                      </div>
                    </span>
                    <!--填空题-->
                    <span v-if="k === '4'" />
                    <!--简答题-->
                    <span v-if="k === '5'" />
                    <!--组合题-->
                    <span v-if="k === '6'">
                      <!--题干部分-->
                      <div v-for="(smalltopic,s) in item.children" :key="s" style="padding: 15px;background-color: #F5F8FB;">
                        <!--{{smalltopic}}-->
                        <div class="f-15 bold mb-20">
                          <span class="fl">({{ s+1 }}) </span>
                          <div>
                            <span v-html="smalltopic.title" />
                          </div>
                        </div>
                        <!--组合题内题型 - 单选-->
                        <div v-if="smalltopic.type == 1">
                          <div v-for="(res,z) in smalltopic.ext.options" :key="z" class="mb-15 h-20 lh-20">
                            <span class="circle">{{ z == 0? 'A': z == 1? 'B': z == 2? 'C': z == 3? 'D':'' }}</span>
                            {{ res.replace(/&lt;[^&gt;]+&gt;/g, "" ) }}
                          </div>
                          <div class="mb-15">答案：<span v-for="(ans,y) in smalltopic.ext.answer" :key="y">{{ ans }}</span></div>
                          <div class="mb-15">解析：<div class="mt-5" v-html="smalltopic.ext.parse" /></div>
                        </div>
                        <!--组合题内题型 - 多选-->
                        <div v-if="smalltopic.type == 2">
                          <div v-for="(res,z) in smalltopic.ext.options" :key="z" class="mb-15 lh-20">
                            <span class="circle">{{ z==0? 'A': z==1? 'B': z==2? 'C': z==3? 'D':'' }}</span>
                            {{ res.replace(/&lt;[^&gt;]+&gt;/g, "" ) }}
                          </div>
                          <div class="mb-15">答案：<span v-for="(ans,w) in smalltopic.ext.answer" :key="w">{{ ans }}</span></div>
                          <div class="mb-15">解析：<div class="mt-5" v-html="smalltopic.ext.parse" /></div>
                        </div>
                        <!--组合题内题型 - 判断-->
                        <div v-if="smalltopic.type == 3">
                          <div class="mb-15 h-20 lh-20">
                            <div>
                              <span class="circle">√</span>
                            </div>
                          </div>
                          <div class="mb-15 h-20 lh-20">
                            <div>
                              <span class="circle">×</span>
                            </div>
                          </div>
                          <div class="mb-15">答案：<span v-for="(ans,w) in smalltopic.ext.answer" :key="w">{{ ans }}</span></div>
                          <div class="mb-15">解析：<div class="mt-5" v-html="smalltopic.ext.parse" /></div>
                        </div>
                        <!--组合题内题型 - 填空-->
                        <div v-if="smalltopic.type == 4">
                          <div class="mb-15">答案：<span v-for="(ans,z) in smalltopic.ext.answer" :key="z+1" class="mt-5" v-html="ans" /></div>
                          <div class="mb-15">解析：<div class="mt-5" v-html="smalltopic.ext.parse" /></div>
                        </div>
                        <!--组合题内题型 - 简答-->
                        <div v-if="smalltopic.type == 5">
                          <div class="mb-15">答案：<span v-for="(ans,w) in smalltopic.ext.answer" :key="w+1" class="mt-5" v-html="ans" /></div>
                          <div class="mb-15">解析：<div class="mt-5" v-html="smalltopic.ext.parse" /></div>
                        </div>
                      </div>
                    </span>
                    <div v-if="k !== '6' && k !== '7'" class="mt-10 p-20 bgf8f8f8 f-13">
                      <p class="mb-10">考生答案：</p>
                      <p class="mb-10">正确答案：<span v-for="(ans,i) in item.ext.answer" :key="i+1">{{ ans === 'A'? '√': '×' }}</span></p>
                      <p>解析：{{ item.ext.parse.replace(/&lt;[^&gt;]+&gt;/g, "") }}</p>
                    </div>
                  </div>
                </span>
                <span v-else>
                  <div :id="'anchor-'+k+1" class="exam-item">
                    <div class="card-content-content p-20">
                      <div class="f-15 bold mb-15">1. 已选账套：{{ answers.topic['7'].title }}</div>
                      <div class="f-15 bold mb-15">月份：{{ answers.topic['7'].month }}月份</div>
                    </div>
                  </div>
                </span>
              </div>
            </div>
          </span>
        </el-main>
        <el-aside width="120px" style="height: 380px; margin-right: 15px; padding: 0 15px;">
          <div class="last-time">
            <p class="text">考生姓名</p>
            <p class="time">杨磊</p>
          </div>
          <div class="last-time">
            <p class="text">考生成绩</p>
            <p class="number">100</p>
          </div>
          <div class="last-time">
            <p class="text">考试状态</p>
            <p class="number">未通过</p>
          </div>
          <div class="last-time">
            <p class="text">仅看错题</p>
            <p class="number">
              <el-switch
                v-model="wrong"
                :active-value="1"
                :inactive-value="0"
              />
            </p>
          </div>
          <el-button type="primary" style="width: 100%;margin-top: 15px;" @click="toExam">返回</el-button>
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Judge',
  data() {
    return {
      answers: {}, // 要筛选的题型
      radio: '0',
      wrong: 0 // 仅看错题
    }
  },
  mounted() {
    this.getList() // 获取试卷分类
  },
  methods: {
    getList() {
      // var examId = this.$route.params.id // 试卷id
      // 根据试卷id查询试卷信息
      var attr = {
        config: [
          {
            key: 1,
            score: 0,
            time: 0,
            totalScore: 0,
            value: '单选题'
          },
          {
            key: 2,
            score: 0,
            time: 0,
            totalScore: 0,
            value: '多选题'
          },
          {
            key: 3,
            score: 0,
            time: 0,
            totalScore: 0,
            value: '判断题'
          },
          {
            key: 4,
            score: 0,
            time: 0,
            totalScore: 0,
            value: '填空题'
          },
          {
            key: 5,
            score: 0,
            time: 0,
            totalScore: 0,
            value: '简答题'
          },
          {
            key: 6,
            score: 0,
            time: 0,
            totalScore: 0,
            value: '组合题'
          },
          {
            key: 7,
            score: 0,
            time: 0,
            totalScore: 0,
            value: '账套题'
          }
        ],
        exam_data: {
          1: {
            117: {
              score: 10,
              time: 10
            }
          },
          2: {
            120: {
              score: 10,
              time: 10
            }
          },
          3: {
            122: {
              score: 10,
              time: 10
            }
          },
          4: {
            124: {
              score: 10,
              time: 10
            }
          },
          5: {
            125: {
              score: 10,
              time: 10
            }
          },
          6: {
            134: {
              score: 10,
              time: 10
            }
          }
        },
        paper_title: '初级实务A',
        topic: {
          1: [
            {
              created_at: '1570499214',
              difficulty_id: 1,
              ext: {
                answer: ['B'],
                keywords: null,
                options: [
                  '<p>用人单位未按照劳动合同约定提供劳动保护或者劳动条件</p>',
                  '<p>用人单位违章指挥、强令冒险作业危及劳动者人身安全</p>',
                  '<p>用人单位未及时足额支付劳动报酬</p>',
                  '<p>用人单位未依法为劳动者缴纳社会保险费</p>'
                ],
                parse: '<p>（1）选项B：属于劳动者“不需要事先告知”即可解除劳动合同的情形；（2）选项ACD：属于劳动者可以“随时通知”解除劳动合同的情形。</p>',
                tid: 117
              },
              id: 117,
              is_for_exam: 0,
              is_top: 1,
              pid: 0,
              title: '<p>根据劳动合同法律制度的规定，下列各项中，劳动者不需要事先告知即可解除劳动合同的是（ ）。</p>',
              type: 1
            }
          ],
          2: [
            {
              created_at: '1570499395',
              difficulty_id: 1,
              ext: {
                answer: ['A', 'C', 'B', 'D'],
                keywords: null,
                options: [
                  '<p>确认发明专利权的案件</p>',
                  '<p>海关处理的案件</p>',
                  '<p>对国务院各部门或者省级人民政府所作的具体行政行为提起诉讼的案件</p>',
                  '<p>本辖区内重大、复杂的案件</p>'
                ],
                parse: '<p>第一审行政案件由“中级人民法院”管辖的有：（1）确认发明专利权的案件；（2）海关处理的案件；（3）对国务院各部门或者省级人民政府所作的具体行政行为提起诉讼的案件；（4）本辖区内重大、复杂的案件。</p>',
                tid: 120
              },
              id: 120,
              is_for_exam: 0,
              is_top: 1,
              pid: 0,
              title: '<p>根据《行政诉讼法》的规定，下列各项中，第一审行政案件由中级人民法院管辖的有（ ）。</p>',
              type: 2
            }
          ],
          3: [
            {
              created_at: '1570499461',
              difficulty_id: 1,
              ext: {
                answer: ['B'],
                keywords: null,
                options: null,
                parse: '<p>【解析】个人因从事彩票代销业务而取得的所得，应按照“个体工商户生产、经营所得”项目计征个人所得税。</p>',
                tid: 122
              },
              id: 122,
              is_for_exam: 0,
              is_top: 1,
              pid: 0,
              title: '<p>个人因从事彩票代销业务而取得的所得，应按照“劳务报酬所得”项目计征个人所得税。（&nbsp;&nbsp;）</p>',
              type: 3
            }
          ],
          4: [
            {
              created_at: '1570499682',
              difficulty_id: 1,
              ext: {
                answer: ['20％'],
                keywords: null,
                options: null,
                parse: '<p>开证行在决定受理时，应向申请人收取不低于开证金额20％的保证金。</p>',
                tid: 124
              },
              id: 124,
              is_for_exam: 0,
              is_top: 1,
              pid: 0,
              title: '<p>根据支付结算法律制度的规定，开证行在决定受理国内信用证业务时，应向申请人收取不低于开证金额（ ）的保证金，并可根据申请人资信情况要求其提供抵押、质押或由其他金融机构出具保函。</p>',
              type: 4
            }
          ],
          5: [
            {
              created_at: '1570499799',
              difficulty_id: 1,
              ext: {
                answer: ['<p>品德是道德品质的简称，是社会道德在个人身上的体现，是个人依据一定的社会道德行为规范行动时表现出来的比较稳定的心理特征和倾向。首先，品德反映了人的社会特征，是将外在于个体的社会规范的要求转化为个体的内在需要的复杂过程。它不是个体的先天禀赋，是通过后天学习形成的。其次，品德具有相对稳定性，只有经常表现出-贯的规范行为，才标志着品德的形成。再次，品德是在道德观念的控制下，进行某种活动、参与某件事情或完成某个任务的自觉行为，也就是说，是认识和行为的统一。如果没有形成道德观念或道德认识，那么，即使个体的行为符合社会规范，也不能说是有品德的。反之亦然。</p>'],
                keywords: '<p>社会特征</p>',
                options: null,
                parse: '<p>品德是道德品质的简称，是社会道德在个人身上的体现，是个人依据一定的社会道德行为规范行动时表现出来的比较稳定的心理特征和倾向。首先，品德反映了人的社会特征，是将外在于个体的社会规范的要求转化为个体的内在需要的复杂过程。它不是个体的先天禀赋，是通过后天学习形成的。其次，品德具有相对稳定性，只有经常表现出-贯的规范行为，才标志着品德的形成。再次，品德是在道德观念的控制下，进行某种活动、参与某件事情或完成某个任务的自觉行为，也就是说，是认识和行为的统一。如果没有形成道德观念或道德认识，那么，即使个体的行为符合社会规范，也不能说是有品德的。反之亦然。</p>',
                tid: 125
              },
              id: 125,
              is_for_exam: 0,
              is_top: 1,
              pid: 0,
              title: '<p>简述品德的特征。&nbsp;</p>',
              type: 5
            }
          ],
          6: [
            {
              children: [
                {
                  created_at: '1570499214',
                  difficulty_id: 1,
                  ext: {
                    answer: ['B'],
                    keywords: null,
                    options: [
                      '<p>用人单位未按照劳动合同约定提供劳动保护或者劳动条件</p>',
                      '<p>用人单位违章指挥、强令冒险作业危及劳动者人身安全</p>',
                      '<p>用人单位未及时足额支付劳动报酬</p>',
                      '<p>用人单位未依法为劳动者缴纳社会保险费</p>'
                    ],
                    parse: '<p>（1）选项B：属于劳动者“不需要事先告知”即可解除劳动合同的情形；（2）选项ACD：属于劳动者可以“随时通知”解除劳动合同的情形。</p>',
                    tid: 117
                  },
                  id: 117,
                  is_for_exam: 0,
                  is_top: 1,
                  pid: 0,
                  title: '<p>根据劳动合同法律制度的规定，下列各项中，劳动者不需要事先告知即可解除劳动合同的是（ ）。</p>',
                  type: 1
                }
              ],
              created_at: '1570605301',
              difficulty_id: 1,
              ext: null,
              id: 148,
              is_for_exam: 0,
              is_top: 1,
              pid: 0,
              title: '<p>经济法基础</p>',
              type: 6
            },
            {
              created_at: '1570499395',
              difficulty_id: 1,
              ext: {
                answer: ['A', 'C', 'B', 'D'],
                keywords: null,
                options: [
                  '<p>确认发明专利权的案件</p>',
                  '<p>海关处理的案件</p>',
                  '<p>对国务院各部门或者省级人民政府所作的具体行政行为提起诉讼的案件</p>',
                  '<p>本辖区内重大、复杂的案件</p>'
                ],
                parse: '<p>第一审行政案件由“中级人民法院”管辖的有：（1）确认发明专利权的案件；（2）海关处理的案件；（3）对国务院各部门或者省级人民政府所作的具体行政行为提起诉讼的案件；（4）本辖区内重大、复杂的案件。</p>',
                tid: 120
              },
              id: 120,
              is_for_exam: 0,
              is_top: 1,
              pid: 0,
              title: '<p>根据《行政诉讼法》的规定，下列各项中，第一审行政案件由中级人民法院管辖的有（ ）。</p>',
              type: 2
            },
            {
              created_at: '1570499461',
              difficulty_id: 1,
              ext: {
                answer: ['B'],
                keywords: null,
                options: null,
                parse: '<p>【解析】个人因从事彩票代销业务而取得的所得，应按照“个体工商户生产、经营所得”项目计征个人所得税。</p>',
                tid: 122
              },
              id: 122,
              is_for_exam: 0,
              is_top: 1,
              pid: 0,
              title: '<p>个人因从事彩票代销业务而取得的所得，应按照“劳务报酬所得”项目计征个人所得税。（&nbsp;&nbsp;）</p>',
              type: 3
            },
            {
              created_at: '1570499682',
              difficulty_id: 1,
              ext: {
                answer: ['20％'],
                keywords: null,
                options: null,
                parse: '<p>开证行在决定受理时，应向申请人收取不低于开证金额20％的保证金。</p>',
                tid: 124
              },
              id: 124,
              is_for_exam: 0,
              is_top: 1,
              pid: 0,
              title: '<p>根据支付结算法律制度的规定，开证行在决定受理国内信用证业务时，应向申请人收取不低于开证金额（ ）的保证金，并可根据申请人资信情况要求其提供抵押、质押或由其他金融机构出具保函。</p>',
              type: 4
            },
            {
              created_at: '1570499799',
              difficulty_id: 1,
              ext: {
                answer: ['<p>品德是道德品质的简称，是社会道德在个人身上的体现，是个人依据一定的社会道德行为规范行动时表现出来的比较稳定的心理特征和倾向。首先，品德反映了人的社会特征，是将外在于个体的社会规范的要求转化为个体的内在需要的复杂过程。它不是个体的先天禀赋，是通过后天学习形成的。其次，品德具有相对稳定性，只有经常表现出-贯的规范行为，才标志着品德的形成。再次，品德是在道德观念的控制下，进行某种活动、参与某件事情或完成某个任务的自觉行为，也就是说，是认识和行为的统一。如果没有形成道德观念或道德认识，那么，即使个体的行为符合社会规范，也不能说是有品德的。反之亦然。</p>'],
                keywords: '<p>社会特征</p>',
                options: null,
                parse: '<p>品德是道德品质的简称，是社会道德在个人身上的体现，是个人依据一定的社会道德行为规范行动时表现出来的比较稳定的心理特征和倾向。首先，品德反映了人的社会特征，是将外在于个体的社会规范的要求转化为个体的内在需要的复杂过程。它不是个体的先天禀赋，是通过后天学习形成的。其次，品德具有相对稳定性，只有经常表现出-贯的规范行为，才标志着品德的形成。再次，品德是在道德观念的控制下，进行某种活动、参与某件事情或完成某个任务的自觉行为，也就是说，是认识和行为的统一。如果没有形成道德观念或道德认识，那么，即使个体的行为符合社会规范，也不能说是有品德的。反之亦然。</p>',
                tid: 125
              },
              id: 125,
              is_for_exam: 0,
              is_top: 1,
              pid: 0,
              title: '<p>简述品德的特征。&nbsp;</p>',
              type: 5
            }
          ]
        },
        missing: 0
      }
      this.answers = attr
    },
    // 锚点跳转事件
    goAnchor(selector) {
      var anchor = this.$el.querySelector(selector)
      document.getElementById('main-list').scrollTop = anchor.offsetTop - 90 // chrome
    },
    toExam() {
      console.log('返回')
    }
  }
}
</script>

<style>
  .hasTagsView .app-main {
    min-height: calc(100vh - 105px) !important;
  }
</style>
<style scoped>
  .examItem{
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #EFF4F8;
  }
  .el-header {
    background-color: #ffffff;
    color: #333;
    box-shadow: 1px -3px 10px;
    line-height: 70px;
    font-size: 18px;
  }
  .el-aside {
    margin-bottom: 0px;
    background-color: #ffffff;
    color: #333;
  }
  .el-main {
    background-color: #ffffff;
    color: #333;
  }
  .card .title{
    font-size: 18px;
    color: #666666;
    height: 30px;
  }
  .card .verticalLine{
    margin-top: 6px;
    width: 5px;
    height: 20px;
    background-color: #008DFF;
  }
  .fl-l{
    float: left;
  }
  .ml-10{
    margin-left: 10px;
  }
  .card .con{
    width: 100%;
    font-size: 13px;
    padding-bottom: 10px;
    margin-top: 10px;
    float: left;
    border-bottom: 1px solid #E6E6E6;
  }
  .card .con p {
    margin: 7px 0 0 0;
    float: left;
    margin-right: 10px;
    border: 1px solid #BFC0C6;
    color: #BFC0C6;
    border-radius: 20px;
    text-align: center;
    height: 30px;
    width: 30px;
    line-height: 25px;
    cursor: pointer;
  }
  .card .con-list{
    float: left;
    height: 91%;
    overflow: auto;
  }
  .card .footer{
    width: 100%;
    height: 34px;
  }
  .card .footer span{
    margin-left: 35px;
  }
  .card .footer .footer-con{
    position: relative;
    width: 33%;
    float: left;
    font-size: 13px;
  }
  .card .footer .blue-ball{
    position: absolute;
    top: 9px;
    left: 17px;
    width: 13px;
    height: 13px;
    border-radius: 20px;
    border: 1px solid #008DFF;
    background-color: #008DFF;
  }
  .card .footer .white-ball{
    position: absolute;
    top: 9px;
    left: 17px;
    width: 13px;
    height: 13px;
    border-radius: 20px;
    border: 1px solid #cccccc;
    background-color: #ffffff;
  }
  .card .footer .yellow-ball{
    position: absolute;
    top: 9px;
    left: 17px;
    width: 13px;
    height: 13px;
    border-radius: 20px;
    border: 1px solid #FF7D38;
    background-color: #FF7D38;
  }
  .card .main .title{
    width: 100%;
    height: 60px;
    line-height: 60px;
    padding-left: 15px;
    border-bottom: 1px solid #DEDEDE;
    border-top: 1px solid #DEDEDE;
    background-color: #FBFBFB;
  }
  .card .main .exam-list{
    padding: 0px 25px;
  }
  .card .main .exam-list .exam-item{
    position: relative;
    padding: 15px 0;
    border-bottom: 1px solid #DEDEDE;
  }
  .card .main .exam-list .exam-item .topic{
    padding-right: 30px;
  }
  .card .main .exam-list .exam-item .blue{
    color: #009CFF;
  }
  .card .main .exam-list .exam-item .option{
    margin: 10px 0px 10px 18px;
  }
  .card .last-time{
    width: 100%;
    height: 80px;
    text-align: center;
    border-bottom: 1px solid #DEDEDE;
  }
  .card .last-time .text{
    padding-top: 10px;
    height: 30px;
    margin: 0px;
    font-size: 13px;
  }
  .card .last-time .time{
    padding-top: 5px;
    margin: 0px;
    font-size: 18px;
    color: red;
  }
  .card .last-time .number{
    padding-top: 7px;
    margin: 0px;
  }
  .card .last-time .xian{
    width: 100%;
    height: 5px;
    background-color: #F1F4F9;
  }
  .card .setanswered{
    background-color: #008DFF;
    color: #ffffff !important;
    border: 1px solid #ffffff !important;
  }
  .card .mark{
    background-color: #FF7D38;
    color: #ffffff !important;
    border: 1px solid #ffffff !important;
  }
  .card .yellow{
    color: #FF7D38 !important;
  }
  .bgf8f8f8{
    background-color: #F8F8F8;
  }
</style>
