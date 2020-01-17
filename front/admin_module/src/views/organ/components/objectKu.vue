<template>
  <div class="objKuSources">
    <div class="filter-container">
      <div class="search-more fl mr-20" @click="searchState = !searchState">
        <span>高级搜索</span>
        <i :class="searchState?'el-icon-arrow-up':'el-icon-arrow-down'" />
      </div>
      <el-collapse-transition>
        <div v-show="searchState" class="search-more-content">
          <div class="flex flex-justify-space-between mb-20">
            <span><span class="w-80 inline-block text-right">课程分类：</span>
              <el-select v-model="listQuery.category" multiple placeholder="请选择课程分类" size="mini" clearable class="w-190">
                <el-option label="全部" value="" />
                <el-option v-for="(item, index) in timuTypeList" :key="index" :label="item" :value="index" />
              </el-select>
            </span>
            <span><span class="w-80 inline-block text-right">适用层次：</span>
              <el-select v-model="listQuery.category" multiple placeholder="请选择适用层次" size="mini" clearable class="w-190">
                <el-option label="全部" value="" />
                <el-option v-for="(item, index) in timuTypeList" :key="index" :label="item" :value="index" />
              </el-select>
            </span>
          </div>
          <div class="flex flex-justify-space-between mb-20">
            <span><span class="w-80 inline-block text-right">难度等级：</span>
              <el-select v-model="listQuery.category" multiple placeholder="请选择难度等级" size="mini" clearable class="w-190">
                <el-option label="全部" value="" />
                <el-option v-for="(item, index) in timuTypeList" :key="index" :label="item" :value="index" />
              </el-select>
            </span>
            <span><span class="w-80 inline-block text-right">题目关键词：</span>
              <el-input v-model="listQuery.title" size="mini" clearable placeholder="请输入题目关键词" class="w-190" />
            </span>
          </div>
          <div class="flex flex-justify-space-between mb-20">
            <span><span class="w-80 inline-block text-right">知识点：</span>
              <el-select v-model="listQuery.knowledge_point_id" placeholder="请选择知识点" size="mini" clearable class="w-190">
                <el-option label="全部" value="" />
                <el-option v-for="item in knowledgePointList" :key="item.id" :label="item.knowledge_point" :value="item.id" />
              </el-select>
            </span>
            <span><span class="w-80 inline-block text-right">题目类型：</span>
              <el-select v-model="listQuery.type" placeholder="请选择题目类型" size="mini" clearable class="w-190">
                <el-option label="全部" value="" />
                <el-option v-for="(item, index) in timuTypeList" :key="index" :label="item" :value="index" />
              </el-select>
            </span>
          </div>
          <div class="flex flex-justify-space-between mb-20">
            <span><span class="w-80 inline-block text-right">难度：</span>
              <el-select v-model="listQuery.difficulty_id" placeholder="请选择难度" size="mini" clearable class="w-190">
                <el-option label="全部" value="" />
                <el-option v-for="item in levelList" :key="item.id" :label="item.difficulty" :value="item.id" />
              </el-select>
            </span>
            <span><span class="w-80 inline-block text-right">来源：</span>
              <el-select v-model="listQuery.type" placeholder="请选择题目类型" size="mini" clearable class="w-190">
                <el-option label="全部" value="" />
                <el-option v-for="(item, index) in timuTypeList" :key="index" :label="item" :value="index" />
              </el-select>
            </span>
          </div>
          <div>
            <span class="w-80 inline-block text-right">引用次数：</span>
            <el-input v-model="listQuery.title" size="mini" clearable class="w-80" type="number" /> -
            <el-input v-model="listQuery.title" size="mini" clearable class="w-80" type="number" />
          </div>
          <div class="text-right">
            <el-button v-waves size="mini" type="primary" @click="getList">
              查询
            </el-button>
          </div>
        </div>
      </el-collapse-transition>
      <div class="fr">
        <el-button size="small" type="primary">
          导出
        </el-button>
      </div>
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
        <el-table-column label="题目" show-overflow-tooltip width="200">
          <template slot-scope="{row}">
            <div class="tm-title" v-html="row.title" />
          </template>
        </el-table-column>
        <el-table-column label="课程分类" prop="type_name" width="" align="center" />
        <el-table-column label="适用层次" prop="type_name" width="" align="center" />
        <el-table-column label="难度等级" prop="type_name" width="" align="center" />
        <el-table-column label="题型" prop="type_name" width="" align="center" />
        <el-table-column label="知识点" prop="point" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-for="(item, index) in row.knowledge_points" :key="index">
              <span v-if="index === row.knowledge_points.length - 1">{{ item.knowledge_point }}</span>
              <span v-else>{{ item.knowledge_point + '，' }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="难度" prop="difficulty['difficulty']" width="" align="center">
          <template slot-scope="{row}">
            {{ row.difficulty['difficulty'] }}
          </template>
        </el-table-column>
        <el-table-column label="来源" prop="type_name" width="" align="center" />
        <el-table-column label="引用次数" prop="type_name" width="" align="center" />
        <el-table-column show-overflow-tooltip label="创建日期" prop="created_at" width="" align="center">
          <template slot-scope="{row}">
            {{ timeStampToSting(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="" align="center">
          <template slot-scope="{row}">
            <el-button type="text" class="text-add" size="mini" @click="detail(row.id)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <pagination :total="total" class="text-center" :page.sync="pageQuery.page" :limit.sync="pageQuery.page_size" @pagination="getList" />
  </div>
</template>

<script>
import { fetchTiMuTypeList, fetchListLevelSet, fetchListPoint, fetchObjKuList } from '@/api/objKu'
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'ObjKuSources',
  components: { Pagination },
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
    // 查看单个题目详情
    detail(id) {
    },
    exportObjectKu() {
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

<style>
  .objKuSources .tm-title p{
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
<style lang="scss" scoped>
  .objKuSources {
    margin-top: 12px;
    .filter-container{
      position: relative;
      .search-more{
      }
      .search-more-content{
      }
    }
  }
</style>
