<template>
  <div class="DataAnalysisExamTiMu p-10">
    <div style="margin-bottom: 12px" class="border-e8">
      <div style="font-size: 20px;font-weight:bold;border-bottom: solid 1px #e8e8e8" class="p-10">初级会计上午考试-试题分析</div>
      <div class="p-10" style="border-bottom: solid 1px #e8e8e8">
        <div class="filter-container flex flex-justify-space-between flex-align-center">
          <div class="search-more fl mr-20" @click="searchState = !searchState">
            <span>高级搜索</span>
            <i :class="searchState?'el-icon-arrow-up':'el-icon-arrow-down'" />
          </div>
          <span>
            <el-button type="primary" size="small">导出</el-button>
          </span>
          <el-collapse-transition>
            <div v-show="searchState" class="search-more-content">
              <div class="mb-20">
                <span class="w-80 inline-block text-right">教学班：</span>
                <el-select v-model="listQuery.teachClass" placeholder="请选择教学班" size="small" clearable class="w-190">
                  <el-option label="全部" value="" />
                </el-select>
              </div>
              <div class="mb-20">
                <span class="w-80 inline-block text-right">题目类型：</span>
                <el-select v-model="listQuery.type" placeholder="请选择题目类型" size="small" clearable class="w-190">
                  <el-option label="全部" value="" />
                </el-select>
              </div>
              <div class="mb-20">
                <span class="w-80 inline-block text-right">难度：</span>
                <el-select v-model="listQuery.difficulty_id" placeholder="请选择难度" size="small" clearable class="w-190">
                  <el-option label="全部" value="" />
                </el-select>
              </div>
              <div class="mb-20">
                <span class="w-80 inline-block text-right">知识点：</span>
                <el-select v-model="listQuery.knowledge_point_id" placeholder="请选择知识点" size="small" clearable class="w-190">
                  <el-option label="全部" value="" />
                </el-select>
              </div>
              <div class="mb-20">
                <span class="w-80 inline-block text-right">来源：</span>
                <el-select v-model="listQuery.from" placeholder="请选择来源" size="small" clearable class="w-190">
                  <el-option label="全部" value="" />
                </el-select>
              </div>
              <div class="text-right">
                <el-button size="mini" type="primary" @click="getTiMuList">
                  查询
                </el-button>
              </div>
            </div>
          </el-collapse-transition>
        </div>
        <div>
          <el-table
            v-loading="tiMuLoading"
            size="mini"
            :data="tiMuTable"
            border
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column label="题型" width="" prop="type" align="center" />
            <el-table-column label="题目内容" width="" prop="content" align="" show-overflow-tooltip />
            <el-table-column label="正确人次" width="" prop="rightPeople" align="center" />
            <el-table-column label="答题人次" width="" prop="daTiPeople" align="center" />
            <el-table-column label="正确率/得分率" width="" prop="rate" align="center" />
          </el-table>
          <div class="f-13 p-10">
            <div class="flex flex-justify-space-between mt-10 mb-12">
              <div class="flex-1">答题情况</div><div class="w-190">比率</div>
            </div>
            <div class="flex flex-justify-space-between flex-align-center line-30">
              <div class="flex-1"><span class="circle text-white bg-blue border-blue">A</span> 企业从事花卉种植的所得，减半征收企业所得税</div>
              <div class="w-190"><el-progress :percentage="30" /></div>
            </div>
            <div class="flex flex-justify-space-between flex-align-center line-30">
              <div class="flex-1"><span class="circle">B</span> 企业从事花卉种植的所得，减半征收企业所得税</div>
              <div class="w-190"><el-progress :percentage="20" /></div>
            </div>
            <div class="flex flex-justify-space-between flex-align-center line-30">
              <div class="flex-1"><span class="circle">C</span> 企业从事花卉种植的所得，减半征收企业所得税</div>
              <div class="w-190"><el-progress :percentage="40" /></div>
            </div>
            <div class="flex flex-justify-space-between flex-align-center line-30">
              <div class="flex-1"><span class="circle">D</span> 企业从事花卉种植的所得，减半征收企业所得税</div>
              <div class="w-190"><el-progress :percentage="10" /></div>
            </div>
          </div>
          <pagination v-show="tiMuTotal>0" class="text-center" :total="tiMuTotal" :page.sync="pageQueryTiMu.page" :limit.sync="pageQueryTiMu.page_size" @pagination="getTiMuList" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
export default {
  name: 'DataAnalysisExamTiMu',
  components: { Pagination },
  data() {
    return {
      searchState: false,
      listQuery: {
        teachClass: '',
        type: '',
        difficulty_id: '',
        knowledge_point_id: '',
        from: ''
      },
      tiMuTable: [],
      tiMuTotal: 3,
      pageQueryTiMu: {
        page: 1,
        page_size: 10
      },
      tiMuLoading: false,
      contrastValue: ''
    }
  },
  created() {
    this.getTiMuList()
  },
  methods: {
    getTiMuList() {
      this.tiMuLoading = true
      this.tiMuTable = [
        { type: '单选题', content: ' 企业从事花卉种植的所得，减半征收企业所得税', rightPeople: '10', daTiPeople: '3', rate: '2' },
        { type: '多选题', content: '根据契税法律制度的规定，下列行为中，应征收契税的是（）', rightPeople: '10', daTiPeople: '3', rate: '1' },
        { type: '简答题', content: '根据支付结算法律制度的规定，关于委托收款结算方式的下列表述，正确的有（）', rightPeople: '10', daTiPeople: '3', rate: '3' },
        { type: '单选题', content: '企业从事花卉种植的所得，减半征收企业所得税', rightPeople: '10', daTiPeople: '3', rate: '2' }
      ]
      this.tiMuTotal = 3
      this.tiMuLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .DataAnalysisExamTiMu{
    position: relative;
    .line-30{
      line-height: 30px;
    }
    .border-e8 {
      border: solid 1px #e8e8e8;
    }
    .circle{
      display: inline-block;
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      border-radius: 50%;
      border: solid 1px #999999;
    }
    .text-white {
      color: #ffffff;
    }
    .bg-blue{
      background-color: #008DFF;
    }
    .border-blue {
      border-color: #008DFF!important;
    }
  }
</style>
