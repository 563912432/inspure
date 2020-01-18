<template>
  <div class="teachingPackageIndex">
    <!--教学包信息-->
    <div class="w-100p">
      <div class="filter-container">
        <Header :title="title" class="fl mr-20" />
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
              <span><span class="w-65 inline-block text-right">知识点：</span>
                <el-input v-model="listQuery.knowledge_point" clearable size="small" class="w-190" />
              </span>
              <span><span class="w-65 inline-block text-right">视频个数：</span>
                <el-input v-model="listQuery.video_from" clearable size="small" class="w-80" /> -
                <el-input v-model="listQuery.video_to" clearable size="small" class="w-80" />
              </span>
            </div>
            <div class="flex flex-justify-space-between mb-20">
              <span><span class="w-65 inline-block text-right">课件个数：</span>
                <el-input v-model="listQuery.course_from" clearable size="small" class="w-80" /> -
                <el-input v-model="listQuery.course_to" clearable size="small" class="w-80" />
              </span>
              <span><span class="w-65 inline-block text-right">活动个数：</span>
                <el-input v-model="listQuery.active_from" clearable size="small" class="w-80" /> -
                <el-input v-model="listQuery.active_to" clearable size="small" class="w-80" />
              </span>
            </div>
            <div class="flex flex-justify-space-between mb-20">
              <span><span class="w-65 inline-block text-right">引用次数：</span>
                <el-input v-model="listQuery.yinyong_from" clearable size="small" class="w-80" /> -
                <el-input v-model="listQuery.yinyong_to" clearable size="small" class="w-80" />
              </span>
              <span><span class="w-65 inline-block text-right">是否连载：</span>
                <el-select v-model="listQuery.is_serialize" clearable size="small" multiple placeholder="请选择是否连载" class="w-190">
                  <el-option label="全部" value="" />
                </el-select>
              </span>
            </div>
            <div class="flex flex-justify-space-between mb-20">
              <span><span class="w-65 inline-block text-right">关键词：</span>
                <el-input v-model="listQuery.keywords" clearable size="small" placeholder="请填写关键词" class="w-190" />
              </span>
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
      </div>
      <div class="clear-float" />
      <div class="mb-12 mt-12">
        <el-button size="small" plain icon="el-icon-setting" @click="handleDictionaryItem">
          字典项设置
        </el-button>
        <span class="fr">
          <el-button size="small" type="primary" @click="handleExport">
            导出
          </el-button>
          <el-button size="small" plain @click="handleAdd">
            创建教学包
          </el-button>
        </span>
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
            <img v-else src="../../assets/image/avatar.gif" alt="" style="width: 20px;height: 20px">
          </template>
        </el-table-column>
        <el-table-column label="教学包名称" prop="title" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="编号" prop="num" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="课程分类" prop="cate" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="适用层次" prop="cengci" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="知识点" prop="knowledge_point" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="视频" prop="video" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="课件" prop="course" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="活动" prop="active" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="来源" prop="source" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="引用次数" prop="yinyong" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="是否连载" prop="is_serialize" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="操作" width="110" align="center">
          <template slot-scope="{row}">
            <el-button type="text" size="mini" @click="edit(row)">
              编辑
            </el-button>
            <el-button type="text" size="mini" @click="del(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" class="text-center" :total="total" :page.sync="pageQuery.page" :limit.sync="pageQuery.page_size" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import Header from '../common/header'
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import Pagination from '@/components/Pagination'
export default {
  name: 'TeachingPackageIndex',
  components: { Header, Pagination },
  directives: { elDragDialog, waves },
  data() {
    return {
      searchState: false,
      listLoading: false,
      listQuery: {
        cate: [],
        cengci: [],
        knowledge_point: '',
        video_from: '',
        video_to: '',
        course_from: '',
        course_to: '',
        active_from: '',
        active_to: '',
        yinyong_from: '',
        yinyong_to: '',
        is_serialize: '',
        keywords: '',
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
        { thumb: '', title: '基础会计', num: '1001', cate: '税法', cengci: '中职', knowledge_point: '设计', video: '32', course: '23', active: '13', source: '浪潮易云', yinyong: '873', is_serialize: '是' },
        { thumb: '', title: '基础会计', num: '1002', cate: '出纳实务', cengci: '高职', knowledge_point: '课程，视频', video: '32', course: '11', active: '13', source: '浪潮易云', yinyong: '873', is_serialize: '是' },
        { thumb: '', title: '基础会计', num: '1003', cate: '财务会计', cengci: '本科', knowledge_point: '课程', video: '12', course: '23', active: '22', source: '浪潮易云', yinyong: '873', is_serialize: '是' },
        { thumb: '', title: '基础会计', num: '1004', cate: '财务会计', cengci: '中职', knowledge_point: '人文', video: '32', course: '22', active: '13', source: '浪潮易云', yinyong: '873', is_serialize: '否' },
        { thumb: '', title: '基础会计', num: '1005', cate: '基础会计', cengci: '中职', knowledge_point: '设计', video: '30', course: '23', active: '33', source: '浪潮易云', yinyong: '1873', is_serialize: '是' },
        { thumb: '', title: '基础会计', num: '1006', cate: '会计电算化', cengci: '中职', knowledge_point: '设计', video: '32', course: '31', active: '44', source: '浪潮易云', yinyong: '1231', is_serialize: '否' },
        { thumb: '', title: '基础会计', num: '1007', cate: '管理会计', cengci: '中职', knowledge_point: '人文', video: '32', course: '23', active: '13', source: '浪潮易云', yinyong: '873', is_serialize: '是' },
        { thumb: '', title: '基础会计', num: '1008', cate: '管理会计', cengci: '中职', knowledge_point: '设计', video: '30', course: '11', active: '13', source: '浪潮易云', yinyong: '1231', is_serialize: '否' },
        { thumb: '', title: '基础会计', num: '1009', cate: '管理会计', cengci: '中职', knowledge_point: '人文', video: '32', course: '40', active: '75', source: '浪潮易云', yinyong: '873', is_serialize: '是' },
        { thumb: '', title: '基础会计', num: '1010', cate: '管理会计', cengci: '中职', knowledge_point: '设计', video: '40', course: '23', active: '13', source: '浪潮易云', yinyong: '1100', is_serialize: '否' },
        { thumb: '', title: '基础会计', num: '1011', cate: '管理会计', cengci: '中职', knowledge_point: '课程', video: '32', course: '23', active: '13', source: '浪潮易云', yinyong: '873', is_serialize: '是' }
      ]
      this.listLoading = false
      this.total = this.list.length
    },
    handleDictionaryItem() {
      this.$router.push('dictionaryItem')
    },
    handleExport() {},
    handleAdd() {
      this.$router.push('createPackage')
    },
    edit() {},
    del() {}
  }
}
</script>

<style lang="scss" scoped>

</style>
