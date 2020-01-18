<template>
  <div class="editCourse bg-white p-10 mb-20" style="border: solid 1px #e7e7e7">
    <div class="flex flex-justify-space-between flex-align-center" style="padding: 5px 0">
      <span>课程目录</span>
      <span>
        <el-button type="primary" size="small" @click="editChapter">编辑</el-button>
      </span>
    </div>
    <div class="block">
      <div class="flex" style="width: 100%;padding: 10px 0;background: #f5f5f5;">
        <span style="flex: 3;text-align: center">课程名称</span>
        <span class="flex-1 text-center" style="margin-left: 25px">视频</span>
        <span class="flex-1 text-center" style="margin-left: 25px">课件</span>
        <span class="flex-1 text-center">链接</span>
        <span class="flex-1 text-center">学习任务</span>
        <span class="flex-1 text-center">作业测试</span>
        <span class="flex-1 text-center">话题</span>
        <span class="flex-1 text-center">任务点</span>
      </div>
      <el-tree
        :data="list"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span class="flex" style="flex: 3">
            <span class="flex">
              <span :class="[node.level === 1? 'bold': '', node.level === 1? 'f-15': '']">{{ data.label }}</span>
            </span>
          </span>
          <span class="flex-1 text-center" :style="{ marginLeft: (-18 * (node.level - 1)) + 'px' }">
            {{ data.video }}
          </span>
          <span class="flex-1 text-center" style="margin-left: 25px">
            {{ data.course }}
          </span>
          <span class="flex-1 text-center">
            {{ data.href }}
          </span>
          <span class="flex-1 text-center">
            {{ data.target }}
          </span>
          <span class="flex-1 text-center">
            {{ data.test }}
          </span>
          <span class="flex-1 text-center">
            {{ data.topic }}
          </span>
          <span class="flex-1 text-center">
            <span v-if="parseInt(data.renwu) > 0" class="bg-green circle">{{ data.renwu }}</span>
            <span v-else class="bg-circle" />
          </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditCourse',
  data() {
    return {
      list: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.list = [{
        id: 1,
        label: '初级会计第一章',
        video: '0',
        course: '0',
        href: '0',
        target: '0',
        test: '0',
        topic: '0',
        renwu: '0',
        children: [{
          id: 4,
          label: '初级会计 第一章 第一节',
          video: '30',
          course: '10',
          href: '7',
          target: '8',
          test: '30',
          topic: '30',
          renwu: '20',
          children: [{
            id: 9,
            label: '初级会计 第一章 第一节 第一小节',
            video: '30',
            course: '20',
            href: '10',
            target: '30',
            test: '8',
            topic: '30',
            renwu: '0'
          }, {
            id: 10,
            label: '初级会计 第一章 第一节 第二小节',
            video: '30',
            course: '20',
            href: '4',
            target: '30',
            test: '30',
            topic: '30',
            renwu: '20'
          }]
        }]
      }, {
        id: 2,
        label: '初级会计第二章',
        video: '0',
        course: '0',
        href: '0',
        target: '0',
        test: '0',
        topic: '0',
        renwu: '0',
        children: [{
          id: 5,
          label: '初级会计 第二章 第一节',
          video: '30',
          course: '20',
          href: '20',
          target: '3',
          test: '30',
          topic: '30',
          renwu: '20'
        }, {
          id: 6,
          label: '初级会计 第二章 第二节',
          video: '30',
          course: '20',
          href: '11',
          target: '30',
          test: '30',
          topic: '30',
          renwu: '20'
        }]
      }]
    },
    editChapter() {
      this.$store.commit('package/SAVE_EDIT_COURSE_STATE', 1)
    }
  }
}
</script>
<style>
  .editCourse .el-tree-node__content{
    height: 40px;
  }
  .bg-fb {
    background-color: #FBFBFB;
  }
  .bold {
    font-weight: bold;
  }
  .f-15 {
    font-size: 15px;
  }
  .bg-green {
    background-color: #93C343;
  }
  .bg-circle {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: #ffffff;
    border-radius: 50%;
    border: solid 3px #EFEFEF;
  }
  .circle {
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 20px;
    border-radius: 50%;
    color: #ffffff;
    font-size: 12px;
  }
</style>
<style scoped lang="scss">
  .editCourse {
    .custom-tree-node {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      color: #333;
      .edit-node{
        font-size: 12px;
        color: #0378D9;
      }
    }
  }
</style>
