<template>
  <div class="objKu">
    <div class="filter-container">
      <Header :title="title" class="fl mr-20" />
      <div class="search-more fl mr-20" @click="searchState = !searchState">
        <span>高级搜索</span>
        <i :class="searchState?'el-icon-arrow-up':'el-icon-arrow-down'" />
      </div>
      <el-collapse-transition>
        <div v-show="searchState" class="search-more-content">
          <div class="mb-20">
            <span class="w-80 inline-block text-right">题目关键词：</span>
            <el-input v-model="listQuery.title" size="small" clearable placeholder="请输入题目关键词" class="w-190" />
          </div>
          <div class="mb-20">
            <span class="w-80 inline-block text-right">题目类型：</span>
            <el-select v-model="listQuery.type" placeholder="请选择题目类型" size="small" clearable class="w-190">
              <el-option label="全部" value="" />
              <el-option v-for="(item, index) in timuTypeList" :key="index" :label="item" :value="index" />
            </el-select>
          </div>
          <div class="mb-20">
            <span class="w-80 inline-block text-right">知识点：</span>
            <el-select v-model="listQuery.knowledge_point_id" placeholder="请选择知识点" size="small" clearable class="w-190">
              <el-option label="全部" value="" />
              <el-option v-for="item in knowledgePointList" :key="item.id" :label="item.knowledge_point" :value="item.id" />
            </el-select>
          </div>
          <div class="mb-20">
            <span class="w-80 inline-block text-right">难度：</span>
            <el-select v-model="listQuery.difficulty_id" placeholder="请选择难度" size="small" clearable class="w-190">
              <el-option label="全部" value="" />
              <el-option v-for="item in levelList" :key="item.id" :label="item.difficulty" :value="item.id" />
            </el-select>
          </div>
          <div class="text-right">
            <el-button v-waves size="mini" type="primary" @click="getList">
              查询
            </el-button>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="mb-12">
      <el-button size="mini" plain icon="el-icon-setting" @click="handleDictionaryItem">
        字典项设置
      </el-button>
      <span class="fr">
        <el-button v-waves size="mini" type="primary" @click="handleAdd">
          增加题目
        </el-button>
        <el-button v-waves size="mini" plain @click="handleImport">
          上传题目
        </el-button>
      </span>
    </div>
    <div class="box-shadow">
      <el-table
        v-loading="listLoading"
        size="mini"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column label="题目" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-html="row.title" />
          </template>
        </el-table-column>
        <el-table-column label="题型" prop="type_name" width="100" align="center" />
        <el-table-column label="知识点" prop="point" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-for="(item, index) in row.knowledge_points" :key="index">
              <span v-if="index === row.knowledge_points.length - 1">{{ item.knowledge_point }}</span>
              <span v-else>{{ item.knowledge_point + '，' }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="难度" prop="difficulty['difficulty']" width="100" align="center">
          <template slot-scope="{row}">
            {{ row.difficulty['difficulty'] }}
          </template>
        </el-table-column>
        <el-table-column label="创建日期" prop="created_at" width="220" align="center">
          <template slot-scope="{row}">
            {{ timeStampToSting(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="{row}">
            <el-button type="text" class="text-add" size="mini" @click="handleEdit(row.id)">
              编辑
            </el-button>
            <el-button type="text" class="text-add" size="mini" @click="handleDel(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <pagination :total="total" class="text-center" :page.sync="pageQuery.page" :limit.sync="pageQuery.page_size" @pagination="getList" />

    <!--批量上传题目-->
    <el-dialog
      v-el-drag-dialog
      :modal="false"
      title="批量上传题目"
      :visible.sync="uploadDialogVisible"
      :close-on-click-modal="false"
      center
      width="450px"
      :before-close="closeUploadDialog"
      @dragDialog="handleDrag"
    >
      <div ref="div" class="text-center" style="padding: 50px 0">
        <el-upload
          ref="upload"
          :limit="1"
          class="upload-demo"
          drag
          :action="host + 'batchUploadExam'"
          :headers="headers"
          :before-upload="beforeUploadDocument"
          :on-success="handleUploadFileSuccess"
          :on-error="handleUploadFileError"
          :show-file-list="true"
          :auto-upload="true"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">
            <div class="mb-10">只能上传excel文件，单个文件上传不得超过5M</div>
            <div>请下载示例文件，按要求格式进行上传 <a :href="host + 'static/importExam.xlsx'">示例文件</a></div>
          </div>
        </el-upload>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchTiMuTypeList, fetchListLevelSet, fetchListPoint, fetchObjKuList, delKu } from '@/api/objKu'
import Header from '@/views/common/header-span'
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'ObjKu',
  components: { Header, Pagination },
  directives: { waves, elDragDialog },
  data() {
    return {
      searchState: false,
      total: 0,
      listQuery: {
        type: '',
        title: '',
        difficulty_id: '',
        knowledge_point_id: ''
      },
      pageQuery: {
        page: 1,
        page_size: 10
      },
      timuTypeList: {},
      levelList: [],
      knowledgePointList: [],
      listLoading: true,
      list: null,
      uploadDialogVisible: false, // 题目批量上传
      allDocumentFileExt: ['xls', 'xlsx'],
      allowUploadFileType: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
    }
  },
  computed: {
    // levelList() {
    //   return this.$store.getters.levelList
    // },
    title() {
      return '客观题题库管理'
    },
    host() {
      return window.host
    },
    headers() {
      return {
        // token: this.$store.state.access_token_teacher
        token: '12313123123123123123'
      }
    }
  },
  created() {
    this.getList()
    this.getTiMuTypeList()
    this.getLevelList()
    this.getKnowledgePointList()
  },
  methods: {
    // 取题目类型
    getTiMuTypeList() {
      fetchTiMuTypeList().then(response => {
        this.timuTypeList = response
      })
    },
    // 取难度列表
    getLevelList() {
      fetchListLevelSet().then(response => {
        this.levelList = response.data.data
      })
    },
    // 取知识点
    getKnowledgePointList() {
      fetchListPoint({}, { limit: '', page: '' }).then(response => {
        this.knowledgePointList = response.data.data
      })
    },
    // 取题目列表
    getList() {
      this.listLoading = true
      fetchObjKuList(this.listQuery, this.pageQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleAdd() {
      this.$router.push('addTimu')
    },
    handleEdit(id) {
      this.$router.push(`addTimu/${id}`)
    },
    handleDel(id) {
      this.$confirm('此操作将删除该题目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delKu({ id: id }).then(res => {
          this.$message.success('删除题目成功')
          this.getList()
        })
      }).catch(() => {
      })
    },
    // 批量导入
    handleImport() {
      this.uploadDialogVisible = true
    },
    // 关闭批量上传dialog
    closeUploadDialog() {
      this.uploadDialogVisible = false
    },
    // 上传之前
    beforeUploadDocument(file) {
      const isLt5M = file.size / 1024 / 1024 < 5
      // 验证单次文件上传大小 不能超过5M
      if (!isLt5M) {
        this.$message.error('文件大小不得超过5M')
        return false
      }
      // 验证文件类型
      let fileType = file.type
      console.log(fileType)
      if (fileType === '') {
        const fileInfo = file.name.split('.')
        if (fileInfo.length < 2) {
          this.$message.error('不支持的文件格式，请重新选择')
          return false
        }
        fileType = fileInfo[fileInfo.length - 1]
        if (this.allDocumentFileExt.indexOf(fileType) === -1) {
          this.$message.error('不支持的文件格式，请重新选择')
          return false
        }
      } else {
        if (this.allowUploadFileType.indexOf(fileType) === -1) {
          this.$message.error('不支持的文件格式，请重新选择')
          return false
        }
      }
    },
    handleUploadFileSuccess(res, file) {
      if (res.status === 1) {
        this.$message.success('题目批量导入成功')
        this.closeUploadDialog()
        this.getList()
      } else {
        this.$refs.upload.clearFiles()
        this.$message.error(res.info)
      }
    },
    handleUploadFileError() {
      this.$refs.upload.clearFiles()
      this.$message.error('批量导入失败')
    },
    // 字典项设置
    handleDictionaryItem() {
      this.$router.push('dictionaryItem')
    },
    // dialog拖拽
    handleDrag() {
      this.$refs.div.blur()
    },
    timeStampToSting(timeStamp) {
      const d = new Date(timeStamp * 1000) // 根据时间戳生成的时间对象
      const year = d.getFullYear()
      let month = d.getMonth() + 1
      if (month < 10) month = '0' + month
      let day = d.getDate()
      if (day < 10) day = '0' + day
      let hours = d.getHours()
      if (hours < 10) hours = '0' + hours
      let minutes = d.getMinutes()
      if (minutes < 10) minutes = '0' + minutes
      let seconds = d.getSeconds()
      if (seconds < 10) seconds = '0' + seconds
      return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
    }
  }
}
</script>

<style lang="scss" scoped>
  .objKu {
    .filter-container{
      .search-more{
      }
      .search-more-content{
        left: 110px;
        width: 375px;
      }
    }
  }
</style>
