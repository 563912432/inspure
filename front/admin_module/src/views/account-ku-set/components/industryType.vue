<template>
  <div class="industryType">
    <div style="height: 350px;overflow-y: auto">
      <el-table
        v-loading="listIndustryTypeLoading"
        class="mb-10"
        size="mini"
        :data="listIndustryType"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="编号" type="index" width="80" align="center" />
        <el-table-column label="行业类型" prop="industry_name" width="" align="center">
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-input v-model="row.industry_name" size="mini" />
            </template>
            <span v-else>{{ row.industry_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否启用" width="100" align="center">
          <template slot-scope="{row}">
            <el-tooltip :content="row.enable?'开启': '关闭'" placement="top">
              <el-switch
                v-model="row.enable"
                active-color="#55A625"
                inactive-color="#999999"
                :active-value="1"
                :inactive-value="0"
                @change="saveEnable(row.id, row.enable)"
              />
            </el-tooltip>
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
import { fetchListIndustryType, handleIndustryAdd, handleIndustryDel, handleEnableSave } from '@/api/accountKu'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
export default {
  name: 'IndustryType',
  directives: { elDragDialog },
  data() {
    return {
      listIndustryTypeLoading: false,
      listIndustryType: []
    }
  },
  mounted() {
    this.getIndustryTypeList()
  },
  methods: {
    // 取行业类型列表
    getIndustryTypeList() {
      this.listIndustryTypeLoading = true
      fetchListIndustryType().then(response => {
        this.listIndustryType = response.data
        // 添个字段判断是否处于编辑的状态中
        this.listIndustryType.map(v => {
          this.$set(v, 'edit', false)
          return v
        })
        this.listIndustryType.push({
          industry_name: '',
          enable: 1,
          edit: true
        })
        this.listIndustryTypeLoading = false
      })
    },
    // 保存行业类型
    saveEdit(row) {
      if (row.industry_name === '') {
        this.$message.warning('请填写行业内容')
      } else {
        let data = {}
        let message = ''
        if (row.id === undefined || row.id === null) {
          // 新增
          data = { industry_name: row.industry_name, enable: 1 }
          message = '新增成功'
        } else {
          // 编辑
          data = { id: row.id, industry_name: row.industry_name }
          message = '编辑成功'
        }
        handleIndustryAdd(data).then(response => {
          this.$message.success(message)
          this.getIndustryTypeList()
        })
      }
    },
    // 删除行业分类信息
    industryTypeDel(id) {
      if (id !== undefined) {
        this.$confirm('确定要删除当前的行业类型吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          handleIndustryDel({ id: id }).then(response => {
            this.$message.success('删除成功')
            this.getIndustryTypeList()
          })
        }).catch(() => {
          console.log('cancel')
        })
      }
    },
    // 保存启用状态
    saveEnable(id, enable) {
      if (id) {
        handleEnableSave({ id: id, enable: enable }).then(response => {
          this.$message.success('状态保存成功')
          this.getIndustryTypeList()
        })
      } else {
        this.$message.warning('没有操作的行业')
      }
    }
  }
}
</script>

<style scoped>

</style>
