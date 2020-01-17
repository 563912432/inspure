<template>
  <div class="teacherClass">
    <!--教师班课信息-->
    <div class="w-100p mt-12">
      <div class="filter-container">
        <div class="search-more fl" @click="searchState = !searchState">
          <span>高级搜索</span>
          <i :class="searchState?'el-icon-arrow-up':'el-icon-arrow-down'" />
        </div>
        <el-collapse-transition>
          <div v-show="searchState" class="search-more-content">
            <div class="flex flex-justify-space-between mb-20">
              <span><span class="w-65 inline-block text-right">课程分类：</span>
                <el-select v-model="listQuery.cate" clearable size="small" multiple placeholder="请选择课程分类" class="w-190">
                  <el-option label="全部" value="" />
                </el-select>
              </span>
              <span><span class="w-65 inline-block text-right">适用层次：</span>
                <el-select v-model="listQuery.cengci" clearable size="small" multiple placeholder="请选择适用层次" class="w-190">
                  <el-option label="全部" value="" />
                </el-select>
              </span>
            </div>
            <div class="flex flex-justify-space-between mb-20">
              <span><span class="w-65 inline-block text-right">关键词：</span>
                <el-input v-model="listQuery.keywords" clearable size="small" placeholder="请填写关键词" class="w-190" />
              </span>
              <span><span class="w-65 inline-block text-right">知识点：</span>
                <el-input v-model="listQuery.knowledge_point" clearable size="small" class="w-190" />
              </span>
            </div>
            <div class="flex flex-justify-space-between mb-20">
              <span><span class="w-65 inline-block text-right">资源个数：</span>
                <el-input v-model="listQuery.resources_from" clearable size="small" class="w-80" /> -
                <el-input v-model="listQuery.resources_to" clearable size="small" class="w-80" />
              </span>
              <span><span class="w-65 inline-block text-right">活动个数：</span>
                <el-input v-model="listQuery.active_from" clearable size="small" class="w-80" /> -
                <el-input v-model="listQuery.active_to" clearable size="small" class="w-80" />
              </span>
            </div>
            <div class="flex flex-justify-space-between mb-20">
              <span><span class="w-65 inline-block text-right">来源：</span>
                <el-select v-model="listQuery.source" clearable size="small" multiple placeholder="请选择来源" class="w-190">
                  <el-option label="全部" value="" />
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
        <div class="fr">
          <el-button size="small" type="primary" @click="handleExport">
            导出
          </el-button>
        </div>
      </div>
      <el-table
        v-loading="listLoading"
        size="mini"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="封面" width="" prop="thumb" align="center">
          <template slot-scope="{row}">
            <img v-if="row.thumb" :src="row.thumb" alt="">
            <img v-else src="../../../assets/image/avatar.gif" alt="" style="width: 20px;height: 20px">
          </template>
        </el-table-column>
        <el-table-column label="课程名称" prop="title" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="课程分类" prop="cate" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="适用层次" prop="cengci" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="关键字" prop="keywords" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="资源" prop="resources" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="活动" prop="active" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="来源" prop="source" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="操作" width="110" align="center">
          <template slot-scope="{row}">
            <el-button type="text" size="mini" @click="watch(row)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" class="text-center" :total="total" :page.sync="pageQuery.page" :limit.sync="pageQuery.page_size" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import Pagination from '@/components/Pagination'
export default {
  name: 'TeacherClass',
  components: { Pagination },
  directives: { elDragDialog, waves },
  data() {
    return {
      searchState: false,
      listLoading: false,
      listQuery: {
        cate: [],
        cengci: [],
        keywords: '',
        knowledge_point: '',
        resources_from: '',
        resources_to: '',
        active_from: '',
        active_to: '',
        source: ''
      },
      list: [],
      total: 0,
      pageQuery: {
        page: 1,
        page_size: 10
      }
    }
  },
  computed: {
    title() {
      return this.$route.meta.title
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.list = [
        { thumb: '', title: '基础会计', cate: '税法', cengci: '中职', keywords: '设计', resources: '32', active: '13', source: '浪潮易云' },
        { thumb: '', title: '基础会计', cate: '出纳实务', cengci: '高职', keywords: '课程，视频', resources: '32', active: '13', source: '浪潮易云' },
        { thumb: '', title: '基础会计', cate: '财务会计', cengci: '本科', keywords: '课程', resources: '12', active: '22', source: '浪潮易云' },
        { thumb: '', title: '基础会计', cate: '财务会计', cengci: '中职', keywords: '人文', resources: '32', active: '13', source: '浪潮易云' },
        { thumb: '', title: '基础会计', cate: '基础会计', cengci: '中职', keywords: '设计', resources: '30', active: '33', source: '浪潮易云' },
        { thumb: '', title: '基础会计', cate: '会计电算化', cengci: '中职', keywords: '设计', resources: '32', active: '44', source: '浪潮易云' },
        { thumb: '', title: '基础会计', cate: '管理会计', cengci: '中职', keywords: '人文', resources: '32', active: '13', source: '浪潮易云' },
        { thumb: '', title: '基础会计', cate: '管理会计', cengci: '中职', keywords: '设计', resources: '30', active: '13', source: '浪潮易云' },
        { thumb: '', title: '基础会计', cate: '管理会计', cengci: '中职', keywords: '人文', resources: '32', active: '75', source: '浪潮易云' },
        { thumb: '', title: '基础会计', cate: '管理会计', cengci: '中职', keywords: '设计', resources: '40', active: '13', source: '浪潮易云' },
        { thumb: '', title: '基础会计', cate: '管理会计', cengci: '中职', keywords: '课程', resources: '32', active: '13', source: '浪潮易云' }
      ]
      this.listLoading = false
      this.total = this.list.length
    },
    watch() {},
    handleExport() {}
  }
}
</script>

<style lang="scss" scoped>

</style>
