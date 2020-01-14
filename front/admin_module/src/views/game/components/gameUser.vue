<template>
  <div class="game-user">
    <div class="filter-container">
      <div class="search-more fl mr-20" @click="searchState = !searchState">
        <span>高级搜索</span>
        <i :class="searchState?'el-icon-arrow-up':'el-icon-arrow-down'" />
      </div>
      <el-collapse-transition>
        <div v-show="searchState" class="search-more-content">
          <div class="mb-20 fl w-half">
            <span class="w-80 inline-block text-right">姓名：</span>
            <el-input v-model="listQuery.name" size="small" clearable placeholder="请输入考生姓名" class="w-190" />
          </div>
          <div class="mb-20 fl w-half text-right">
            <span class="w-80 inline-block text-right">性别：</span>
            <el-select v-model="listQuery.sex" placeholder="请选择考生性别" size="small" clearable class="w-190">
              <el-option label="男" value="1" />
              <el-option label="女" value="2" />
            </el-select>
          </div>
          <div class="mb-20 fl" style="width: 100%;">
            <span class="w-80 inline-block text-right">报名时间：</span>
            <el-date-picker
              v-model="listQuery.signupdatetime"
              class="pl-15"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              style="width: 85.8%;"
              value-format="yyyy-MM-dd HH:mm:ss"
              end-placeholder="结束日期"
            />
          </div>
          <div class="mb-20 fl w-half">
            <span class="w-80 inline-block text-right">所属机构：</span>
            <el-input v-model="listQuery.orgname" size="small" clearable placeholder="考生所属机构全称" class="w-190" />
          </div>
          <div class="fl w-half text-right">
            <el-button size="mini" type="primary" @click="getList">
              查询
            </el-button>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="mb-12 h-30">
      <span>
        <el-button size="mini" type="primary" @click="export2Excel">
          导出比赛人员信息
        </el-button>
      </span>
    </div>
    <div class="con-table">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="account" label="用户账号" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="sex" label="性别" width="50">
          <template slot-scope="scope">
            <span v-if="scope.row.sex == 1">男</span>
            <span v-else>女</span>
          </template>
        </el-table-column>
        <el-table-column prop="tel" label="手机号" />
        <el-table-column prop="orgname" label="所属机构" />
        <el-table-column prop="signupdatetime" label="报名时间" />
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameUser',
  data() {
    return {
      searchState: false,
      gameName: '', // 比赛名称
      gameId: '', // 比赛id
      listQuery: {
        name: '', // 考生姓名
        sex: '', // 考生性别
        orgname: '', // 所属机构
        signupdatetime: [] // 报名时间
      },
      tableData: [
        {
          id: 1,
          account: 'zhangsan',
          name: '司徒张三',
          sex: 1,
          tel: '13333333333',
          orgname: '山东建筑大学',
          signupdatetime: '2019-7-31 09:00:00'
        },
        {
          id: 2,
          account: 'lisi',
          name: '东方李四',
          sex: 1,
          tel: '13333333334',
          orgname: '山东建筑大学',
          signupdatetime: '2019-7-31 09:00:00'
        },
        {
          id: 3,
          account: 'wangwu',
          name: '南宫王武',
          sex: 1,
          tel: '13333333335',
          orgname: '山东建筑大学',
          signupdatetime: '2019-7-31 09:00:00'
        },
        {
          id: 4,
          account: 'zhaoliu',
          name: '诸葛赵柳',
          sex: 2,
          tel: '13333333335',
          orgname: '山东建筑大学',
          signupdatetime: '2019-7-31 09:00:00'
        }
      ]
    }
  },
  methods: {
    getList() {
      console.log(123)
    },
    // 导出成excel表格
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    export2Excel() {
      var newlist = this.tableData
      for (var i = 0; i < newlist.length; i++) {
        if (newlist[i].sex === 1) {
          newlist[i].sex = '男'
        } else {
          newlist[i].sex = '女'
        }
      }
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['编号', '账号', '姓名', '性别', '手机号', '所属机构', '报名时间']
        const filterVal = ['id', 'account', 'name', 'sex', 'tel', 'orgname', 'signupdatetime']
        const list = newlist
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.gameName + '-考生信息表',
          autoWidth: true,
          bookType: 'xlsx'
        })
      })
    }
  }
}
</script>

<style scoped>
  .game-user{
    min-height: 300px;
  }
  .w-half {
    width: 50%;
  }
</style>
