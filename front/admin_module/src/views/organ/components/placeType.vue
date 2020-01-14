<template>
  <div class="placeType">
    <div style="height: 350px;overflow-y: auto">
      <el-table
        v-loading="listPlaceTypeLoading"
        class="mb-10"
        size="mini"
        :data="listPlaceType"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="编号" type="index" width="80" align="center" />
        <el-table-column label="场地类型" prop="type_name" width="">
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-input v-model="row.type_name" size="mini" />
            </template>
            <span v-else>{{ row.type_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="{ row }">
            <el-button v-if="row.edit" type="text" size="mini" @click="saveEdit(row)">保存</el-button>
            <el-button v-if="row.edit" type="text" size="mini" @click="row.edit = false">取消</el-button>
            <el-button v-else type="text" size="mini" @click="row.edit = true">编辑</el-button>
            <el-button type="text" size="mini" @click="placeTypeDel(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { fetchListPlaceType, handleAdd, handleDel } from '@/api/organ'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
export default {
  name: 'PlaceType',
  directives: { elDragDialog },
  data() {
    return {
      listPlaceTypeLoading: false,
      listPlaceType: []
    }
  },
  mounted() {
    this.getPlaceTypeList()
  },
  methods: {
    // 取场地类型列表
    getPlaceTypeList() {
      this.listPlaceTypeLoading = true
      fetchListPlaceType().then(response => {
        this.listPlaceType = response.data
        // 添个字段判断是否处于编辑的状态中
        this.listPlaceType.map(v => {
          this.$set(v, 'edit', false)
          return v
        })
        this.listPlaceType.push({
          type_name: '',
          edit: true
        })
        this.listPlaceTypeLoading = false
      })
    },
    // 保存场地类型
    saveEdit(row) {
      if (row.type_name === '') {
        this.$message.warning('请填写场地内容')
      } else {
        let data = {}
        let message = ''
        if (row.id === undefined || row.id === null) {
          // 新增
          data = { type_name: row.type_name }
          message = '新增成功'
        } else {
          // 编辑
          data = { id: row.id, type_name: row.type_name }
          message = '编辑成功'
        }
        handleAdd(data).then(response => {
          this.$message.success(message)
          this.getPlaceTypeList()
        })
      }
    },
    // 删除场地分类信息
    placeTypeDel(id) {
      if (id !== undefined) {
        this.$confirm('确定要删除当前的场地类型吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          handleDel({ id: id }).then(response => {
            this.$message.success('删除成功')
            this.getPlaceTypeList()
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
