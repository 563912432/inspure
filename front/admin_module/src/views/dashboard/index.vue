<template>
  <div class="dashboard">
    <el-row :gutter="10">
      <el-col :span="6">
        <div class="header flex flex-column flex-align-center flex-justify-center">
          <span class="f-15">客观题总数</span>
          <span class="f-30 number">1892</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="header flex flex-column flex-align-center flex-justify-center">
          <span class="f-15">账套总数</span>
          <span class="f-30 number">133</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="header flex flex-column flex-align-center flex-justify-center">
          <span class="f-15">机构总数</span>
          <span class="f-30 number">214</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="header flex flex-column flex-align-center flex-justify-center">
          <span class="f-15">今日开通模块数</span>
          <span class="f-30 number">10</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12" class="mt-10">
        <el-card class="box-card" shadow="none" :body-style="{ padding: '0px' }">
          <div slot="header" class="clearfix">
            <span class="card-title">客观题综合正确率</span>
          </div>
          <div id="obj-statistic">
            <el-row :gutter="20">
              <el-col :span="24">
                <HorizontalChart :width="'100%'" :height="'400px'" />
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" class="mt-10">
        <el-card class="box-card" shadow="none" :body-style="{ padding: '0px' }">
          <div slot="header" class="clearfix">
            <span class="card-title">账套综合正确率</span>
          </div>
          <div id="account-statistic">
            <el-row :gutter="20">
              <el-col :span="24">
                <ColumnChart :width="'100%'" :height="'400px'" />
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" class="mt-10">
        <el-card class="box-card" shadow="none" :body-style="{ padding: '0px' }">
          <div slot="header" class="clearfix">
            <span class="card-title">机构用户购买排行 Top 5</span>
          </div>
          <div id="buy-statistic">
            <el-row :gutter="20">
              <el-col :span="24" class="pt-20">
                <el-table
                  v-loading="listLoading"
                  class="dashboard-table"
                  size="mini"
                  :data="list"
                  highlight-current-row
                  style="width: 100%;margin-left: 20px;"
                >
                  <el-table-column label="排名" type="index" align="center" />
                  <el-table-column label="账号" prop="admin" align="center" width="" />
                  <el-table-column label="名称" prop="name" align="center" width="" />
                  <el-table-column label="模块库" prop="moduleKu" align="center" width="" />
                  <el-table-column label="题库" prop="tiKu" align="center" width="" />
                  <el-table-column label="账套库" prop="accountKu" align="center" />
                </el-table>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import ColumnChart from './components/ColumnChart' // base on element-ui
import HorizontalChart from './components/HorizontalChart' // base on element-ui
export default {
  name: 'Dashboard',
  components: { ColumnChart, HorizontalChart },
  data() {
    return {
      listLoading: false,
      list: []
    }
  },
  created() {
    this.getList()
  },
  mounted() {
  },
  methods: {
    getList() {
      this.listLoading = true
      this.list = [
        { index: 1, admin: '1231', name: '济南汉城公司1', moduleKu: '20', tiKu: '20', accountKu: '15' },
        { index: 2, admin: '1232', name: '济南汉城公司1', moduleKu: '15', tiKu: '15', accountKu: '15' },
        { index: 3, admin: '1233', name: '济南汉城公司1', moduleKu: '10', tiKu: '10', accountKu: '10' },
        { index: 4, admin: '1234', name: '济南汉城公司1', moduleKu: '10', tiKu: '10', accountKu: '10' },
        { index: 5, admin: '1235', name: '济南汉城公司1', moduleKu: '5', tiKu: '3', accountKu: '2' }
      ]
      this.listLoading = false
    }
  }
}
</script>
<style>
  .dashboard .el-card{
    border: none;
  }
  .dashboard .el-table th{
    background-color: #3A81D6;
    color: #ffffff;
  }
  .dashboard .dashboard-table td{
    border-bottom: none;
  }
</style>
<style lang="scss" scoped>
  .dashboard {
    background-color: #F2F2F2;
    .header{
      height: 150px;
      background-color: #3A81D6;
      color: #ffffff;
      .number{
        font-weight: 700;
        margin-top: 5px;
      }
    }
    .box-card{
      height: 480px;
      .card-title{
        font-size: 14px;
        color: #3A81D6;
      }
    }
  }

</style>
