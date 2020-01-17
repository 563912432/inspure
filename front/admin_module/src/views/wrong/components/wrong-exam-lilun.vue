<template>
  <div class="wrongExamLilun mt-12">
    <div class="filter-container">
      <div class="search-more fl mr-20" @click="searchState = !searchState">
        <span>高级搜索</span>
        <i :class="searchState?'el-icon-arrow-up':'el-icon-arrow-down'" />
      </div>
      <el-collapse-transition>
        <div v-show="searchState" class="search-more-content">
          <div class="flex flex-justify-space-between mb-20">
            <span><span class="w-80 inline-block text-right">题目关键词：</span>
              <el-input v-model="listQuery.title" size="small" clearable placeholder="请输入题目关键词" class="w-190" />
            </span>
            <span><span class="w-80 inline-block text-right">考试类型：</span>
              <el-select v-model="listQuery.examType" placeholder="请选择考试类型" size="small" clearable class="w-190">
                <el-option label="全部" value="" />
              </el-select>
            </span>
          </div>
          <div class="flex flex-justify-space-between mb-20">
            <span><span class="w-80 inline-block text-right">题目类型：</span>
              <el-select v-model="listQuery.type" placeholder="请选择题目类型" size="small" clearable class="w-190">
                <el-option label="全部" value="" />
                <el-option v-for="(item, index) in timuTypeList" :key="index" :label="item" :value="index" />
              </el-select>
            </span>
            <span><span class="w-80 inline-block text-right">课程：</span>
              <el-select v-model="listQuery.type" placeholder="请选择课程" size="small" clearable class="w-190">
                <el-option label="全部" value="" />
              </el-select>
            </span>
          </div>
          <div class="flex flex-justify-space-between mb-20">
            <span><span class="w-80 inline-block text-right">知识点：</span>
              <el-select v-model="listQuery.knowledge_point_id" placeholder="请选择知识点" size="small" clearable class="w-190">
                <el-option label="全部" value="" />
                <el-option v-for="item in knowledgePointList" :key="item.id" :label="item.knowledge_point" :value="item.id" />
              </el-select>
            </span>
            <span><span class="w-80 inline-block text-right">来源：</span>
              <el-select v-model="listQuery.type" placeholder="请选择来源" size="small" clearable class="w-190">
                <el-option label="全部" value="" />
                <el-option v-for="(item, index) in timuTypeList" :key="index" :label="item" :value="index" />
              </el-select>
            </span>
          </div>
          <div class="text-right">
            <el-button v-waves size="mini" type="primary" @click="getList">
              查询
            </el-button>
          </div>
        </div>
      </el-collapse-transition>
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
        :sort-orders="['ascending', 'descending']"
        @sort-change="changeTableSort"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column label="题目" width="200" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span class="exam-row" v-html="row.title" />
          </template>
        </el-table-column>
        <el-table-column label="考试类型" prop="exam_type" width="" align="center" />
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
        <el-table-column label="来源" prop="from" width="" align="center" />
        <el-table-column label="做题人数" sortable prop="doneNum" width="" align="center" />
        <el-table-column label="答对人数" sortable prop="rightNum" width="" align="center" />
        <el-table-column label="答错人数" sortable prop="wrongNum" width="" align="center" />
        <el-table-column label="正确率" sortable="custom" prop="rightRate" width="" align="center" />
        <el-table-column label="创建日期" prop="created_at" width="" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            {{ timeStampToSting(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="" align="center">
          <template slot-scope="{row}">
            <el-button type="text" class="text-add" size="mini" @click="copy(row.id)">
              参考制题
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
  name: 'WrongExamLilun',
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
      list: null
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
        this.list.forEach(v => {
          v['exam_type'] = '期末考试'
          v['from'] = '浪潮易云'
          v['doneNum'] = this.random(1, 100)
          v['rightNum'] = this.random(1, 100)
          v['wrongNum'] = this.random(1, 100)
          v['rightRate'] = this.random(1, 100) + '%'
        })
        this.total = response.data.total
        this.listLoading = false
      })
    },
    changeTableSort(column) {
      // 获取字段名称和排序类型
      var fieldName = column.prop
      var sortingType = column.order

      // 如果字段名称为“创建时间”，将“创建时间”转换为时间戳，才能进行大小比较
      if (fieldName === 'rightRate') {
        if (sortingType === 'descending') {
          // 按照降序排序
          this.list = this.list.sort((a, b) => b[fieldName].substring(0, b[fieldName].length - 1) - a[fieldName].substring(0, a[fieldName].length - 1))
        } else {
          // 按照升序排序
          this.list = this.list.sort((a, b) => a[fieldName].substring(0, a[fieldName].length - 1) - b[fieldName].substring(0, b[fieldName].length - 1))
        }
      }
    },
    copy(id) {},
    random(lower, upper) {
      return Math.floor(Math.random() * (upper - lower)) + lower
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

<style>
  .exam-row p {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
<style lang="scss" scoped>
  .wrongExamLilun {
    .filter-container{
      .search-more{
      }
      .search-more-content{
      }
    }
  }
</style>
