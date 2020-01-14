<template>
  <div class="branchType">
    <div style="height: 350px;overflow-y: auto">
      <el-table
        v-loading="listBranchTypeLoading"
        class="mb-10"
        size="mini"
        :data="listBranchType"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="编号" type="index" width="80" align="center" />
        <el-table-column label="部门类型" prop="group_name" width="">
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-input v-model="row.group_name" size="mini" />
            </template>
            <span v-else>{{ row.group_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="{ row }">
            <el-button v-if="row.edit" type="text" size="mini" @click="saveEdit(row)">保存</el-button>
            <el-button v-if="row.edit" type="text" size="mini" @click="row.edit = false">取消</el-button>
            <el-button v-else type="text" size="mini" @click="row.edit = true">编辑</el-button>
            <el-button type="text" size="mini" @click="branchTypeDel(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { fetchListBranchType, handleAdd, handleDel } from '@/api/auth'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
export default {
  name: 'BranchType',
  directives: { elDragDialog },
  data() {
    return {
      listBranchTypeLoading: false,
      listBranchType: []
    }
  },
  mounted() {
    this.getBranchTypeList()
  },
  methods: {
    // 取部门类型列表
    getBranchTypeList() {
      this.listBranchTypeLoading = true
      fetchListBranchType().then(response => {
        this.listBranchType = response.data
        // 添个字段判断是否处于编辑的状态中
        this.listBranchType.map(v => {
          this.$set(v, 'edit', false)
          return v
        })
        this.listBranchType.push({
          group_name: '',
          edit: true
        })
        this.listBranchTypeLoading = false
      })
    },
    // 保存部门类型
    saveEdit(row) {
      if (row.group_name === '') {
        this.$message.warning('请填写部门类型')
      } else {
        let data = {}
        if (row.id === undefined || row.id === null) {
          // 新增
          data = { group_name: row.group_name }
        } else {
          // 编辑
          data = { id: row.id, group_name: row.group_name }
        }
        handleAdd(data).then(response => {
          if (data.id) {
            this.$message.success('编辑成功')
          } else {
            this.$message.success('新增成功')
          }
          this.getBranchTypeList()
        })
      }
    },
    // 删除部门分类信息
    branchTypeDel(id) {
      if (id !== undefined) {
        this.$confirm('确定要删除当前的部门类型吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          handleDel({ id: id }).then(response => {
            this.$message.success('删除成功')
            this.getBranchTypeList()
          })
        }).catch(() => {
          console.log('cancel')
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
