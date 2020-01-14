<template>
  <div class="assignUser">
    <Header :title="title" :is-back-show="true" :path-url="'/auth/authRole'" />
    <div class="flex bg-white pt-10 w-100p">
      <div class="flex-1" style="overflow-x: auto">
        <div class="text-center f-15 col-333 ft-weight-bold mb-20">用户列表</div>
        <div class="filter-container mb-12">
          <el-input v-model="listLeftQuery.number" size="small" clearable placeholder="请输入工号" class="w-150 mr-20">
            <el-button slot="append" icon="el-icon-search" @click="getListLeft" />
          </el-input>
          <el-input v-model="listLeftQuery.username" size="small" clearable placeholder="请输入姓名" class="w-150 mr-20">
            <el-button slot="append" icon="el-icon-search" @click="getListLeft" />
          </el-input>
        </div>
        <!--table-->
        <div class="w-100p">
          <el-table
            v-loading="leftLoading"
            size="mini"
            :data="listFrom"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            @selection-change="checkLeftAll"
          >
            <el-table-column type="selection" align="center" width="50" />
            <el-table-column label="工号" width="" prop="number" align="center" />
            <el-table-column label="姓名" width="" prop="username" align="center" />
            <el-table-column label="启用" width="50" prop="enable" align="center">
              <template slot-scope="{ row }">
                {{ row.enable?'是':'否' }}
              </template>
            </el-table-column>
            <el-table-column label="所属院系" width="" prop="department_id" align="center" />
          </el-table>
        </div>
        <pagination v-show="leftTotal>0" class="text-center" :total="leftTotal" :page.sync="leftPageQuery.page" :limit.sync="leftPageQuery.limit" @pagination="getListLeft" />
      </div>
      <div class="flex flex-column flex-justify-center flex-align-center" style="width: 60px">
        <el-button type="primary" size="small" :disabled="listFrom.length <=0 " icon="el-icon-arrow-right" circle class="mb-20" @click="handelSelect" />
        <el-button type="primary" size="small" :disabled="listResult.length <= 0" icon="el-icon-arrow-left" circle style="margin-left: 0" @click="handleRemoveSelect" />
      </div>
      <div class="flex-1" style="overflow-x: auto">
        <div class="text-center f-15 col-333 ft-weight-bold mb-20">已分配用户列表</div>
        <div class="filter-container">
          <el-input v-model="listRightQuery.number" size="small" clearable placeholder="请输入工号" class="w-150 mr-20">
            <el-button slot="append" icon="el-icon-search" @click="getListRight" />
          </el-input>
          <el-input v-model="listRightQuery.username" size="small" clearable placeholder="请输入姓名" class="w-150 mr-20">
            <el-button slot="append" icon="el-icon-search" @click="getListRight" />
          </el-input>
        </div>
        <div class="w-100p">
          <el-table
            size="mini"
            :data="listResult"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            @selection-change="checkRightAll"
          >
            <el-table-column type="selection" align="center" width="50" />
            <el-table-column label="工号" width="" prop="number" align="center" />
            <el-table-column label="姓名" width="" prop="username" align="center" />
            <el-table-column label="启用" width="50" prop="enable" align="center">
              <template slot-scope="{ row }">
                {{ row.enable?'是':'否' }}
              </template>
            </el-table-column>
            <el-table-column label="所属院系" width="" prop="department_id" align="center" />
          </el-table>
        </div>
        <pagination v-show="rightTotal>0" class="text-center" :total="rightTotal" :page.sync="rightPageQuery.page" :limit.sync="rightPageQuery.limit" @pagination="getListRight" />
        <el-button class="mb-12" type="primary" size="mini" @click="saveAuth">
          保存
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchListNoAuthUser, fetchListHaveAuthUser, handleBindUser } from '@/api/auth'
import waves from '@/directive/waves' // waves directive
import Header from '../common/header'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'AssignUser',
  components: { Pagination, Header },
  directives: { waves, elDragDialog },
  data() {
    return {
      leftLoading: false,
      listLeftQuery: {
        number: '',
        username: ''
      },
      leftPageQuery: {
        page: 1,
        limit: 10
      },
      leftTotal: 0,
      listData: [],
      listFrom: [], // 操作的左侧数据
      listResult: [], // 操作的右侧数据
      listDataResult: [], // 右侧的不分页的数据
      nowSelectLeftData: [], // 左边选中列表数据
      nowSelectRightData: [], // 右边选中列表数据
      listRightQuery: {
        number: '',
        username: ''
      },
      rightPageQuery: {
        page: 1,
        limit: 10
      },
      rightTotal: 0
    }
  },
  computed: {
    authId() {
      return this.$route.params.id
    },
    isWorkList() {
      return this.$store.getters.isWorkList
    },
    title() {
      return this.$route.meta.title
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    // 左侧全选
    checkLeftAll(val) {
      this.nowSelectLeftData = val
    },
    // 右侧选中全部
    checkRightAll(val) {
      this.nowSelectRightData = val
    },
    // 左侧穿梭
    handelSelect() {
      // 右侧数据
      this.listResult = this.handleConcatArr(this.listResult, this.nowSelectLeftData)
      this.listDataResult = this.handleConcatArr(this.listDataResult, this.nowSelectLeftData)
      this.rightTotal = this.listDataResult.length
      this.getListRight()
      // 左侧数据
      this.handleRemoveTabList(this.nowSelectLeftData, this.listFrom)
      this.handleRemoveTabList(this.nowSelectLeftData, this.listData)
      if (this.nowSelectLeftData.length >= this.leftPageQuery.limit && this.leftPageQuery.page > 1) {
        this.leftPageQuery.page--
      }
      this.getListLeft()
      this.nowSelectLeftData = []
    },
    // 右侧穿梭
    handleRemoveSelect() {
      // 左侧数据
      this.listFrom = this.handleConcatArr(this.listFrom, this.nowSelectRightData)
      this.listData = this.handleConcatArr(this.listData, this.nowSelectRightData)
      this.leftTotal = this.listData.length
      this.getListLeft()
      // 右侧数据
      this.handleRemoveTabList(this.nowSelectRightData, this.listResult)
      this.handleRemoveTabList(this.nowSelectRightData, this.listDataResult)
      if (this.nowSelectRightData.length >= this.rightPageQuery.limit && this.rightPageQuery.page > 1) {
        this.rightPageQuery.page--
      }
      this.getListRight()
      this.nowSelectRightData = []
    },
    // 合并结果数组
    handleConcatArr(selectArr, nowSelectLeftData) {
      let arr = []
      arr = arr.concat(selectArr, nowSelectLeftData)
      return arr
    },
    // 拆减当前数组
    handleRemoveTabList(isNeedArr, originalArr) {
      if (isNeedArr.length && originalArr.length) {
        for (let i = 0; i < isNeedArr.length; i++) {
          for (let k = 0; k < originalArr.length; k++) {
            if (isNeedArr[i]['id'] === originalArr[k]['id']) {
              originalArr.splice(k, 1)
            }
          }
        }
      }
    },
    // 初始数据
    initData() {
      this.leftLoading = true
      fetchListNoAuthUser(this.listLeftQuery, this.leftPageQuery, { role_id: this.authId }).then(response => {
        this.listData = response.data.data
        this.listFrom = this.listData
        this.leftTotal = this.listData.length
        fetchListHaveAuthUser(this.listRightQuery, this.rightPageQuery, { role_id: this.authId }).then(response => {
          this.listDataResult = response.data.data ? response.data.data : []
          this.getListLeft()
          this.getListRight()
        })
        this.leftLoading = false
      })
    },
    // 取左侧列表数据
    getListLeft() {
      let data = this.listData
      // 学号
      if (this.listLeftQuery.number !== '') {
        this.listFrom = data.filter((item, index) =>
          item.number.search(this.listLeftQuery.number) !== -1
        )
        this.leftTotal = this.listFrom.length
        data = this.listFrom
        // 重置一下当前页面
        this.leftPageQuery.page = 1
      }
      // 姓名
      if (this.listLeftQuery.username !== '') {
        this.listFrom = data.filter((item, index) =>
          item.username.search(this.listLeftQuery.username) !== -1
        )
        this.leftTotal = this.listFrom.length
        data = this.listFrom
        // 重置一下当前页面
        this.leftPageQuery.page = 1
      }
      // else {
      //   this.leftTotal = data.length
      // }
      this.listFrom = data.filter((item, index) =>
        index < this.leftPageQuery.limit * this.leftPageQuery.page && index >= this.leftPageQuery.limit * (this.leftPageQuery.page - 1)
      )
    },
    // 取右侧列表数据
    getListRight() {
      let data = this.listDataResult
      // 学号
      if (this.listRightQuery.number !== '') {
        this.listResult = data.filter((item, index) =>
          item.number.search(this.listRightQuery.number) !== -1
        )
        this.rightTotal = this.listResult.length
        data = this.listResult
        // 重置一下当前页面
        this.rightPageQuery.page = 1
      }
      // 姓名
      if (this.listRightQuery.username !== '') {
        this.listResult = data.filter((item, index) =>
          item.username.search(this.listRightQuery.username) !== -1
        )
        this.rightTotal = this.listResult.length
        data = this.listResult
        // 重置一下当前页面
        this.rightPageQuery.page = 1
      } else {
        this.rightTotal = data.length
      }
      this.listResult = data.filter((item, index) =>
        index < this.rightPageQuery.limit * this.rightPageQuery.page && index >= this.rightPageQuery.limit * (this.rightPageQuery.page - 1)
      )
    },
    // 保存全部
    saveAuth() {
      const arr = []
      this.listResult.forEach(v => {
        arr.push(v.id)
      })
      handleBindUser({ role_id: this.authId, admin_ids: arr }).then(response => {
        this.$message.success('分配成功')
        this.initData()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .assignUser{
    position: relative;
  }
</style>
