<template>
  <div class="DetailStudent">
    <div class="flex flex-justify-space-between f-14 col-333 p-10 bold mb-10 mt-10">
      <div>学号：14011</div>
      <div>姓名：杨蕾</div>
      <div>年级：2018级</div>
      <div>院系：会计专业</div>
      <div>专业：会计学</div>
      <div>行政班：会计08-1</div>
    </div>
    <div class="filter-container pl-10">
      <div class="search-more" @click="searchState = !searchState">
        <span>高级搜索</span>
        <i :class="searchState?'el-icon-arrow-up':'el-icon-arrow-down'" />
      </div>
      <el-collapse-transition>
        <div v-show="searchState" class="search-more-content">
          <div class="flex flex-justify-space-between mb-20">
            <span><span class="w-65 inline-block text-right">考试名称：</span>
              <el-input v-model="listQuery.name" size="mini" class="w-190" />
            </span>
            <span><span class="w-65 inline-block text-right">考试分类：</span>
              <el-input v-model="listQuery.cate" size="mini" class="w-190" />
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
          <div class="flex mb-20">
            <span><span class="w-65 inline-block text-right">分数区间：</span>
              <el-input v-model="listQuery.fromScore" size="mini" class="w-190" /> 至
              <el-input v-model="listQuery.toScore" size="mini" class="w-190" />
            </span>
          </div>
          <div class="flex flex-justify-space-between mb-20">
            <span><span class="w-65 inline-block text-right">是否及格：</span>
              <el-select v-model="listQuery.isPass" size="mini" placeholder="请选择" clearable class="w-190">
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
    <div class="text-right mb-12" style="padding-right: 10px">
      <el-button size="small" type="primary" @click="choseStudent">选择考生</el-button>
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
        <el-table-column label="考试名" width="" prop="name" align="center" />
        <el-table-column label="分类" width="80" prop="cate" align="center" />
        <el-table-column label="分数" width="80" prop="score" align="center" />
        <el-table-column label="及格" width="80" prop="isPass" align="center" />
        <el-table-column label="强制交卷" prop="isForce" width="80" align="center" />
        <el-table-column label="交卷时间" prop="submitTime" width="200" align="center" />
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
  name: 'DetailStudent',
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
        { id: 1, name: '初级会计实务期末考试', cate: '考试分类', isPass: '是', score: '100', isForce: '是', submitTime: '2019-07-01 15:35：01' },
        { id: 2, name: '初级会计实务期末考试', cate: '考试分类', isPass: '是', score: '100', isForce: '是', submitTime: '2019-07-01 15:35：01' },
        { id: 3, name: '初级会计实务期末考试', cate: '考试分类', isPass: '是', score: '100', isForce: '是', submitTime: '2019-07-01 15:35：01' }
      ]
    },
    choseStudent() {
      // this.$store.dispatch('teachClass/saveSearchResult', '2')
      this.$router.push('/game/correction/2')
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
  .DetailStudent{
    padding: 15px;
  }
</style>
