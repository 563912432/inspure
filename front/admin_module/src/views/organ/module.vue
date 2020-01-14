<template>
  <div class="app-container">
    <div class="filter-container">
      <HeaderSpan :title="title" class="fl mr-20" />
      <span class="fr">
        <el-button size="small" type="primary" @click="handleCreate('createModule')">
          新增模块方案
        </el-button>
        <el-button size="small" type="primary" @click="handleCreate('createTiku')">
          新增题库方案
        </el-button>
      </span>
    </div>
    <div class="box-shadow bg-white" style="max-height: 500px;overflow-y: auto">
      <el-table
        v-loading="listLoading"
        size="mini"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column label="商业方案名称" prop="solution_name" />
        <el-table-column label="操作" align="center">
          <template slot-scope="{row}">
            <el-button type="text" size="mini" @click="handleUpdate(row)">
              编辑方案
            </el-button>
            <el-button type="text" class="text-del" size="mini" @click="handleDel(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <pagination v-show="total>0" class="text-center" :total="total" :page.sync="pageQuery.page" :limit.sync="pageQuery.page_size" @pagination="getList" />
    </div>
    <!--模块方案-->
    <div v-if="dialogFormVisible">
      <el-dialog v-el-drag-dialog width="850px" :modal="false" :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @dragDialog="handleDrag">
        <el-form ref="form" :rules="rules" :model="formData" label-position="left" label-width="120px" style="margin-left:10px;">
          <el-form-item label="商业方案名称" prop="solution_name" style="margin-bottom: 15px">
            <el-input v-model="formData.solution_name" size="mini" />
          </el-form-item>
          <div ref="div" class="content">
            <FunctionModule v-if="dialogStatus === 'createModule' || dialogStatus === 'updateModule'" />
            <TiKuModule v-if="dialogStatus === 'createTiku' || dialogStatus === 'updateTiku'" />
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="saveModule('form')">
            保存
          </el-button>
          <el-button size="small" plain @click="cancelModule">
            返回
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { fetchListSolution, handleAddSolution, handleDelSolution, updateModule, handleOneSolution } from '@/api/organ'
import HeaderSpan from '@/views/common/header-span'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import FunctionModule from './components/functionModule'
import TiKuModule from './components/tiKuModule'
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui

export default {
  name: 'Module',
  components: { HeaderSpan, FunctionModule, TiKuModule, Pagination },
  directives: { waves, elDragDialog },
  data() {
    return {
      list: null,
      treeData: [],
      checked: true,
      listLoading: true,
      formData: {
        solution_name: '',
        module_id: '',
        type: 1
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        createModule: '新增模块方案',
        updateModule: '编辑模块方案',
        createTiku: '新增题库方案',
        updateTiku: '编辑题库方案'
      },
      rules: {
        solution_name: [{ required: true, message: '商业方案名称必须填写', trigger: 'blur' }]
      },
      total: 0,
      pageQuery: {
        page: 1,
        page_size: 10
      }
    }
  },
  computed: {
    // 题型
    planCate() {
      return this.$store.getters.planCate
    },
    title() {
      return this.$route.meta.title
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 方案列表
    getList() {
      this.listLoading = true
      fetchListSolution().then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // 新增【弹出新增弹窗】 => 重置数据，清除验证
    handleCreate(el) {
      this.resetForm()
      this.dialogStatus = el
      this.dialogFormVisible = true
      this.$store.commit('account/SET_MODULE', [])
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    cancelModule() {
      this.dialogFormVisible = false
    },
    // 新增保存数据 => 接口保存数据
    saveModule(formName) {
      let dataArr = []
      const dataResult = []
      switch (this.dialogStatus) {
        case 'createModule':
        case 'updateModule':
          dataArr = this.$store.getters.module
          if (!dataArr || dataArr.length === 0) {
            this.$message.warning('请选择方案绑定的模块')
          } else {
            dataArr.forEach(v => {
              dataResult.push(v.id)
            })
            this.formData.module_id = dataResult
            this.formData.type = 1
          }
          break
        case 'createTiku':
        case 'updateTiku':
          dataArr = this.$store.getters.tiKuModule
          if (!dataArr || dataArr.length === 0) {
            this.$message.warning('请选择方案绑定的模块')
          } else {
            dataArr.forEach(v => {
              dataResult.push(v.id)
            })
            this.formData.module_id = dataResult
            this.formData.type = 2
          }
          break
        default:
          break
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          handleAddSolution(this.formData).then(response => {
            this.$message.success('保存成功')
            this.dialogFormVisible = false
            this.getList()
          })
        }
      })
    },
    // 编辑【弹出编辑弹窗】 => 获取数据，清除验证
    handleUpdate(row) {
      handleOneSolution({ id: row.id }).then(response => {
        let dataStr = ''
        const dataArr = []
        response.data.module.forEach(v => {
          dataStr += v.id + ','
          dataArr.push(v.id)
        })
        dataStr = dataStr.slice(0, dataStr.length - 1)
        this.formData = {
          id: row.id,
          solution_name: response.data.solution_name,
          module_id: dataStr
        }
        if (response.data.module[0].type === this.$store.getters.moduleStatus.FunModule) { // 功能模块
          this.dialogStatus = 'updateModule'
          this.$store.commit('account/SET_MODULE', dataArr)
        }
        if (response.data.module[0].type === this.$store.getters.moduleStatus.TiKuModule) { // 题库模块
          this.dialogStatus = 'updateTiku'
          this.$store.commit('account/SET_TIKU', dataArr)
        }
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['form'].clearValidate()
        })
      })
    },
    // 保存编辑信息
    updateData() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.formData)
          updateModule(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.formData.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.formData)
                break
              }
            }
            this.dialogFormVisible = false
            this.$message({
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 删除方案
    handleDel(id) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        handleDelSolution({ id: id }).then(response => {
          this.$message.success('删除成功')
          this.getList()
        })
      }).catch(() => {
        console.log('cancel')
      })
    },
    // 重置Form
    resetForm() {
      this.formData = {
        solution_name: '',
        module_id: ''
      }
    },
    // dialog拖拽
    handleDrag() {
      this.$refs.div.blur()
    }
  }
}
</script>
<style lang="scss" scoped>
  .app-container{
    /*padding-top: 40px;*/
  }
  .filter-container{
    /*width: 950px;*/
  }
  .content{
    height: 450px;
  }
</style>
