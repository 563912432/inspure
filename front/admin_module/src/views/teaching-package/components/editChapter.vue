<template>
  <!--章节资源详情-->
  <div class="editChapter">
    <div class="flex flex-justify-space-between flex-align-center mb-12">
      <el-input v-model="listQuery.keywords" size="mini" clearable placeholder="请输入资源名称" class="mr-20 w-300">
        <el-button slot="append" icon="el-icon-search" />
      </el-input>
      <el-button size="small" plain @click="goBack">
        返回
      </el-button>
    </div>
    <div class="chapter flex pt-10">
      <div class="chapter-set-div">
        <div class="mb-10"><el-button size="mini" plain @click="addParentChapter">添加章</el-button></div>
        <el-tree
          ref="tree"
          :data="chapterData"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          :highlight-current="true"
          @node-click="choseChapter"
        >
          <span ref="nodeSpan" slot-scope="{ node, data }" class="custom-tree-node">
            <span v-if="!data.edit" class="custom-title" :style="node.level === 1 || node.level === 2 ? 'font-weight: 700':''">
              {{ data.chapter_title }}
            </span>
            <span v-else>
              <el-input v-model="data.chapter_title" size="mini" />
            </span>
            <span v-if="node.level > 1">
              <!--添加-->
              <i
                v-if="!data.edit"
                class="el-icon-circle-plus-outline tree-icon-blue ml-3 f-15"
                @click="() => appendChapter(data)"
              />
              <i
                v-if="data.edit"
                class="el-icon-circle-check tree-icon-green ml-3 f-15"
                @click="() => saveChapter(data)"
              />
              <!--编辑-->
              <i v-if="!data.edit" class="el-icon-edit-outline tree-icon-orange f-15" @click="changeEdit(data)" />
              <!--删除-->
              <i class="el-icon-circle-close tree-icon-red f-15" @click="() => removeChapter(node, data)" />
            </span>
          </span>
        </el-tree>
      </div>
      <div class="flex-1 content">
        <div v-if="!editStatus" class="mask">不可编辑</div>
        <div v-else class="main-bottom">
          <div class="main-title flex flex-align-center">
            <span class="c-small-tag" />
            <span class="ml-10" :class="activeName === 'zero'?'col-blue':''">课程资源（27）</span>
          </div>
          <div>
            <el-tabs v-model="activeName" class="mail-tabs" type="card">
              <el-tab-pane :label="'视频（10）'" name="first" style="height: 30px" />
              <el-tab-pane :label="'图文课件（20）'" name="second" />
              <el-tab-pane :label="'链接（20）'" name="third" />
              <el-tab-pane :label="'学习任务（10）'" name="fourth" />
              <el-tab-pane :label="'作业测试（5）'" name="fifth" />
              <el-tab-pane :label="'话题（15）'" name="sixth" class="last-child" />
            </el-tabs>
            <div v-if="activeName === 'zero'">
              <div v-for="(item, index) in allResources" :key="index" class="resources-div" style="padding: 15px">
                <div class="flex-1 flex">
                  <img v-if="index % 3 === 0" src="../../../assets/image/demo1.png" alt="" class="resources-img">
                  <img v-else-if="index % 3 === 1" src="../../../assets/image/demo2.png" alt="" class="resources-img">
                  <img v-else src="../../../assets/image/demo3.png" alt="" class="resources-img">
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
          </div>
        </div>
      </div>
      <!--编辑章节管理弹窗-->
      <el-dialog v-el-drag-dialog class="chapter-dialog" width="400px" :modal="false" :close-on-click-modal="false" title="编辑章节" :visible.sync="dialogChapterVisible" @dragDialog="handleChapterDrag">
        <el-form ref="chapterForm" :rules="chapterRules" :model="chapterFormData" label-position="left" label-width="80px">
          <el-form-item label="章节名称" prop="chapter_title">
            <el-input v-model="chapterFormData.chapter_title" clearable size="mini" />
          </el-form-item>
        </el-form>
        <div ref="divChapter" slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="saveChapter(chapterFormData)">
            确定
          </el-button>
          <el-button size="small" plain @click="dialogChapterVisible = false">
            返回
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
export default {
  name: 'EditChapter',
  directives: { elDragDialog },
  data() {
    return {
      listQuery: {
        keywords: ''
      },
      chapterData: [],
      dialogChapterVisible: false,
      chapterFormData: {
        chapter_title: ''
      },
      chapterRules: {
        chapter_title: [{ required: true, message: '请填写章节名称', trigger: 'blur' }]
      },
      editStatus: false,
      choseChapterId: '',
      ossToken: '',
      headers: {},
      fileName: '',
      file: '',
      activeName: 'zero',
      allResources: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    goBack() {
      this.$store.commit('package/SAVE_EDIT_COURSE_STATE', 0)
    },
    getList() {
      this.chapterData = [{
        id: 1,
        chapter_title: '初级会计第一章',
        edit: false,
        video: '',
        course: '',
        href: '',
        target: '',
        test: '',
        topic: '',
        renwu: '',
        children: [{
          id: 4,
          chapter_title: '初级会计 第一章 第一节',
          video: '30',
          course: '10',
          href: '7',
          target: '8',
          test: '30',
          topic: '30',
          renwu: '20',
          children: [{
            id: 9,
            chapter_title: '初级会计 第一章 第一节 第一小节',
            video: '30',
            course: '20',
            href: '10',
            target: '30',
            test: '8',
            topic: '30',
            renwu: '0'
          }, {
            id: 10,
            chapter_title: '初级会计 第一章 第一节 第二小节',
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
        chapter_title: '初级会计第二章',
        video: '',
        course: '',
        href: '',
        target: '',
        test: '',
        topic: '',
        renwu: '',
        children: [{
          id: 5,
          chapter_title: '初级会计 第二章 第一节',
          video: '30',
          course: '20',
          href: '20',
          target: '3',
          test: '30',
          topic: '30',
          renwu: '20'
        }, {
          id: 6,
          chapter_title: '初级会计 第二章 第二节',
          video: '30',
          course: '20',
          href: '11',
          target: '30',
          test: '30',
          topic: '30',
          renwu: '20'
        }]
      }]
      this.allResources = [
        { title: '屏幕快照2020-01-18', type: 1, size: '400kb', time: '2020-01-18 14:50', exp: '10', watch: '10', cate: '任务点', fileType: '视频' },
        { title: '测试标题2', type: 2, size: '4M', time: '2020-01-18 14:50', exp: '10', watch: '200', cate: '任务点', fileType: '图文课件' },
        { title: '测试标题3', type: 3, size: '20M', time: '2020-01-18 14:50', exp: '10', watch: '100', cate: '任务点', fileType: '图文课件' },
        { title: '测试标题4', type: 4, size: '500kb', time: '2020-01-18 14:50', exp: '10', watch: '40', cate: '任务点', fileType: '图文课件' },
        { title: '测试标题5', type: 2, size: '20M', time: '2020-01-18 14:50', exp: '10', watch: '50', cate: '任务点', fileType: '视频' },
        { title: '测试标题6', type: 2, size: '400kb', time: '2020-01-18 14:50', exp: '10', watch: '10', cate: '任务点', fileType: '视频' },
        { title: '测试标题7', type: 1, size: '400kb', time: '2020-01-18 14:50', exp: '10', watch: '10', cate: '任务点', fileType: '视频' }
      ]
    },
    // 文件上传之前的操作
    beforeFileUpload(file) {
    },
    // 自定义上传
    uploadFile() {
    },
    handleSuccess(res, file) {
      console.log(res)
      console.log(file)
    },
    put(url, data, fn) { // datat应为'a=a1&b=b1'这种字符串格式，在jq里如果data为对象会自动将对象转成这种字符串格式
      const obj = new XMLHttpRequest()
      obj.open('PUT', url, true)
      obj.setRequestHeader('Authorization', this.ossToken)
      obj.setRequestHeader('Content-MD5', '')
      obj.setRequestHeader('Content-Type', this.file.type)
      obj.onreadystatechange = function() {
        if (+obj.readyState === 4 && (+obj.status === 200 || +obj.status === 304 || +obj.status === 0)) { // 304未修改
          fn.call(this, JSON.parse(obj.responseText))
        }
      }
      obj.send(data)
    },
    // 添加
    appendChapter(data) {
      const newChild = { chapter_title: '', pid: data.id, edit: true, children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },
    // 添加章
    addParentChapter() {
      this.chapterFormData = {
        chapter_title: '',
        pid: 0
      }
      this.dialogChapterVisible = true
    },
    // 编辑
    changeEdit(data) {
      this.chapterFormData = {
        id: data.id,
        chapter_title: data.chapter_title,
        pid: data.pid
      }
      this.dialogChapterVisible = true
    },
    // 删除
    removeChapter(node, data) {
      if (!data.id || data.id === '') {
        const parent = node.parent
        const children = parent.data.children || parent.data
        const index = children.findIndex(d => d.id === data.id)
        children.splice(index, 1)
      } else {
        this.$confirm('确定要删除部门【' + data.chapter_title + '】吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        /*  handleChapterDel({ id: data.id }).then(response => {
            this.$message.success('删除成功')
            this.getList()
          })*/
        }).catch(() => {
          console.log('cancel')
        })
      }
    },
    // 保存
    saveChapter(data) {
      /* handleChapterAdd(data).then(response => {
        this.$message.success('保存成功')
        this.getList()
        if (this.dialogChapterVisible) {
          this.dialogChapterVisible = false
        }
      })*/
    },
    handleChapterDrag() {
      this.$refs['divChapter'].blur()
    },
    choseChapter(data, node, el) {
      this.choseChapterId = data.id
      /* if (!data.children || data.children.length === 0) {
        this.editStatus = true
      } else {
        this.editStatus = false
      }*/
      this.editStatus = true
    }
  }
}
</script>
<style>
  .editChapter .el-tree-node__content{
    height: 32px!important;
  }
  .editChapter .custom-tree-node .el-input--mini .el-input__inner{
    height: 20px;
    line-height: 20px;
  }
  .chapter-dialog .el-dialog__body{
    padding: 20px 40px!important;
  }
  .editChapter .el-tabs--card > .el-tabs__header .el-tabs__item.is-active{
    border-bottom-color: #93C343;
    border-bottom-width: 2px;
  }
  .editChapter .el-tabs__header{
    margin: 0;
    /*padding: 10px 0 0 10px;*/
    border-bottom-color: transparent;
  }
  .editChapter .mail-tabs .el-tabs__nav{
    border-radius:0;
    border: none;
  }
  .editChapter .el-tabs__nav .is-top {
    background-color: #ffffff;
  }
  .editChapter .mail-tabs .el-tabs__item{
    height: 30px!important;
    line-height: 30px!important;
    font-size: 13px!important;
    padding: 0!important;
    width: 115px;
    text-align: center;
    border-top: solid 1px #D7D7D7;
    border-bottom: solid 1px #D7D7D7;
  }
  .editChapter .mail-tabs .el-tabs__item:first-child{
    border-left: solid 1px #D7D7D7;
  }
  .editChapter .mail-tabs .el-tabs__item:last-child{
    border-right: solid 1px #D7D7D7!important;
  }
</style>
<style lang="scss" scoped>
  .editChapter {
    padding-bottom: 20px;
    .chapter {
      border: solid 1px #f3f3f3;
      padding: 10px;
      .chapter-set-div{
        width: 260px;
        min-height: 500px;
        /*border: solid 1px #F5F7FA;*/
        /*padding: 10px 0;*/
        font-size: 13px!important;
      }
      .custom-tree-node {
        flex: 1;
        overflow: hidden;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 13px;
        padding-right: 8px;
        padding-top: 2px;
        .custom-title {
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .tree-icon-blue{
        color: #84CDED;
        font-weight: bold
      }
      .col-blue{
        color: #447ED9;
      }
      .tree-icon-orange{
        color: #F5CD1D;
        font-weight: bold
      }
      .tree-icon-red{
        color: #F85832;
        font-weight: bold
      }
      .tree-icon-green{
        color: #7CCB40;
      }
      .content {
        position: relative;
        .mask {
          position: absolute;
          z-index: 9;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(7, 17, 27, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 50px;
          letter-spacing: 10px;
          color: #999;
          font-weight: bold;
        }
        .main-bottom {
          flex: 1;
          margin-left: 10px;
          /*border: solid 1px #F5F7FA;*/
          border-left: solid 1px #F5F7FA;
          padding: 10px;
          .bottom-tab {
            display: flex;
            flex-direction: column;
            padding: 20px;
            /*border-bottom: solid 1px #F5F7FA;*/
          }
          .c-small-tag {
            width: 3px;
            height: 15px;
            background: #447ED9;
            display: inline-block;
          }
          .resources-div {
            display: flex;
            justify-content: space-between;
            border-bottom: solid 1px #e7e7e7;
            .resources-img {
              width: 60px;
              height: 60px;
            }
          }
        }
      }
    }
  }
</style>
