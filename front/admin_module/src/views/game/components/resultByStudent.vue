<template>
  <div class="resultByStudent bg-white box-shadow">
    <div class="title">选择考生</div>
    <div class="filter-container flex flex-align-center">
      <div class="search-more mr-20" @click="searchState = !searchState">
        <span>高级搜索</span>
        <i :class="searchState?'el-icon-arrow-up':'el-icon-arrow-down'" />
      </div>
      <el-collapse-transition>
        <div v-show="searchState" class="search-more-content">
          <div class="flex flex-justify-space-between mb-2010">
            <span><span class="w-65 inline-block text-right">姓名：</span>
              <el-input v-model="listQuery.name" size="mini" class="w-190" />
            </span>
            <span><span class="w-65 inline-block text-right">学号：</span>
              <el-input v-model="listQuery.number" size="mini" class="w-190" />
            </span>
          </div>
          <div class="flex flex-justify-space-between mb-20">
            <span><span class="w-65 inline-block text-right">性别：</span>
              <el-select v-model="listQuery.sex" size="mini" placeholder="请选择" class="w-190">
                <el-option label="全部" value="" />
              </el-select>
            </span>
            <span><span class="w-65 inline-block text-right">年级：</span>
              <el-select v-model="listQuery.grade" size="mini" placeholder="请选择" class="w-190">
                <el-option label="全部" value="" />
              </el-select>
            </span>
          </div>
          <div class="flex flex-justify-space-between mb-20">
            <span><span class="w-65 inline-block text-right">院系：</span>
              <el-select v-model="listQuery.branch" placeholder="请选择" size="mini" clearable class="w-190">
                <el-option label="全部" value="" />
              </el-select>
            </span>
            <span><span class="w-65 inline-block text-right">专业：</span>
              <el-select v-model="listQuery.zhuanye" size="mini" placeholder="请选择" clearable class="w-190">
                <el-option label="全部" value="" />
              </el-select>
            </span>
          </div>
          <div class="flex flex-justify-space-between mb-20">
            <span><span class="w-65 inline-block text-right">行政班：</span>
              <el-select v-model="listQuery.class" placeholder="请选择" size="mini" clearable class="w-190">
                <el-option label="全部" value="" />
              </el-select>
            </span>
            <span>
              <el-button size="mini" type="primary" @click="getList">
                查询
              </el-button>
            </span>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="table-content">
      <el-table
        v-loading="listLoading"
        size="mini"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @selection-change="chosePaper"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column label="学号" width="" prop="number" align="center" />
        <el-table-column label="姓名" width="" prop="name" align="center" />
        <el-table-column label="性别" width="" prop="sex" align="center" />
        <el-table-column label="手机号" width="" prop="tel" align="center" />
        <el-table-column label="年级" width="" prop="grade" align="center" />
        <el-table-column label="院系" width="" prop="branch" align="center" />
        <el-table-column label="专业" width="" prop="zhuanye" align="center" />
        <el-table-column label="行政班" width="" prop="class" align="center" />
      </el-table>
    </div>
    <pagination v-show="total>0" class="text-center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <div class="h-30 text-right">
      <el-button class="mr-20" size="mini" type="primary" @click="searchPaper">确定</el-button>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'ResultByStudent',
  components: { Pagination },
  data() {
    return {
      listQuery: {
        name: '',
        number: '',
        sex: '',
        grade: '',
        branch: '',
        zhuanye: '',
        class: '',
        page: 1,
        limit: 10
      },
      listLoading: false,
      list: [],
      total: 3,
      searchState: false
    }
  },
  computed: {
    examTypeList() {
      return this.$store.getters.examTypeList
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.list = [
        { number: '001', name: '杨志', sex: '男', tel: '15275969277', grade: '2018级', branch: '商学院', zhuanye: '会计学', class: '18财管3班' },
        { number: '002', name: '杨志', sex: '男', tel: '15275969277', grade: '2018级', branch: '商学院', zhuanye: '会计学', class: '18财管3班' },
        { number: '003', name: '杨志', sex: '男', tel: '15275969277', grade: '2018级', branch: '商学院', zhuanye: '会计学', class: '18财管3班' }
      ]
    },
    // 重置
    resetPaper() {},
    // 搜索
    searchPaper() {
      this.$router.push('/game/resultSearchDetail/second')
    },
    chosePaper() {}
  }
}
</script>

<style lang="scss" scoped>
  .resultByStudent{
    width: 100%;
    height: 100%;
    .search-more-content {
      top: 45px;
    }
    .title{
      height: 50px;
      line-height: 50px;
      font-size: 20px;
      color: #333333;
      text-align: center;
      background-color: #EEEEEE;
    }
    .filter-container{
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
      border-bottom: solid 1px #EEEEEE;
    }
    .table-content{
      height: 280px;
      padding: 20px;
      overflow-y: auto;
    }
  }
</style>
