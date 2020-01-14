<template>
  <div class="createExam">
    <div class="con">
      <p class="mb-10">选择组卷方式</p>
      <div class="examform">
        <el-form ref="form" :model="createExam" label-width="80px">
          <el-form-item label="试卷名称">
            <el-input v-model="createExam.examname" size="small" clearable />
          </el-form-item>
          <el-form-item label="试卷分类">
            <el-select v-model="createExam.examtype" size="small" clearable placeholder="请选择试卷分类">
              <el-option v-for="(item,index) in listProveType" :key="index" :label="item.category_title" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="组卷方式">
            <el-radio v-model="createExam.groupmode" label="1">选题组卷</el-radio>
            <el-radio v-model="createExam.groupmode" label="2">抽题组卷</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button size="small" @click="toExam">取消</el-button>
            <el-button type="primary" size="small" @click="onSubmit">确认</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { setPaperCategoryList } from '@/api/game'
export default {
  name: 'CreateExam',
  data() {
    return {
      createExam: {
        examname: '', // 试卷名称
        examtype: '', // 试卷分类
        groupmode: '1' // 组卷方式
      },
      listProveType: []
    }
  },
  mounted() {
    this.setExamType() // 获取试卷分类
  },
  methods: {
    onSubmit() {
      var createExam = this.createExam
      if (createExam.examname !== '' && createExam.examtype !== '') {
        // formationExam/组卷方式/试卷名称/试卷分类
        this.$router.push('formationExam/' + this.createExam.groupmode + '/' + this.createExam.examname + '/' + this.createExam.examtype)
      } else {
        this.$message.error('试卷名称或分类不能为空')
      }
    },
    toExam() {
      this.$router.push('exam')
    },
    setExamType() {
      setPaperCategoryList().then(res => {
        this.listProveType = res.data
      })
    }
  }
}
</script>

<style scoped>
  .createExam .con{
    position: relative;
    width: 400px;
    margin: 15% auto;
  }
  .createExam .con p {
    text-align: center;
    font-size: 24px;
  }
</style>
