<template>
  <div class="videoCourse">
    <div v-if="position === 1">
      <div style="padding: 0 15px;font-size: 15px">
        <span>添加方式：</span>
        <span class="pointer file" @click="position = 2">本地文件</span>
      </div>
      <div v-for="(item, index) in list" :key="index" class="resources-div" style="padding: 15px">
        <div class="flex-1 flex">
          <img src="../../../assets/image/demo1.png" alt="" class="resources-img">
          <div class="flex-1 flex flex-column ml-10">
            <div class="flex-1 flex flex-align-center f-15 col-666">{{ item.title }}</div>
            <div class="flex-1" style="display: flex;align-items: flex-end;font-size: 13px;color: #999999">
              <span style="width: 50px">{{ item.size }}</span>
              <span>|</span>
              <span class="w-135 text-center">{{ item.time }}</span>
              <span>|</span>
              <span class="w-65 text-center">{{ item.exp }}</span>
              <span>|</span>
              <span class="w-135 text-center">{{ item.watch }} 人已查看</span>
              <span>|</span>
              <span class="w-33 text-center">{{ item.type }}</span>
              <span>|</span>
              <span class="w-65 text-center">{{ item.fileType }}</span>
            </div>
          </div>
        </div>
        <div>
          <el-dropdown>
            <span class="el-dropdown-link pointer"><i class="el-icon-more" /></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>编辑</el-dropdown-item>
              <el-dropdown-item>插入试题</el-dropdown-item>
              <el-dropdown-item>删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div v-else>
      <UploadLocalFile @click="position = 1" />
    </div>
  </div>
</template>

<script>
import UploadLocalFile from './uploadLocalFile'
export default {
  name: 'VideoCourse',
  components: { UploadLocalFile },
  data() {
    return {
      list: [],
      position: 1
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.list = [
        { title: '我是视频课程', type: 1, size: '400kb', time: '2020-01-18 14:50', exp: '10', watch: '10', cate: '任务点', fileType: '视频' }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
  .videoCourse{
    .resources-div {
      display: flex;
      justify-content: space-between;
      border-bottom: solid 1px #e7e7e7;
      .resources-img {
        width: 60px;
        height: 60px;
      }
    }
    .file:hover{
      color: #447ED9;
    }
  }
</style>
