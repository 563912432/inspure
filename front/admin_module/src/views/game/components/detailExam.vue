<template>
  <div class="DetailExam">
    <div class="flex flex-justify-space-between f-14 col-333 p-10 bold mb-10 mt-10">
      <div>考试名称：初级会计实务期末考试</div>
      <div>考试类型：2019学第一学期期末考试</div>
      <div>考试时间：2019-07-12 14:00 至 2019-07-12 16:00</div>
    </div>
    <div class="filter-container pl-10">
      <div class="search-more" @click="searchState = !searchState">
        <span>高级搜索</span>
        <i :class="searchState?'el-icon-arrow-up':'el-icon-arrow-down'" />
      </div>
      <el-collapse-transition>
        <div v-show="searchState" class="search-more-content">
          <div class="flex flex-justify-space-between mb-20">
            <span><span class="w-65 inline-block text-right">姓名：</span>
              <el-input v-model="listQuery.name" size="mini" class="w-190" />
            </span>
            <span><span class="w-65 inline-block text-right">学号：</span>
              <el-input v-model="listQuery.number" size="mini" class="w-190" />
            </span>
          </div>
          <div class="flex flex-justify-space-between mb-20">
            <span><span class="w-65 inline-block text-right">年级：</span>
              <el-select v-model="listQuery.grade" size="mini" placeholder="请选择" class="w-190">
                <el-option label="全部" value="" />
              </el-select>
            </span>
            <span><span class="w-65 inline-block text-right">院系：</span>
              <el-select v-model="listQuery.branch" size="mini" placeholder="请选择" class="w-190">
                <el-option label="全部" value="" />
              </el-select>
            </span>
          </div>
          <div class="flex flex-justify-space-between mb-20">
            <span><span class="w-65 inline-block text-right">专业：</span>
              <el-select v-model="listQuery.zhuanye" placeholder="请选择" size="mini" clearable class="w-190">
                <el-option label="全部" value="" />
              </el-select>
            </span>
            <span><span class="w-65 inline-block text-right">行政班：</span>
              <el-select v-model="listQuery.class" size="mini" placeholder="请选择" clearable class="w-190">
                <el-option label="全部" value="" />
              </el-select>
            </span>
          </div>
          <div class="flex flex-justify-space-between mb-20">
            <span><span class="w-65 inline-block text-right">教学班：</span>
              <el-select v-model="listQuery.teachClass" placeholder="请选择" size="mini" clearable class="w-190">
                <el-option label="全部" value="" />
              </el-select>
            </span>
            <span><span class="w-65 inline-block text-right">是否及格：</span>
              <el-select v-model="listQuery.isPass" size="mini" placeholder="请选择" clearable class="w-190">
                <el-option label="全部" value="" />
              </el-select>
            </span>
          </div>
          <div class="flex mb-20">
            <span><span class="w-65 inline-block text-right">考试时间：</span>
              <el-date-picker
                v-model="listQuery.time"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </span>
          </div>
          <div class="flex">
            <span><span class="w-65 inline-block text-right">分数区间：</span>
              <el-input v-model="listQuery.fromScore" size="mini" class="w-190" /> 至
              <el-input v-model="listQuery.toScore" size="mini" class="w-190" />
            </span>
          </div>
          <div class="text-right">
            <el-button size="mini" type="primary" @click="getList">
              查询
            </el-button>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="text-right mb-12" style="padding-right: 10px">
      <el-button size="small" type="primary" @click="choseExam">选择考试</el-button>
      <el-button size="small" plain @click="important">导出</el-button>
      <el-button size="small" plain @click="del">删除</el-button>
    </div>
    <div style="min-height: 300px">
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
        <el-table-column label="学号" width="80" prop="number" align="center" />
        <el-table-column label="姓名" width="80" prop="name" align="center" />
        <el-table-column label="年级" width="80" prop="grade" align="center" />
        <el-table-column label="院系" width="" prop="branch" align="center" />
        <el-table-column label="专业" width="80" prop="zhuanye" align="center" />
        <el-table-column label="行政班" width="" prop="class" align="center" />
        <el-table-column label="教学班" width="" prop="teachClass" align="center" />
        <el-table-column label="分数" width="80" prop="score" align="center" />
        <el-table-column label="及格" width="80" prop="isPass" align="center" />
        <el-table-column label="强制交卷" prop="isForce" width="80" align="center" />
        <el-table-column label="交卷时间" prop="submitTime" width="150" align="center" />
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="{ row }">
            <el-button type="text" size="mini" @click="score(row.id)">判分</el-button>
            <el-button type="text" size="mini">下载</el-button>
            <el-button type="text" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" class="text-center" :total="total" :page.sync="pageQuery.page" :limit.sync="pageQuery.page_size" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'DetailExam',
  components: { Pagination },
  data() {
    return {
      searchState: false,
      total: 4,
      pageQuery: {
        page: 1,
        page_size: 10
      },
      listQuery: {
        name: '',
        number: '',
        grade: '',
        branch: '',
        zhuanye: '',
        class: '',
        teachClass: '',
        isPass: '',
        time: '',
        fromScore: '',
        toScore: ''
      },
      listLoading: false,
      list: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.list = [
        { id: 1, name: '杨蕾', number: '14011', grade: '2018级', branch: '会计学院', zhuanye: '会计学', class: '会计18-1', teachClass: '初级合班-1', isPass: '是', score: '100', isForce: '是', submitTime: '2019-07-01 15:35：01' },
        { id: 2, name: '杨蕾', number: '14011', grade: '2018级', branch: '会计学院', zhuanye: '会计学', class: '会计18-1', teachClass: '初级合班-1', isPass: '是', score: '100', isForce: '是', submitTime: '2019-07-01 15:35：01' },
        { id: 3, name: '杨蕾', number: '14011', grade: '2018级', branch: '会计学院', zhuanye: '会计学', class: '会计18-1', teachClass: '初级合班-1', isPass: '是', score: '100', isForce: '是', submitTime: '2019-07-01 15:35：01' }
      ]
    },
    choseExam() {
      // this.$store.dispatch('teachClass/saveSearchResult', '1')
      this.$router.push('/game/correction/1')
    },
    important() {},
    del() {},
    score(id) {
      this.$router.push('/game/judge/' + id)
    }
  }
}
</script>

<style scoped>

</style>
