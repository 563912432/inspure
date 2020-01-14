<template>
  <div class="extractTopic">
    <el-form ref="form" :model="topic" label-width="90px">
      <el-form-item label="当前题型">
        <el-input v-model="topicName" size="small" :disabled="true" />
      </el-form-item>
      <el-form-item label="选择知识点">
        <el-select
          v-model="topic.knowledgepoint"
          multiple
          size="small"
          clearable
          style="width: 100%;"
          placeholder="请选择文章标签"
        >
          <el-option
            v-for="item in knowledgeOoptions"
            :key="item.id"
            :label="item.knowledge_point"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="数量设置">
        <div v-for="(item,index) in difficultyList" :key="index" class="zuhe">
          <el-input v-model="topic.sum[item.id]" placeholder="题目数量" size="small" clearable class="input-with-select" @input="editSum">
            <template slot="prepend">难度：{{ item.difficulty }}</template>
            <template slot="append">道</template>
          </el-input>
        </div>
      </el-form-item>
      <el-form-item label="抽题限制">
        <el-checkbox v-model="topic.condition" :false-label="1" :true-label="2">可在非考试题中选题</el-checkbox>
      </el-form-item>
      <el-form-item class="text-right">
        <el-button size="mini">关闭</el-button>
        <el-button type="primary" size="mini" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getKnowledgePointsList, getDifficultyList, difficultyId } from '@/api/game'
export default {
  name: 'AddExtractTopic',
  props: {
    // 要筛选的题型
    topicType: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      topicName: '', // 题型名称
      topic: {
        knowledgepoint: [], // 知识点
        sum: {}, // 题目数量
        condition: 1 // 可在非考试题中选题
      },
      // 知识点
      knowledgeOoptions: [],
      // 难度
      difficultyList: []
    }
  },
  created() {
    this.setTopicName()
    this.getKnowledgeList() // 获取知识点列表
    this.getDifficulty() // 获取难易度列表
  },
  methods: {
    onSubmit() {
      // console.log(this.topic.knowledgepoint)
      var sum = this.topic.sum
      // 判断知识点是否为空
      if (this.topic.knowledgepoint.length !== 0) {
        // 判断题目数量是否为空
        if (Object.keys(sum).length !== 0) {
          var data = {}
          data['type'] = this.topicType // 题目类型
          data['knowledge_points'] = this.topic.knowledgepoint
          data['all'] = this.topic.condition // 可在非考试题中选题
          data['difficulty'] = this.topic.sum
          // 根据条件查询题目id
          difficultyId(data).then(res => {
            var att = {} // 返回上一页面的结构树
            att[this.topicType] = {}
            att['key'] = this.topicType
            for (var k = 0; k < res.data[0].length; k++) {
              att[this.topicType][res.data[0][k]] = {
                time: 0,
                score: 0
              }
            }
            att['tmItem'] = att[this.topicType]
            this.$root.$emit('tmSelection', att)
          })
        } else {
          this.$message.error('题目数量不能为空')
        }
      } else {
        this.$message.error('知识点不能为空')
      }
    },
    setTopicName() {
      if (this.topicType === 1) {
        this.topicName = '单选题'
      } else if (this.topicType === 2) {
        this.topicName = '多选题'
      } else if (this.topicType === 3) {
        this.topicName = '判断题'
      } else if (this.topicType === 4) {
        this.topicName = '填空题'
      } else if (this.topicType === 5) {
        this.topicName = '问答题'
      } else if (this.topicType === 6) {
        this.topicName = '组合题'
      }
    },
    // 获取知识点列表
    getKnowledgeList() {
      getKnowledgePointsList().then(res => {
        this.knowledgeOoptions = res.data.data
      })
    },
    // 获取难度列表
    getDifficulty() {
      getDifficultyList().then(res => {
        this.difficultyList = res.data.data
      })
    },
    // 修改答案结构
    editSum() {
      var sum = this.topic.sum
      // 循环去除不存在数量的难度集合
      for (var i in sum) {
        if (sum[i] === '' || sum[i] === '0') {
          delete sum[i]
        }
      }
    }
  }
}
</script>

<style>
  .extractTopic .zuhe .el-select .el-input {
    width: 130px;
  }
</style>
<style scoped>
  .extractTopic{
    width: 100%;
    height: 100%;
  }
  .extractTopic .bg-white{
    background-color: #ffffff;
  }
  .extractTopic .box-shadow {
    box-shadow: 0 1px 2px 1px rgba(224, 224, 224, 0.50);
  }
</style>
