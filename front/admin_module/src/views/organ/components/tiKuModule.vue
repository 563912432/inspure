<template>
  <div class="tiKuModule flex">
    <div class="content-left-patent">
      <div class="content-left-up">
        <el-table
          ref="moduleTable"
          v-loading="dataLoading"
          :data="moduleData"
          tooltip-effect="dark"
          highlight-current-row
          style="width: 100%"
          size="mini"
          @row-click="choseLine"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="模块名称" width="" prop="module_name" align="center" show-overflow-tooltip />
          <el-table-column label="操作" width="130" align="center">
            <template slot-scope="{ row }">
              <el-button type="text" size="mini" @click.stop="saveModulePoint(row.id)">保存</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content-left-down">
        <span class="border-top-right flex-1">
          <el-button type="text" size="mini" @click="handleAdd">新增</el-button>
        </span>
        <span class="border-top-right flex-1">
          <el-button type="text" size="mini" @click="handleUpdate">修改</el-button>
        </span>
        <span class="border-top flex-1">
          <el-button type="text" size="mini" @click="handleDel()">删除</el-button>
        </span>
      </div>
    </div>
    <div class="content-right flex-1">
      <div class="flex flex-align-center mb-12">
        <el-input v-model="listQuery.knowledge_point" size="mini" clearable placeholder="请输入知识点名称" class="mr-20 w-300">
          <el-button slot="append" icon="el-icon-search" @click="getPointList(formData.id)" />
        </el-input>
      </div>
      <div class="flex-1" style="height: 350px;overflow-y: auto">
        <!--<el-checkbox v-model="checked">只显示已选择项</el-checkbox>-->
        <el-table
          ref="pointTable"
          v-loading="tableLoading"
          :data="tableData"
          size="mini"
          row-key="id"
          :reserve-selection="true"
          border
          @select="selectRows"
          @select-all="selectAllRows"
        >
          <el-table-column type="selection" align="center" />
          <el-table-column align="center" label="知识点" prop="knowledge_point" />
          <el-table-column align="center" label="题目数量" prop="num" />
        </el-table>
      </div>
      <!--分页-->
      <pagination v-show="total > 0" layout="total, prev, pager, next" :total="total" :page.sync="pageQuery.page" :limit.sync="pageQuery.limit" @pagination="getPointList(formData.id)" />
    </div>
    <!--模块弹窗-->
    <el-dialog v-el-drag-dialog width="450px" :modal="false" :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @dragDialog="handleDrag">
      <el-form ref="moduleForm" :rules="rules" :model="formData" label-position="left" label-width="85px">
        <el-form-item label="模块名称" prop="module_name">
          <el-input v-model="formData.module_name" clearable size="mini" />
        </el-form-item>
      </el-form>
      <div ref="module-div" slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="saveModule('moduleForm')">
          保存
        </el-button>
        <el-button size="small" plain @click="cancelModule">
          返回
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchListTiKuModule, handleDelTiKu, handleModulePoint, handleAddTiKu, fetchTiKuPoint } from '@/api/organ'
import { fetchListPoint } from '@/api/objKu'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'TiKuModule',
  components: { Pagination },
  directives: { elDragDialog },
  data() {
    return {
      moduleData: [],
      dataLoading: false,
      tableData: [],
      formData: {
        module_name: ''
      },
      rules: {
        module_name: [{ required: true, message: '模块名称必须填写', trigger: 'blur' }]
      },
      textMap: {
        add: '新增模块',
        update: '编辑模块'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      tableLoading: false,
      total: 0,
      listQuery: {
        knowledge_point: ''
      },
      pageQuery: {
        page: 1,
        limit: 10
      },
      multipleSelection: [],
      multipleSelectionStr: '',
      choseRows: []
    }
  },
  created() {
    this.getPointList()
    this.getList()
  },
  methods: {
    getList() {
      this.dataLoading = true
      fetchListTiKuModule().then(response => {
        this.moduleData = response.data
        // 选中第一行
        this.$refs['moduleTable'].setCurrentRow(this.moduleData[0])
        this.$nextTick(() => {
          // 取第一行关联知识点
          if (this.moduleData && this.moduleData.length > 0) {
            this.getTiKuPoint(this.moduleData[0].id)
            this.formData.id = this.moduleData[0].id
            // 选中左侧关联模块
            const data = this.$store.getters.tiKuModule
            if (data && data.length > 0) {
              this.moduleData.forEach(row => {
                if (data.indexOf(row.id) > -1) {
                  this.$refs.moduleTable.toggleRowSelection(row)
                }
              })
            } else {
              this.$refs.moduleTable.clearSelection()
            }
          }
        })
        this.dataLoading = false
      })
    },
    recoverSelect() {
      setTimeout(() => {
        this.tableData.forEach(row => {
          if (this.choseRows.indexOf(row.id) > -1) {
            this.$refs['pointTable'].toggleRowSelection(row)
          }
        })
      }, 100)
    },
    // 取知识点列表
    getPointList(id = '') {
      this.tableLoading = true
      fetchListPoint(this.listQuery, this.pageQuery).then(response => {
        this.tableData = response.data.data
        this.total = response.data.total
        this.tableLoading = false
      })
      if (id) {
        this.getTiKuPoint(id)
      }
    },
    // 取模块关联的知识点
    getTiKuPoint(id) {
      fetchTiKuPoint({ id: id }).then(response => {
        response.data.forEach(v => {
          if (this.choseRows.indexOf(v) === -1) {
            this.choseRows.push(v)
          }
        })
        this.recoverSelect()
      })
    },
    // 新增模块
    handleAdd() {
      this.formData = {
        module_name: ''
      }
      this.dialogStatus = 'add'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['moduleForm'].clearValidate()
      })
    },
    // 编辑模块
    handleUpdate() {
      if (!this.formData.id || this.formData.id === '') {
        this.$message.warning('请先选择模块')
      } else {
        this.formData = this.moduleData.find(v => {
          return v.id === this.formData.id
        })
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['moduleForm'].clearValidate()
        })
      }
    },
    // 删除模块
    handleDel() {
      if (!this.formData.id || this.formData.id === '') {
        this.$message.warning('请先选择模块')
      } else {
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          handleDelTiKu({ id: this.formData.id }).then(response => {
            this.$message.success('删除成功')
            this.getList()
          })
        }).catch(() => {
          console.log('cancel')
        })
      }
    },
    // 选中行
    choseLine(row) {
      this.$refs.pointTable.clearSelection()
      this.formData = Object.assign(row)
      this.choseRows = []
      this.getTiKuPoint(this.formData.id)
    },
    // 选中
    handleSelectionChange(value) {
      // 主线存储 todo
      this.$store.commit('account/SET_TIKU', value)
    },
    // 选中单个checkbox
    selectRows(selection, row) {
      const selected = selection.length && selection.indexOf(row) !== -1
      if (selected) {
        // 选中的时候没有，填进去
        if (this.choseRows.indexOf(row.id) === -1) {
          this.choseRows.push(row.id)
        }
      } else {
        // 取消选中, 如果有，踢出来
        const index = this.choseRows.indexOf(row.id)
        if (index > -1) {
          this.choseRows.splice(index, 1)
        }
      }
    },
    // 全部选中checkbox
    selectAllRows(selection) {
      if (selection.length === 0) {
        // 取消全选
        this.tableData.forEach(value => {
          const index = this.choseRows.indexOf(value.id)
          if (index > -1) {
            this.choseRows.splice(index, 1)
          }
        })
      } else {
        // 全选
        this.tableData.forEach(value => {
          if (this.choseRows.indexOf(value.id) === -1) {
            this.choseRows.push(value.id)
          }
        })
      }
    },
    // 保存模块和知识点关联
    saveModulePoint(id) {
      if (this.formData.id !== id) {
        this.$message.warning('请选择需要绑定的模块')
      } else {
        const str = this.choseRows.join(',')
        handleModulePoint({ module_id: this.formData.id, knowledge_ids: str }).then(response => {
          this.$message.success('保存成功')
        })
      }
    },
    // 保存模块
    saveModule(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          handleAddTiKu(this.formData).then(response => {
            if (this.formData.id) {
              this.$message.success('编辑成功')
            } else {
              this.$message.success('保存成功')
            }
            this.dialogFormVisible = false
            this.getList()
          })
        }
      })
    },
    // 取消模块
    cancelModule() {
      this.dialogFormVisible = false
    },
    handleDrag() {
      this.$refs['module-div'].blur()
    }
  }
}
</script>
<style>
  .content-right .el-pagination{
    text-align: center;
  }
  .content-right .pagination-container[data-v-72233bcd]{
    padding: 0;
  }
  .content-right .pagination-container{
    margin-top: 5px;
  }
</style>
<style lang="scss" scoped>
  .tiKuModule{
    height: 450px;
    overflow-y: auto;
    .content-left-patent{
      width: 300px;
      height: 100%;
      border: 1px solid #D7D7D7;
      /*overflow-y: auto;*/
      display: flex;
      flex-direction: column;
      .content-left-up{
        flex: 1;
        overflow-y: auto;
        span{
          color: #333333;
          font-size: 14px;
          padding: 10px;
        }
        .span-active{
          background-color: #7CCB40;
        }
      }
      .content-left-down{
        display: flex;
        height: 30px;
        span{
          height: 30px;
          line-height: 30px;
          padding: 0 15px;
          text-align: center;
        }
        .border-top-right{
          border-width: 1px;
          border-color: #d7d7d7;
          border-style: solid solid none none
        }
        .border-top{
          border-width: 1px;
          border-color: #d7d7d7;
          border-style: solid none none none
        }
      }
    }
    .content-right{
      margin-left: 20px;
      flex: 1;
      height: 100%;
      overflow-y: hidden;
    }
  }
</style>
