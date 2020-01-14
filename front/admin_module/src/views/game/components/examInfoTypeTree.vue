<template>
  <div class="industryType">
    <div style="height: 350px;overflow-y: auto">
      <el-table
        v-loading="listProveTypeLoading"
        class="mb-10"
        size="mini"
        :data="listProveType"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="编号" type="index" width="80" align="center" />
        <el-table-column label="考试分类" prop="category_title" width="" align="center">
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-input v-model="row.category_title" size="mini" />
            </template>
            <span v-else>{{ row.category_title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="{ row }">
            <el-button v-if="row.edit" type="text" size="mini" @click="saveEdit(row)">保存</el-button>
            <el-button v-if="row.edit" type="text" size="mini" @click="row.edit = false">取消</el-button>
            <el-button v-else type="text" size="mini" @click="row.edit = true">编辑</el-button>
            <el-button type="text" size="mini" @click="industryTypeDel(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getMatchCategoryList, getMatchCategoryAdd, getMatchCategoryDel } from '@/api/game'
export default {
  name: 'ExamInfoTypeTree',
  data() {
    return {
      listProveTypeLoading: false,
      listProveType: []
    }
  },
  mounted() {
    this.setsetPaperList() // 获取考试分类列表
    this.getIndustryTypeList() // 查询试卷分类
  },
  methods: {
    // 考试分类弹窗内-保存
    saveEdit(row) {
      if (row.category_title === '') {
        this.$message.warning('请填写考试分类名称')
      } else {
        var data = {}
        var msg = ''
        if (row.id === undefined || row.id === null) {
          // 新增
          data = { category_title: row.category_title }
          msg = '新增成功'
        } else {
          // 编辑
          data = { id: row.id, category_title: row.category_title }
          msg = '修改成功'
        }
        getMatchCategoryAdd(data).then(res => {
          this.$message.success(msg)
          this.setsetPaperList()
        })
      }
    },
    // 考试分类弹窗内初始化
    getIndustryTypeList() {
      // 增加编辑行
      this.listIndustryType = this.listProveType
      // 添个字段判断是否处于编辑的状态中
      this.listIndustryType.map(v => {
        this.$set(v, 'edit', false)
        return v
      })
      this.listIndustryType.push({
        category_title: '',
        edit: true
      })
      this.listIndustryTypeLoading = false
    },
    // 删除考试分类
    industryTypeDel(id) {
      if (id !== undefined) {
        this.$confirm('确定要删除当前的行业类型吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          getMatchCategoryDel({ id: [id] }).then(response => {
            this.$message.success('删除成功')
            this.setsetPaperList()
          })
        }).catch(() => {
          console.log('cancel')
        })
      }
    },
    // 获取考试分类列表
    setsetPaperList() {
      getMatchCategoryList().then(res => {
        this.listProveType = res.data.data
        this.getIndustryTypeList() // 考试分类弹窗内初始化
      })
    }
  }
}
</script>
<style>
  .examTypeTree .el-input--mini .el-input__inner{
    height: 20px;
    line-height: 20px;
  }
</style>
<style lang="scss" scoped>
  .examTypeTree{
    /*border-top: solid 1px #EBEBEB;*/
    height: 350px;
    overflow-y: auto;
  }
  .tree-icon-blue{
    color: #84CDED;
    font-weight: bold
  }
  .tree-icon-orange{
    color: #F5CD1D;
    font-weight: bold
  }
  .tree-icon-red{
    color: #F85832;
    font-weight: bold
  }
  .tree-icon-green{
    color: #7CCB40;
  }
</style>
