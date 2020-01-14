<template>
  <div class="account">
    <div class="filter-container">
      <Header :title="title" class="fl mr-20" />
      <el-input v-model="listQuery.org_name" size="mini" clearable placeholder="请输入机构名称" class="w-190">
        <el-button slot="append" icon="el-icon-search" @click="getList" />
      </el-input>
      <span class="fr">
        <el-button size="mini" type="primary" @click="handleCreate">
          增加机构
        </el-button>
        <el-button size="mini" plain @click="handleDel">
          批量删除
        </el-button>
      </span>
    </div>
    <div class="box-shadow">
      <el-table
        v-loading="listLoading"
        size="mini"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @row-click="choseOne"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column label="机构编号" width="100" prop="number" />
        <el-table-column label="机构名称" width="220" show-overflow-tooltip>
          <template slot-scope="{row}">
            <el-button type="text" class="text-blue" size="mini" @click="handleUpdate(row)">
              {{ row.org_name }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="管理员帐号" width="" prop="admin_user" />
        <el-table-column label="地址" :show-overflow-tooltip="true" prop="address" />
        <el-table-column label="联系人" width="" prop="contact" align="center" />
        <el-table-column label="联系电话" width="" prop="tel" align="center" />
        <el-table-column width="100" label="启用状态" align="center">
          <template slot-scope="{row}">
            <el-tooltip :content="row.enable?'开启': '关闭'" placement="top">
              <el-switch
                v-model="row.enable"
                active-color="#55A625"
                inactive-color="#999999"
                :active-value="1"
                :inactive-value="0"
                @change="changeStatus(row.id, row.enable)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" align="center">
          <template slot-scope="{row}">
            <el-button type="text" class="text-add" size="mini" @click="detailModuleTiku(row.id)">
              模块与题库
            </el-button>
            <el-button type="text" class="text-add" size="mini" @click="accountKu(row.id)">
              账套库
            </el-button>
            <el-button type="text" class="text-add" size="mini" @click="resetPwd(row.id)">
              重置密码
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <pagination v-show="total>0" class="text-center" :total="total" :page.sync="pageQuery.page" :limit.sync="pageQuery.limit" @pagination="getList" />
    <!--弹窗-->
    <el-dialog v-el-drag-dialog width="450px" :modal="false" class="account-dialog" :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @dragDialog="handleDrag">
      <el-form ref="form" :rules="rules" :model="formData" label-position="left" label-width="80px">
        <el-form-item label="机构编号" prop="number">
          <el-input v-model="formData.number" size="mini" />
        </el-form-item>
        <el-form-item label="机构名称" prop="org_name">
          <el-input v-model="formData.org_name" size="mini" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="formData.address" size="mini" />
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="formData.contact" size="mini" />
        </el-form-item>
        <el-form-item label="联系电话" prop="tel">
          <el-input v-model="formData.tel" size="mini" />
        </el-form-item>
        <el-form-item v-if="dialogStatus === 'create'" label="最高账号" prop="admin_user">
          <span class="ml-10">admin - </span><el-input v-model="formData.admin_user" size="mini" style="width: 228px" />
        </el-form-item>
        <el-form-item v-if="dialogStatus === 'create'" label="默认密码" prop="password">
          <el-input v-model="formData.password" :disabled="inputDisabled" size="mini" style="width: 218px;" />
          <el-button size="small" plain class="btn-plain" style="width: 68px" @click="setPassword">{{ inputText }}</el-button>
        </el-form-item>
      </el-form>
      <div ref="div" slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="createData">
          确定
        </el-button>
        <el-button size="small" plain @click="dialogFormVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>
    <!--重置密码-->
    <el-dialog v-el-drag-dialog width="400px" :modal="false" class="account-dialog" :close-on-click-modal="false" title="重置密码" :visible.sync="dialogPwdVisible" @dragDialog="handlePwdDrag">
      <el-form ref="pwdForm" :rules="pwdRules" :model="pwdFormData" label-position="left" label-width="80px">
        <div>
          <el-radio-group v-model="pwdFormData.type" @change="radioChange">
            <div class="mb-10"><el-radio :label="1">重置为：000000</el-radio></div>
            <div class="mb-10"><el-radio :label="2">自定义重置密码</el-radio></div>
          </el-radio-group>
        </div>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="pwdFormData.password" size="mini" :disabled="pwdDisabled" />
        </el-form-item>
        <el-form-item label="再次输入" prop="confirmPwd">
          <el-input v-model="pwdFormData.confirmPwd" size="mini" :disabled="pwdDisabled" />
        </el-form-item>
      </el-form>
      <div ref="divPwd" slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="savePwd">
          确定
        </el-button>
        <el-button size="small" plain @click="dialogPwdVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchListAccount, handleAccountCreate, handleAccountDel, changeStatus, savePwd } from '@/api/organ'
import Header from '@/views/common/header-span'
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Account',
  components: { Header, Pagination },
  directives: { waves, elDragDialog },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.pwdFormData.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      input: '',
      listLoading: true,
      list: null,
      total: 0,
      value2: true,
      inputText: '自定义',
      listQuery: {
        org_name: ''
      },
      pageQuery: {
        page: 1,
        limit: 10
      },
      dialogStatus: '',
      textMap: {
        create: '新增机构',
        update: '编辑机构'
      },
      dialogFormVisible: false,
      formData: {
        number: '',
        org_name: '',
        admin_user: '',
        address: '',
        contact: '',
        tel: '',
        password: ''
      },
      inputDisabled: true,
      rules: {
        number: [{ required: true, message: '机构编号必须填写', trigger: 'blur' }],
        org_name: [{ required: true, message: '机构名称必须填写', trigger: 'blur' }],
        address: [{ required: true, message: '地址名称必须填写', trigger: 'blur' }],
        admin_user: [{ required: true, message: '管理员帐号必须填写', trigger: 'blur' }],
        contact: [{ required: true, message: '联系人必须填写', trigger: 'blur' }],
        tel: [{ required: true, message: '联系电话必须填写', trigger: 'blur' }],
        password: [{ required: true, message: '默认密码必须填写', trigger: 'blur' }]
      },
      multipleSelection: [],
      dialogPwdVisible: false,
      pwdFormData: {
        id: '',
        type: 1,
        password: '',
        confirmPwd: ''
      },
      pwdDisabled: false,
      pwdRules: {
        password: [{ required: true, message: '新密码必须填写', trigger: 'blur' }],
        confirmPwd: [{ validator: validatePass, required: true, trigger: 'blur' }]
      }
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
  mounted() {},
  methods: {
    choseOne(row, column, event) {
    },
    getList() {
      this.listLoading = true
      fetchListAccount(this.listQuery, this.pageQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      }).catch()
    },
    setPassword() {
      if (this.inputDisabled) {
        this.inputDisabled = false
        this.inputText = '保存'
      } else {
        this.inputDisabled = true
        this.inputText = '自定义'
      }
    },
    // 重置Form
    resetForm() {
      this.formData = {
        number: '',
        org_name: '',
        admin_user: '',
        address: '',
        contact: '',
        tel: '',
        password: ''
      }
    },
    // 增加 => 清数据、弹窗
    handleCreate() {
      this.resetForm()
      this.formData.password = '000000'
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    // 增加保存
    createData() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.formData.id) {
            delete this.formData.admin_user
          } else {
            this.formData.admin_user = 'admin-' + this.formData.admin_user
          }
          handleAccountCreate(this.formData).then((response) => {
            let message = ''
            if (this.formData.id) {
              message = '编辑成功'
            } else {
              message = '新增成功'
            }
            this.$message.success(message)
            this.dialogFormVisible = false
            this.getList()
          })
        }
      })
    },
    // 编辑【弹出编辑弹窗】 => 获取数据，清除验证
    handleUpdate(row) {
      this.formData = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    // checkbox的多选事件
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 批量删除
    handleDel() {
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
          handleAccountDel({ id: tmpString }).then((response) => {
            this.$message.success('删除成功')
            this.getList()
          }).catch()
        }).catch(() => {
          console.log('cancel')
        })
      } else {
        this.$message({
          message: '请选择要删除的机构',
          type: 'warning',
          duration: 2000
        })
      }
    },
    // 模块与题库详情
    detailModuleTiku(id) {
      this.$router.push('moduleTikuDetail/' + id)
    },
    // 账套库详情
    accountKu(id) {
      this.$router.push('account-ku-set/' + id)
    },
    // 重置密码
    resetPwd(id) {
      this.pwdFormData.id = id
      this.dialogPwdVisible = true
      this.pwdDisabled = true
    },
    // 重置选项修改
    radioChange(el) {
      switch (el) {
        case 1:
          this.pwdDisabled = true
          this.pwdFormData.password = ''
          this.pwdFormData.confirmPwd = ''
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
        const dataArr = {
          id: this.pwdFormData.id,
          password: '000000'
        }
        this.handleSavePwd(dataArr)
      } else {
        this.$refs['pwdForm'].validate((valid) => {
          if (valid) {
            const dataArr = {
              id: this.pwdFormData.id,
              password: this.pwdFormData.password
            }
            this.handleSavePwd(dataArr)
          }
        })
      }
    },
    // 状态改变
    changeStatus(id, status) {
      changeStatus({ id: id, state: status }).then((response) => {
        this.$message.success('状态保存成功')
      }).catch()
    },
    // dialog拖拽
    handleDrag() {
      this.$refs.div.blur()
    },
    handlePwdDrag() {
      this.$refs.divPwd.blur()
    },
    handleSavePwd(params) {
      savePwd(params).then((response) => {
        this.$message.success('密码修改成功')
        this.dialogPwdVisible = false
      }).catch()
    }
  }
}
</script>
<style lang="scss" scoped>
  .filter-container{
  }
</style>
