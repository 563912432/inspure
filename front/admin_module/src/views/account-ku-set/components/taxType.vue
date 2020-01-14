<template>
  <div class="taxType">
    <div style="height: 350px;overflow-y: auto">
      <el-table
        class="mb-10"
        size="mini"
        :data="listData"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="编号" type="index" width="50" align="center" />
        <el-table-column label="税种" prop="title" width="" align="center">
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-input v-model="row.title" size="mini" />
            </template>
            <span v-else>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="税率" prop="tax" width="" align="center">
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-input v-model="row.tax" size="mini" />
            </template>
            <span v-else>{{ row.tax }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="{ row, column, $index }">
            <el-button v-if="row.edit" type="text" size="mini" @click="saveEdit(row, column, $index)">保存</el-button>
            <el-button v-if="row.edit" type="text" size="mini" @click="row.edit = false">取消</el-button>
            <el-button v-else type="text" size="mini" @click="row.edit = true">编辑</el-button>
            <el-button type="text" size="mini" @click="taxTypeDel(row, column, $index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
export default {
  name: 'TaxType',
  directives: { elDragDialog },
  props: {
  },
  data() {
    return {
      listData: []
    }
  },
  mounted() {
    this.getTaxTypeList()
  },
  methods: {
    // 取税种列表
    getTaxTypeList() {
      const data = this.$store.getters.accountAnswer.bgInfo.taxCate
      console.log(data)
      this.listData = []
      if (data.length > 0) {
        data.forEach(v => {
          this.listData.push({
            title: v.title,
            tax: v.tax,
            edit: false
          })
        })
      }
      this.listData.push({
        title: '',
        tax: '',
        edit: true
      })
    },
    // 保存税种
    saveEdit(row, column, index) {
      if (row.title === '' || row.tax === '') {
        this.$message.warning('请填写税种')
      } else {
        if (this.listData.length === (index + 1)) {
          // 新增
          const data = []
          this.listData.forEach(v => {
            data.push({
              title: v.title,
              tax: v.tax
            })
          })
          this.$store.commit('account/SAVE_TAX', data)
          this.$message.success('新增成功')
          this.getTaxTypeList()
          this.$root.$emit('changeCate')
        } else {
          // 编辑
          const data = this.listData
          data.splice(data.length - 1, 1)
          this.$store.commit('account/SAVE_TAX', data)
          this.$message.success('编辑成功')
          this.getTaxTypeList()
          this.$root.$emit('changeCate')
        }
      }
    },
    // 删除部门分类信息
    taxTypeDel(row, column, index) {
      if (this.listData.length === (index + 1)) {
        // 最后一行 清除数据
        this.$set(row, 'title', '')
        this.$set(row, 'tax', '')
      } else {
        this.$confirm('确定要删除当前的税种吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const data = this.listData
          data.splice(data.length - 1, 1)
          data.splice(index, 1)
          this.$store.commit('account/SAVE_TAX', data)
          this.$message.success('删除成功')
          this.getTaxTypeList()
          this.$root.$emit('changeCate')
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
