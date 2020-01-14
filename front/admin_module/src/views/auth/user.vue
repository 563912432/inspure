<template>
  <div class="user">
    <div class="filter-container">
      <Header :title="title" class="fl mr-20" />
      <el-input v-model="listQuery.username" size="mini" clearable placeholder="请输入用户名" class="w-190 mr-20">
        <el-button slot="append" icon="el-icon-search" @click="getListUser" />
      </el-input>
      <el-input v-model="listQuery.number" size="mini" clearable placeholder="请输入工号" class="w-190 mr-20">
        <el-button slot="append" icon="el-icon-search" @click="getListUser" />
      </el-input>
    </div>
    <div class="mb-12">
      <el-button size="mini" plain @click="branchTypeSet">
        部门类型设置
      </el-button>
      <span class="fr">
        <el-button size="mini" type="primary" @click="handleUserCreate">增加员工</el-button>
        <el-button size="mini" plain @click="handleUserImport">导入员工</el-button>
        <el-button size="mini" plain @click="handleUserDel">批量删除</el-button>
        <el-button size="mini" plain @click="handlePwdReset">重置密码</el-button>
      </span>
    </div>
    <div class="pb-20">
      <div class="branch-set-div fl">
        <!--left-->
        <div class="branch-set-title">部门管理</div>
        <el-tree
          v-loading="listBranchLoading"
          :data="listBranch"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span>
              <span v-if="!data.edit">
                {{ data.department_name }}
              </span>
              <span v-else>
                <el-input v-model="data.department_name" size="mini" />
              </span>
            </span>
            <span>
              <!--添加-->
              <i
                v-if="!data.edit"
                :style="node.level === 1?'margin-right:36px': ''"
                class="el-icon-circle-plus-outline tree-icon-blue ml-3"
                @click="() => appendBranch(data)"
              />
              <i
                v-if="data.edit"
                class="el-icon-circle-check tree-icon-green ml-3"
                @click="() => saveBranch(data)"
              />
              <!--编辑-->
              <i v-if="node.level !== 1 && !data.edit" class="el-icon-edit-outline tree-icon-orange" @click="changeEdit(data)" />
              <!--删除-->
              <i v-if="node.level !== 1" class="el-icon-circle-close tree-icon-red" @click="() => removeBranch(node, data)" />
            </span>
          </span>
        </el-tree>
      </div>
      <div class="flex-1 box-shadow" style="overflow-x: auto">
        <!--table-->
        <el-table
          v-loading="listUserLoading"
          size="mini"
          :data="listUser"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center" />
          <el-table-column label="工号" width="150" prop="number" align="center" />
          <el-table-column label="姓名" width="" align="center">
            <template slot-scope="{row}">
              <el-button type="text" class="text-blue" size="mini" @click="handleUpdateUser(row)">
                {{ row.username }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="性别" width="60" prop="sex" align="center" />
          <el-table-column label="手机号" width="120" prop="tel" align="center" />
          <el-table-column label="部门" width="80" prop="department_id" align="center" />
          <el-table-column label="角色" width="80" prop="protect" align="center" />
          <el-table-column label="启用状态" width="120" align="center">
            <template slot-scope="{row}">
              <el-tooltip :content="row.enable?'开启': '关闭'" placement="top">
                <el-switch
                  v-model="row.enable"
                  active-color="#55A625"
                  inactive-color="#999999"
                  :active-value="1"
                  :inactive-value="0"
                  @change="saveWorkForm(row.id, row.enable)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" class="text-center" :total="total" :page.sync="pageQuery.page" :limit.sync="pageQuery.limit" @pagination="getListUser" />
      </div>
    </div>
    <!--部门类型设置-->
    <el-dialog
      v-el-drag-dialog
      :modal="false"
      title="部门类型设置"
      :visible.sync="dialogBranchTypeVisible"
      :close-on-click-modal="false"
      width="450px"
      center
      @dragDialog="handleBranchTypeDrag"
    >
      <div ref="branchTypeDiv">
        <BranchType />
      </div>
    </el-dialog>
    <!--管理员弹窗-->
    <el-dialog v-el-drag-dialog class="user-dialog" width="600px" :modal="false" :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogUserVisible" :before-close="cancelUserDialog" @dragDialog="handleUserDrag">
      <el-form ref="userForm" class="user-form" :rules="userRules" :model="userFormData" label-position="left" label-width="100px">
        <el-form-item label="工号：" prop="number">
          <el-input v-model="userFormData.number" size="mini" />
        </el-form-item>
        <el-form-item label="姓名：" prop="username">
          <el-input v-model="userFormData.username" size="mini" />
        </el-form-item>
        <el-form-item label="手机号：" prop="tel">
          <el-input v-model="userFormData.tel" size="mini" />
        </el-form-item>
        <el-form-item label="性别：" prop="sex">
          <el-radio-group v-model="userFormData.sex">
            <el-radio v-for="(item, index) in sexList" :key="index" :label="item.key">{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="启用状态：" prop="enable">
          <el-radio-group v-model="userFormData.enable">
            <el-radio v-for="(item, index) in isWorkList" :key="index" :label="item.key">{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="user-form-item" label="部门：" prop="branch">
          <div class="user-form-div" style="border: solid 1px #EEEEEE">
            <el-tree
              ref="tree"
              v-loading="listUserTreeLoading"
              :props="{label: 'department_name'}"
              :data="listBranch"
              default-expand-all
              show-checkbox
              node-key="id"
              highlight-current
            />
          </div>
        </el-form-item>
      </el-form>
      <div ref="userDiv" slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="saveUserForm('userForm')">
          确定
        </el-button>
        <el-button size="small" plain @click="cancelUserDialog">
          取消
        </el-button>
      </div>
    </el-dialog>
    <!--导入员工弹窗-->
    <el-dialog
      v-el-drag-dialog
      :modal="false"
      title="导入员工"
      :visible.sync="uploadDialogVisible"
      :close-on-click-modal="false"
      center
      width="450px"
      :before-close="closeUploadDialog"
      @dragDialog="handleUploadDialogDrag"
    >
      <div ref="uploadDiv" class="text-center" style="padding: 50px 0">
        <el-upload
          ref="upload"
          :limit="1"
          class="upload-demo"
          drag
          :action="host + 'batchUploadExam'"
          :headers="headers"
          :before-upload="beforeUploadDocument"
          :on-success="handleUploadFileSuccess"
          :on-error="handleUploadFileError"
          :show-file-list="true"
          :auto-upload="true"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">
            <div class="mb-10">只能上传excel文件，单个文件上传不得超过5M</div>
            <div>请下载示例文件，按要求格式进行上传 <a :href="host + 'static/importExam.xlsx'">示例文件</a></div>
          </div>
        </el-upload>
      </div>
    </el-dialog>
    <!--重置密码-->
    <el-dialog v-el-drag-dialog class="pwd-dialog" width="400px" :modal="false" :close-on-click-modal="false" title="重置密码" :visible.sync="dialogPwdVisible" @dragDialog="handlePwdDrag">
      <el-form ref="pwdForm" :rules="pwdRules" :model="pwdFormData" label-position="left" label-width="80px">
        <div>
          <el-radio-group v-model="pwdFormData.type" @change="radioChange">
            <div class="mb-10"><el-radio :label="1">重置为注册手机号后六位</el-radio></div>
            <div class="mb-10"><el-radio :label="2">自定义重置密码</el-radio></div>
          </el-radio-group>
        </div>
        <el-form-item label="新密码" prop="pwd">
          <el-input v-model="pwdFormData.pwd" size="mini" :disabled="pwdDisabled" />
        </el-form-item>
        <el-form-item label="再次输入" prop="confirmPwd">
          <el-input v-model="pwdFormData.confirmPwd" size="mini" :disabled="pwdDisabled" />
        </el-form-item>
      </el-form>
      <div ref="divPwd" slot="footer" class="dialog-footer">
        <el-button size="mini" plain @click="dialogPwdVisible = false">
          返回
        </el-button>
        <el-button type="primary" size="mini" @click="savePwd">
          确定
        </el-button>
      </div>
    </el-dialog>
    <!--编辑部门管理弹窗-->
    <el-dialog v-el-drag-dialog class="branch-dialog" width="400px" :modal="false" :close-on-click-modal="false" title="编辑部门" :visible.sync="dialogBranchVisible" @dragDialog="handleBranchDrag">
      <el-form ref="branchForm" :rules="branchRules" :model="branchFormData" label-position="left" label-width="80px">
        <el-form-item label="部门名称" prop="department_name">
          <el-input v-model="branchFormData.department_name" clearable size="mini" />
        </el-form-item>
      </el-form>
      <div ref="divBranch" slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="saveBranch(branchFormData)">
          确定
        </el-button>
        <el-button size="small" plain @click="dialogBranchVisible = false">
          返回
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchListBranch, handleBranchAdd, handleBranchDel, fetchListUser, handleUserAdd, handleUserDel, handleWorkEdit, handlePwdEdit } from '@/api/auth'
import { addTreeEdit } from '@/utils/index'
import Header from '@/views/common/header-span'
import waves from '@/directive/waves' // waves directive
import BranchType from './components/branchType' // waves directive
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'User',
  components: { Header, Pagination, BranchType },
  directives: { waves, elDragDialog },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.pwdFormData.pwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      listQuery: {
        username: '',
        number: ''
      },
      pageQuery: {
        page: 1,
        limit: 10
      },
      listBranch: [],
      listUserLoading: false,
      listUser: null,
      total: 10,
      listBranchLoading: false,
      dialogBranchTypeVisible: false,
      textMap: {
        add: '新增员工',
        update: '编辑员工'
      },
      dialogStatus: '',
      dialogUserVisible: false,
      userFormData: {
        number: '',
        username: '',
        tel: '',
        sex: '',
        enable: 1,
        department_id: ''
      },
      userRules: {
        number: [{ required: true, message: '工号必须填写', trigger: 'blur' }],
        username: [{ required: true, message: '姓名必须填写', trigger: 'blur' }],
        tel: [{ required: true, message: '手机号必须填写', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        enable: [{ required: true, message: '请选择是否启用', trigger: 'change' }]
      },
      listUserTreeLoading: false,
      uploadDialogVisible: false,
      dialogPwdVisible: false,
      pwdFormData: {
        id: '',
        type: 1,
        pwd: '',
        confirmPwd: ''
      },
      pwdDisabled: true,
      pwdRules: {
        pwd: [{ required: true, message: '新密码必须填写', trigger: 'blur' }],
        confirmPwd: [{ validator: validatePass, required: true, trigger: 'blur' }]
      },
      dialogBranchVisible: false,
      branchFormData: {
        department_name: ''
      },
      branchRules: {
        department_name: [{ required: true, message: '请填写部门名称', trigger: 'blur' }]
      },
      multipleSelection: [] // 多选的选项
    }
  },
  computed: {
    title() {
      return this.$route.meta.title
    },
    sexList() {
      return this.$store.getters.sexList
    },
    isWorkList() {
      return this.$store.getters.isWorkList
    },
    host() {
      return window.host
    },
    headers() {
      return {
        // token: this.$store.state.access_token_teacher
        token: '12313123123123123123'
      }
    }
  },
  created() {
    this.getListBranch()
    this.getListUser()
  },
  methods: {
    changeEdit(data) {
      this.branchFormData = {
        id: data.id,
        department_name: data.department_name,
        parent_id: data.parent_id
      }
      this.dialogBranchVisible = true
    },
    // 获取部门数据
    getListBranch() {
      this.listBranchLoading = true
      fetchListBranch().then(response => {
        this.listBranch = response.data
        this.listBranchLoading = false
        addTreeEdit(this.listBranch)
      })
    },
    // 获取用户数据
    getListUser() {
      this.listUserLoading = true
      fetchListUser(this.listQuery, this.pageQuery).then(response => {
        this.listUser = response.data.data
        this.total = response.data.total
        this.listUserLoading = false
      })
    },
    // 部门类型设置
    branchTypeSet() {
      this.dialogBranchTypeVisible = true
    },
    // 弹窗拖拽
    handleBranchTypeDrag() {
      this.$refs.branchTypeDiv.blur()
    },
    resetUserForm() {
      this.userFormData = {
        number: '',
        username: '',
        tel: '',
        sex: '',
        enable: 1,
        department_id: ''
      }
    },
    // 增加用户
    handleUserCreate() {
      this.resetUserForm()
      this.dialogStatus = 'add'
      this.dialogUserVisible = true
      this.$nextTick(() => {
        this.$refs['userForm'].clearValidate()
        this.$refs.tree.setCheckedKeys([])
      })
    },
    // 导入用户
    handleUserImport() {
      this.uploadDialogVisible = true
    },
    // 批量删除用户
    handleUserDel() {
      if (this.multipleSelection.length > 0) {
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let tmpString = ''
          for (const i in this.multipleSelection) {
            tmpString += this.multipleSelection[i].id + ','
          }
          tmpString = tmpString.substring(0, tmpString.lastIndexOf(','))
          handleUserDel({ id: tmpString }).then((response) => {
            this.$message.success('删除成功')
            this.getListUser()
          })
        }).catch(() => {
          console.log('cancel')
        })
      } else {
        this.$message({
          message: '请选择要删除的用户',
          type: 'warning',
          duration: 2000
        })
      }
    },
    // 重置密码
    handlePwdReset() {
      if (this.multipleSelection.length < 1) {
        this.$message.warning('请选择用户')
      } else if (this.multipleSelection.length > 1) {
        this.$message.warning('只能选择一个用户')
      } else {
        this.pwdFormData.id = this.multipleSelection[0].id
        this.pwdFormData.type = 1
        this.pwdFormData.pwd = ''
        this.pwdFormData.confirmPwd = ''
        this.pwdDisabled = true
        this.dialogPwdVisible = true
      }
    },
    // 增加部门
    appendBranch(data) {
      const newChild = { department_name: '', parent_id: data.id, edit: true, children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },
    // 保存部门
    saveBranch(data) {
      // 部门类型暂无
      data.group_id = 15
      handleBranchAdd(data).then(response => {
        this.$message.success(response.msg)
        this.getListBranch()
        if (this.dialogBranchVisible) {
          this.dialogBranchVisible = false
        }
      })
    },
    // 删除部门
    removeBranch(node, data) {
      if (!data.id || data.id === '') {
        const parent = node.parent
        const children = parent.data.children || parent.data
        const index = children.findIndex(d => d.id === data.id)
        children.splice(index, 1)
      } else {
        this.$confirm('确定要删除部门【' + data.department_name + '】吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          handleBranchDel({ id: data.id }).then(response => {
            this.$message.success('删除成功')
            this.getListBranch()
          })
        }).catch(() => {
          console.log('cancel')
        })
      }
    },
    // 表格选项多选
    handleSelectionChange(value) {
      this.multipleSelection = value
    },
    // 更新会员信息
    handleUpdateUser(row) {
      this.userFormData = Object.assign({}, row) // 复制对象
      this.dialogStatus = 'update'
      this.dialogUserVisible = true
      this.$nextTick(() => {
        this.$refs['userForm'].clearValidate()
        this.$refs.tree.setCheckedKeys([this.userFormData.department_id])
      })
    },
    // 保存管理员
    saveUserForm(formName) {
      const checkedData = this.$refs.tree.getCheckedNodes(true, false)
      if (checkedData.length > 1) {
        this.$message.warning('只能选择一个部门')
      } else if (checkedData.length < 1) {
        this.$message.warning('请选择部门')
      } else {
        this.userFormData.department_id = checkedData[0].id
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 提交表单
            handleUserAdd(this.userFormData).then(response => {
              let message = ''
              if (this.userFormData.id) {
                message = '编辑成功'
              } else {
                message = '新增成功'
              }
              this.$message.success(message)
              this.dialogUserVisible = false
              this.getListUser()
            })
          }
        })
      }
    },
    // 拖拽用户弹窗
    handleUserDrag() {
      this.$refs.userDiv.blur()
    },
    cancelUserDialog() {
      // 关闭之前，初始化form
      this.$refs['userForm'].clearValidate()
      this.$refs['userForm'].resetFields()
      this.$refs.tree.setCheckedKeys([])
      if (this.dialogUserVisible) {
        this.dialogUserVisible = false
      }
    },
    // 关闭批量上传dialog
    closeUploadDialog() {
      this.uploadDialogVisible = false
    },
    // 上传之前
    beforeUploadDocument(file) {
      const isLt5M = file.size / 1024 / 1024 < 5
      // 验证单次文件上传大小 不能超过5M
      if (!isLt5M) {
        this.$message.error('文件大小不得超过5M')
        return false
      }
      // 验证文件类型
      let fileType = file.type
      console.log(fileType)
      if (fileType === '') {
        const fileInfo = file.name.split('.')
        if (fileInfo.length < 2) {
          this.$message.error('不支持的文件格式，请重新选择')
          return false
        }
        fileType = fileInfo[fileInfo.length - 1]
        if (this.allDocumentFileExt.indexOf(fileType) === -1) {
          this.$message.error('不支持的文件格式，请重新选择')
          return false
        }
      } else {
        if (this.allowUploadFileType.indexOf(fileType) === -1) {
          this.$message.error('不支持的文件格式，请重新选择')
          return false
        }
      }
    },
    handleUploadFileSuccess(res, file) {
      if (res.status === 1) {
        this.$message.success('题目批量导入成功')
        this.closeUploadDialog()
        this.getList()
      } else {
        this.$refs.upload.clearFiles()
        this.$message.error(res.info)
      }
    },
    handleUploadFileError() {
      this.$refs.upload.clearFiles()
      this.$message.error('批量导入失败')
    },
    handleUploadDialogDrag() {
      this.$refs.uploadDiv.blur()
    },
    // 保存启用状态
    saveWorkForm(id, enable) {
      handleWorkEdit({ id: id, enable: enable }).then(response => {
        this.$message.success('状态保存成功')
        this.getListUser()
      })
    },
    // 重置选项修改
    radioChange(el) {
      switch (el) {
        case 1:
          this.pwdDisabled = true
          break
        case 2:
          this.pwdDisabled = false
          break
        default:
          this.pwdDisabled = true
          break
      }
    },
    // 密码保存
    savePwd() {
      if (this.pwdFormData.type === 1) {
        const data = this.listUser.find(v => {
          return v.id === this.pwdFormData.id
        })
        const dataArr = {
          id: this.pwdFormData.id,
          password: data.tel.substring(data.tel.length - 6, data.tel.length)
        }
        this.handleSavePwd(dataArr)
      } else {
        this.$refs['pwdForm'].validate((valid) => {
          if (valid) {
            const dataArr = {
              id: this.pwdFormData.id,
              password: this.pwdFormData.pwd
            }
            this.handleSavePwd(dataArr)
          }
        })
      }
    },
    handlePwdDrag() {
      this.$refs.divPwd.blur()
    },
    handleSavePwd(params) {
      handlePwdEdit(params).then(response => {
        this.$message.success('密码重置成功')
        this.dialogPwdVisible = false
        this.getListUser()
      })
    },
    handleBranchDrag() {
      this.$refs.divBranch.blur()
    }
  }
}
</script>
<style>
  .pwd-dialog .el-form-item {
    margin-bottom: 10px;
  }
  .branch-set-div .el-input--mini .el-input__inner{
    height: 20px;
  }
</style>
<style lang="scss" scoped>
  .user {
    .filter-container{
    }
    .branch-set-div{
      width: 225px;
      min-height: 180px;
      max-height: 435px;
      overflow-y: auto;
      border: solid 1px #E0E0E0;
      margin-right: 20px;
      padding-bottom: 20px;
      background-color: #ffffff;
      .branch-set-title{
        background-color: #EEEEEE;
        border-bottom: solid 1px #E0E0E0;
        padding: 8px 10px;
        font-size: 13px;
      }
      .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
        padding-top: 5px;
      }
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
    .user-form{
      /*border-width: 1px;*/
      /*border-color: #dcdfe6;*/
      /*border-style: none solid solid none;*/
      .user-form-div{
        height: 210px;
        overflow-y: auto;
      }
    }
  }
</style>
