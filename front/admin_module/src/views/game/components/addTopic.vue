<template>
  <div class="selectTopic">
    <div class="filter-container">
      <div class="search-more fl mr-20" @click="searchState = !searchState">
        <span>高级搜索</span>
        <i :class="searchState?'el-icon-arrow-up':'el-icon-arrow-down'" />
      </div>
      <el-collapse-transition>
        <div v-show="searchState" class="search-more-content">
          <div class="mb-20 fl w-half text-right">
            <span class="w-80 inline-block text-right">知识点：</span>
            <el-input v-model="listQuery.knowledge_point_id" size="small" clearable placeholder="请输入知识点" class="w-190" />
          </div>
          <div class="mb-20 fl w-half text-right">
            <span class="w-80 inline-block text-right">难度：</span>
            <el-select v-model="listQuery.difficulty_id" placeholder="请选择题目类型" size="small" clearable class="w-190">
              <el-option v-for="(item,index) in difficultys" :key="index" :label="item.difficulty" :value="item.id" />
            </el-select>
          </div>
          <div class="text-right">
            <el-button size="mini" type="primary" @click="setTopicList">
              查询
            </el-button>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <!--题目列表部分-->
    <el-table
      ref="topicLists"
      v-loading="listLoading"
      :data="topicList"
      border
      size="mini"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="30" align="center" />
      <el-table-column prop="type_name" label="题型" width="80" align="center" />
      <el-table-column prop="title" label="题目" width="" :show-overflow-tooltip="true" align="left">
        <template slot-scope="scope">
          {{ scope.row.title.replace(/&lt;[^&gt;]+&gt;/g, "" ) }}
        </template>
      </el-table-column>
      <el-table-column prop="knowledge_point_id" label="知识点" width="100" align="center">
        <template slot-scope="scope">
          <span v-for="(item,index) in scope.row.knowledge_points" :key="index">{{ item.knowledge_point }}</span>
        </template>
      </el-table-column>
      <el-table-column label="难度" width="50" align="center">
        <template slot-scope="{ row }">
          <span>{{ row['difficulty']?row['difficulty']['difficulty']: '' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="更新时间" width="140" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.created_at | formatDate }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <pagination :total="total" class="text-center" :page.sync="pageQuery.page" :limit.sync="pageQuery.page_size" @pagination="setTopicList" />
    <div class="text-right mt-10">
      <el-button size="mini" type="primary" @click="saveCheck">保存</el-button>
    </div>
  </div>
</template>

<script>
import { getTkList, getDifficultyList } from '@/api/game'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'AddTopic',
  components: { Pagination },
  filters: {
    formatDate: function(value) {
      const date = new Date(value * 1000)
      const y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
    }
  },
  props: {
    // 要筛选的题型
    topicType: {
      type: Number,
      required: true
    },
    // 已选中项
    topicCheck: {
      type: Object,
      required: true,
      defaults: {}
    }
  },
  data() {
    return {
      // topicType: '', // 要筛选的题型
      // topicCheck: [], // 已选中项
      searchState: false,
      listQuery: {
        knowledge_point_id: '', // 知识点
        difficulty_id: '' // 难度
      },
      // 题目列表
      topicList: [],
      // 列表选中项
      multipleSelection: [],
      tmselect: {},
      // 分页控件数据
      total: 400, // 分页总条数
      pageQuery: {
        page: 1,
        page_size: 10
      },
      listLoading: false,
      difficultys: [] // 题目难度选项
    }
  },
  created() {
    this.setTopicList()
    this.getDifficultyList() // 查询题目难度
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = { ...val }
    },
    // 保存勾选后的题
    saveCheck() {
      if (Object.keys(this.multipleSelection).length !== 0) {
        for (var i = 0; i < Object.keys(this.multipleSelection).length; i++) {
          this.tmselect[this.multipleSelection[i].id] = this.multipleSelection[i]
        }
      }

      var data = {}
      data['tmItem'] = this.tmselect
      data['key'] = this.topicType
      data[this.topicType] = {}
      var tmSelect = this.tmselect
      if (this.topicType !== 6) {
        for (var r = 0; r < Object.keys(tmSelect).length; r++) {
          data[this.topicType][Object.keys(tmSelect)[r]] = {
            time: 0,
            score: 0
          }
        }
      } else {
        for (var s = 0; r < Object.keys(tmSelect).length; r++) {
          data[this.topicType][Object.keys(tmSelect)[s]] = {}
        }
      }
      // console.log(data)
      this.$root.$emit('tmSelection', data)
      this.$message.success('保存成功')
    },
    // 同步勾选状态
    updateCheck() {
      var topicList = this.topicList
      setTimeout(() => {
        if (this.tmselect) {
          if (Object.keys(this.tmselect).length !== 0) {
            var attr = []
            for (var item in this.tmselect) {
              attr.push(parseInt(item))
            }

            topicList.forEach(row => {
              if (attr.indexOf(row.id) > -1) {
                this.$refs.topicLists.toggleRowSelection(row, true)
              }
            })
          }
        }
      })
    },
    // 根据题目类型获取题目信息
    setTopicList() {
      this.tmselect = this.topicCheck // 同步已勾选的数据

      if (Object.keys(this.multipleSelection).length !== 0) {
        for (var i = 0; i < Object.keys(this.multipleSelection).length; i++) {
          this.tmselect[this.multipleSelection[i].id] = this.multipleSelection[i]
        }
      }
      // console.log(this.tmselect) // 选中的集合，分页切换后不会变动
      this.listLoading = true
      var data = {}
      data['type'] = this.topicType

      // 获取题目列表
      getTkList(data, this.pageQuery).then(res => {
        this.total = res.data.total
        this.topicList = res.data.data
        this.listLoading = false
        this.updateCheck() // 同步勾选状态
      })
    },
    // 获取题目难度
    getDifficultyList() {
      getDifficultyList().then(res => {
        this.difficultys = res.data.data
      })
    }
  }
}
</script>

<style>
  /*.selectTopic .el-table:nth-child(2) .cell {*/
    /*text-align: center;*/
  /*}*/
  .selectTopic .el-table--border th:first-child .cell,
  .selectTopic .el-table--border td:first-child .cell {
    padding-left: 0px;
    padding-right: 0px;
    text-align: center;
  }
</style>
<style scoped>
  .selectTopic .w-half {
    width: 50%;
  }
</style>
