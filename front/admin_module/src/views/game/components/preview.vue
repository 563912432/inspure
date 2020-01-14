<template>
  <div class="examItem">
    <el-container style="height: 100%;">
      <el-header style="height: 70px">
        <span>{{ answers.paper_title }}</span>
        <el-button type="primary" plain style="margin-left: 20px;">查看账套实训题</el-button>
      </el-header>
      <el-container class="card" style="margin-top: 20px;">
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
                  <p v-for="(item,index) in answers.topic[k]" :key="index" @click="goAnchor('#anchor-'+k+index)">{{ index + 1 }}</p>
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
          <span v-for="(item,k) in answers.topic" :key="k">
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
                            {{ ( item.title ).replace(/&lt;[^&gt;]+&gt;/g, "" ) }}（{{ answers.exam_data[k][item.id][smalltopic.id].score }}分）
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
        <el-aside width="120px" style="height: 230px; margin-right: 15px; padding: 0 15px;">
          <div class="last-time">
            <p class="text">剩余时间</p>
            <p class="time">00:00:00</p>
          </div>
          <div class="last-time">
            <p class="text">当前进度</p>
            <p class="number">0/0</p>
            <div class="xian" />
          </div>
          <el-button type="primary" style="width: 100%;margin-top: 15px;" @click="toExam">返回</el-button>
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Preview',
  props: {
    // 要筛选的题型
    answers: {
      type: Object,
      required: true,
      defaults: {}
    }
  },
  data() {
    return {
      radio: '0'
    }
  },
  methods: {
    // 锚点跳转事件
    goAnchor(selector) {
      var anchor = this.$el.querySelector(selector)
      document.getElementById('main-list').scrollTop = anchor.offsetTop - 90 // chrome
    },
    toExam() {
      this.$parent.onSubmit()
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
