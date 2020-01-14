<template>
  <div class="functionModule flex">
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
          <el-table-column label="操作" width="130" prop="module_name" align="center">
            <template slot-scope="{ row }">
              <el-button type="text" size="mini" @click="saveModuleMenu(row.id)">保存</el-button>
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
          <el-button type="text" size="mini" @click="handleDel">删除</el-button>
        </span>
      </div>
    </div>
    <div class="content-right-border">
      <el-tree
        ref="tree"
        v-loading="treeMenuLoading"
        :data="treeMenuData"
        show-checkbox
        default-expand-all
        node-key="id"
        highlight-current
        @check-change="getCheckedMenu"
      >
        <span slot-scope="{ data }">
          <span class="ml-10">{{ data.menu_title }}</span>
        </span>
      </el-tree>
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
import { fetchFunModuleMenu, fetchListFunModule, fetchListMenuTree, handleAddModule, handleDelModule, handleMenuModule } from '@/api/organ'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
export default {
  name: 'FunctionModule',
  directives: { elDragDialog },
  data() {
    return {
      moduleData: [],
      dataLoading: false,
      treeMenuLoading: false,
      treeMenuData: [],
      choseLineIds: '',
      choseMenuIdsArr: [],
      choseMenuIds: '',
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
      choseKeys: []
    }
  },
  watch: {
    choseKeys(value) {
      this.$refs['tree'].setCheckedKeys(value)
    }
  },
  created() {
    this.getMenuList()
    this.getList()
  },
  methods: {
    getList() {
      this.dataLoading = true
      fetchListFunModule().then(response => {
        this.moduleData = response.data
        // 选中第一行
        this.$refs['moduleTable'].setCurrentRow(this.moduleData[0])
        this.$nextTick(() => {
          // 取第一行关联菜单
          if (this.moduleData && this.moduleData.length > 0) {
            this.getModuleMenu(this.moduleData[0].id)
            this.formData.id = this.moduleData[0].id
            const data = this.$store.getters.module
            if (data && data.length > 0) {
              this.moduleData.forEach(v => {
                if (data.indexOf(v.id) > -1) {
                  this.toggleSelection(v)
                }
              })
            } else {
              this.$refs.moduleTable.clearSelection()
            }
          }
          this.dataLoading = false
        })
      })
    },
    toggleSelection(row) {
      this.$refs.moduleTable.toggleRowSelection(row)
    },
    // 取菜单列表
    getMenuList() {
      this.treeMenuLoading = true
      fetchListMenuTree().then(response => {
        this.treeMenuData = response.data
        this.treeMenuLoading = false
      })
    },
    // 取模块关联的菜单
    getModuleMenu(id) {
      fetchFunModuleMenu({ id: id }).then(response => {
        this.choseKeys = response.data
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
          handleDelModule({ id: this.formData.id }).then(response => {
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
      this.formData = Object.assign(row)
      this.getModuleMenu(this.formData.id)
    },
    // 选中
    handleSelectionChange(value) {
      // 主线存储 todo
      this.$store.commit('account/SET_MODULE', value)
    },
    // 当前选中的菜单
    getCheckedMenu(data, status) {
      // 最底层的id
      if (!data.children || data.children.length === 0) {
        if (status) {
          this.choseMenuIdsArr.push(data.id)
          this.choseMenuIds = this.choseMenuIdsArr.join(',')
        } else {
          const index = this.choseMenuIdsArr.indexOf(data.id)
          if (index > -1) {
            this.choseMenuIdsArr.splice(index, 1)
            this.choseMenuIds = this.choseMenuIdsArr.join(',')
          }
        }
      }
    },
    // 保存模块和菜单关联
    saveModuleMenu(id) {
      if (this.formData.id !== id) {
        this.$message.warning('请选择当前模块绑定的菜单')
      } else {
        handleMenuModule({ module_id: this.formData.id, menu_ids: this.choseMenuIds }).then(response => {
          this.$message.success('保存成功')
          this.getModuleMenu(this.formData.id)
        })
      }
    },
    // 保存模块
    saveModule(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          handleAddModule(this.formData).then(response => {
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
  .functionModule{
    height: 450px;
    overflow-y: auto;
    .content-left-patent{
      width: 300px;
      height: 100%;
      border: 1px solid #d7d7d7;
      overflow-y: hidden;
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
    .content-right-border{
      margin-left: 20px;
      flex: 1;
      height: 100%;
      border: 1px solid #d7d7d7;
      overflow-y: auto;
    }
  }
</style>
