<template>
  <div class="authRole">
    <div class="w-100p">
      <div class="filter-container">
        <Header :title="title" class="fl mr-20" />
        <el-input v-model="listQuery.role_name" size="mini" clearable placeholder="请输入角色名称" class="w-190 mr-20">
          <el-button slot="append" icon="el-icon-search" @click="getList" />
        </el-input>
        <el-select v-model="listQuery.is_divider" placeholder="请选择是否已分配" size="small" clearable class="w-190" @change="getList">
          <el-option label="是" :value="1" />
          <el-option label="否" :value="0" />
        </el-select>
      </div>
      <div class="mb-12 text-right">
        <el-button size="mini" type="primary" @click="handleAddRole">新增角色</el-button>
      </div>
      <div class="bg-white box-shadow">
        <el-table
          v-loading="listLoading"
          size="mini"
          :data="list"
          border
          fit
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="操作" width="230" align="center">
            <template slot-scope="{row}">
              <el-button v-if="row.protect !== 1" type="text" class="text-edit" size="mini" @click="setAuth(row.id)">
                权限设置
              </el-button>
              <el-button type="text" class="text-edit" size="mini" @click="assignUser(row.id)">
                分配用户
              </el-button>
              <el-button v-if="row.protect !== 1" type="text" class="text-edit" size="mini" @click="editRole(row)">
                修改
              </el-button>
              <el-button v-if="row.protect !== 1" type="text" class="text-edit" size="mini" @click="delRole(row.id)">
                删除
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="角色名称" width="" prop="role_name" align="center" />
          <!--          <el-table-column label="角色级别" width="80" prop="level" align="center" />-->
          <!--          <el-table-column label="所属角色" width="" prop="belongRole" align="center" />-->
          <el-table-column label="是否启用" prop="enable" align="center">
            <template slot-scope="{ row }">
              {{ row.enable?'是':'否' }}
            </template>
          </el-table-column>
          <el-table-column label="是否已分配" prop="" align="center">
            <template slot-scope="{ row }">
              {{ row.user.length > 0?'是':'否' }}
            </template>
          </el-table-column>
          <el-table-column label="角色说明" prop="remark" align="center" />
        </el-table>
        <pagination v-show="total>0" class="text-center" :total="total" :page.sync="pageQuery.page" :limit.sync="pageQuery.page_size" @pagination="getList" />
      </div>
    </div>
    <!--角色选择弹窗-->
    <el-dialog v-el-drag-dialog class="teach-class-dialog" width="700px" :modal="false" :close-on-click-modal="false" :title="roleTypes[roleStatus]" :visible.sync="dialogRoleVisible" @dragDialog="handleRoleDrag">
      <el-form ref="form" :rules="rules" :model="formData" label-position="left" label-width="85px">
        <el-form-item label="角色名称" prop="role_name">
          <el-input v-model="formData.role_name" size="mini" />
        </el-form-item>
        <el-form-item label="角色说明" prop="remark">
          <el-input v-model="formData.remark" :rows="2" type="textarea" size="mini" />
        </el-form-item>
      </el-form>
      <div ref="roleDiv" slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="choseRoleSave('form')">
          保存
        </el-button>
        <el-button plain size="small" @click="cancelRoleClass">
          取消
        </el-button>
      </div>
    </el-dialog>
    <!--权限设置-->
    <el-dialog v-el-drag-dialog class="set-auth-dialog" width="450px" :modal="false" :close-on-click-modal="false" title="权限设置" :visible.sync="dialogSetAuthVisible" @dragDialog="handleSetAuthDrag">
      <div style="height: 300px;overflow-y: auto">
        <el-tree
          ref="authTree"
          :data="authData"
          show-checkbox
          default-expand-all
        />
      </div>
      <div ref="setAuthDiv" slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="saveAuth">
          保存
        </el-button>
        <el-button plain size="small" @click="cancelAuth">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, handleRoleAdd, handleRoleDel } from '@/api/auth'
import Header from '@/views/common/header-span'
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'AuthRole',
  components: { Pagination, Header },
  directives: { elDragDialog, waves },
  data() {
    return {
      listLoading: false,
      list: [],
      total: 3,
      listQuery: {
        role_name: '',
        is_divider: ''
      },
      pageQuery: {
        page: 1,
        page_size: 10
      },
      roleTypes: {
        add: '添加角色',
        edit: '编辑角色'
      },
      roleStatus: '',
      dialogRoleVisible: false,
      formData: {
        role_name: '',
        remark: ''
      },
      rules: {
        role_name: [{ required: true, message: '请输入角色姓名1', trigger: 'blur' }]
      },
      dialogSetAuthVisible: false,
      authData: [],
      multipleSelection: []
    }
  },
  computed: {
    title() {
      return this.$route.meta.title
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      console.log(123)
      this.listLoading = true
      getRoleList(this.listQuery, this.pageQuery).then(response => {
        console.log(response)
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // 新增角色
    handleAddRole() {
      this.roleStatus = 'add'
      this.formData = {
        role_name: '',
        remark: ''
      }
      this.dialogRoleVisible = true
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    // 编辑角色
    editRole(row) {
      this.roleStatus = 'edit'
      this.dialogRoleVisible = true
      this.$nextTick(() => {
        this.formData = Object.assign(row)
        this.$refs['form'].clearValidate()
      })
    },
    // 删除角色
    delRole(id) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        handleRoleDel({ id: id }).then(response => {
          this.$message.success('删除成功')
          this.getList()
        })
      }).catch(() => {
        console.log('cancel')
      })
    },
    handleRoleDrag() {
      this.$refs['roleDiv'].blur()
    },
    choseRoleSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          handleRoleAdd(this.formData).then(response => {
            if (this.formData.id) {
              this.$message.success('编辑成功')
            } else {
              this.$message.success('新增成功')
            }
          })
          this.getList()
          this.dialogRoleVisible = false
        }
      })
    },
    // 权限分配给用户
    assignUser(id) {
      this.$router.push(`AssignUser/${id}`)
    },
    cancelRoleClass() {
      this.dialogRoleVisible = false
    },
    handleSetAuthDrag() {
      this.$refs['setAuthDiv'].blur()
    },
    saveAuth() {
      this.dialogSetAuthVisible = false
    },
    cancelAuth() {
      this.dialogSetAuthVisible = false
    },
    handleCheckChange(value) {
      this.multipleSelection = value
      // console.log(value)
    },
    setAuth(id) {
      this.dialogSetAuthVisible = true
    }
  }
}
</script>
<style scoped>

</style>
