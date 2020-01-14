<template>
  <div class="award">
    <div class="filter-container">
      <Header :title="title" class="fl mr-20" />
      <el-input v-model="listQuery.title" size="mini" clearable placeholder="请输入证书名称" class="w-190">
        <el-button slot="append" icon="el-icon-search" @click="getList" />
      </el-input>
      <el-select v-model="listQuery.cert" clearable size="mini" class="w-190" placeholder="请选择证书类型" @change="getList">
        <el-option
          v-for="item in certType"
          :key="item.id"
          :label="item.category_title"
          :value="item.id"
        />
      </el-select>
    </div>
    <div class="con-table">
      <el-table
        size="mini"
        :data="awardList"
        border
        style="width: 100%"
      >
        <el-table-column prop="title" label="证书名称" width="" />
        <el-table-column prop="type" label="证书类型" width="" />
        <el-table-column prop="num" label="已发放数量" />
        <el-table-column prop="no_num" label="未发放数量" />
        <el-table-column label="操作" width="" align="center">
          <template>
            <el-button type="text" size="mini">证书发放</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <pagination :total="total" class="text-center" :page.sync="pageQuery.page" :limit.sync="pageQuery.page_size" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import { getCertCategoryList } from '@/api/game'
import Header from '@/views/common/header-span'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'AwardCertificate',
  components: { Header, Pagination },
  data() {
    return {
      searchState: false,
      listQuery: {
        title: '', // 证书名称
        cert: '' // 证书类型
      },
      certType: [], // 证书类型
      // 证书列表
      awardList: [
        {
          id: 1,
          title: '资格证书A',
          type: '类型1',
          num: 10,
          no_num: 30
        },
        {
          id: 2,
          title: '资格证书B',
          type: '类型1',
          num: 10,
          no_num: 30
        },
        {
          id: 3,
          title: '资格证书C',
          type: '类型2',
          num: 10,
          no_num: 30
        }
      ],
      // 分页控件
      total: 400, // 总条数
      pageQuery: {
        page: 1,
        page_size: 10
      }
    }
  },
  computed: {
    title() {
      return '证书发放管理'
    }
  },
  mounted() {
    this.getList()
    this.getCertCategory()
  },
  methods: {
    getList() {
      console.log('查询')
      this.total = this.awardList.length
    },
    // 获取证书类型
    getCertCategory() {
      getCertCategoryList().then(res => {
        this.certType = res.data
      })
    }
  }
}
</script>

<style>
  .award .con-table .el-table__row td{
    text-align: center;
  }
</style>
<style scoped>

</style>
