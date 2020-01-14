<template>
  <div class="setMain">
    <Header :title="title" :is-back-show="true" :path-url="'/mail/index'" class="mb-12" />
    <div class="bg-white p-20">
      <el-form ref="addMailForm" :rules="addMailRules" :model="addMailFormData" label-position="left" label-width="80px">
        <el-form-item v-if="!readState" label="收信人：" required>
          <el-input v-model="selectNames" size="mini" class="w-223" readonly />
          <el-button plain size="mini" :disabled="readState" @click="choseFromAddress">选择收信人</el-button>
        </el-form-item>
        <el-form-item label="主题：" prop="message">
          <el-input v-model="addMailFormData.message" size="mini" class="w-223" :readonly="readState" />
        </el-form-item>
        <el-form-item label="内容：" prop="content">
          <el-input v-model="addMailFormData.content" type="textarea" size="mini" style="width: 500px" :readonly="readState" />
        </el-form-item>
        <el-form-item>
          <el-button v-if="!readState" type="primary" size="mini" @click="sendMail('addMailForm')">发送</el-button>
          <el-button plain size="mini" @click="cancelSendMail">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--通讯录弹窗-->
    <el-dialog v-el-drag-dialog class="work-dialog" width="450px" :modal="false" :close-on-click-modal="false" title="选择收信人" :visible.sync="dialogAddress" :before-close="cancelAddressDialog" @dragDialog="addressDrag">
      <div>
        <el-input v-model="listQuery.org_name" size="mini" clearable placeholder="请输入机构名称" class="w-190">
          <el-button slot="append" icon="el-icon-search" @click="getAccountList" />
        </el-input>
      </div>
      <div class="mt-10" style="height: 300px;overflow-y: auto">
        <el-table
          ref="multipleTable"
          v-loading="treeLoading"
          size="mini"
          :data="treeData"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center" />
          <el-table-column label="机构名称" width="" prop="org_name" align="center" />
        </el-table>
      </div>
      <!--分页-->
      <pagination v-show="total>0" :total="total" :page.sync="pageQuery.page" :limit.sync="pageQuery.limit" layout="total, prev, pager, next" @pagination="getAccountList" />
      <div ref="addressDiv" slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="saveAddressForm">
          确定
        </el-button>
        <el-button size="mini" plain @click="cancelAddressDialog">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { handleAddMail } from '@/api/mail'
import { fetchListAccount } from '@/api/organ'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import Header from '@/views/common/header'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'SetMail',
  components: { Header, Pagination },
  directives: { elDragDialog },
  data() {
    return {
      addMailFormData: {
        to_id: [],
        message: '',
        content: ''
      },
      addMailRules: {
        message: [{ required: true, message: '主题必须填写', trigger: 'blur' }],
        content: [{ required: true, message: '内容必须填写', trigger: 'blur' }]
      },
      treeLoading: false,
      dialogAddress: false,
      treeData: [],
      listQuery: {
        org_name: ''
      },
      pageQuery: {
        page: 1,
        limit: 10
      },
      total: 10,
      selections: [],
      selectNames: '',
      readState: false
    }
  },
  computed: {
    title() {
      if (this.$route.params.id) {
        return '站内信 - 查看'
      } else {
        return this.$route.meta.title
      }
    }
  },
  created() {
    const id = this.$route.params.id
    if (id) {
      // 取单条信息详情
      this.readState = true
      this.addMailFormData = this.$store.getters.messageInfo
    }
  },
  methods: {
    // 打开通讯录
    choseFromAddress() {
      this.dialogAddress = true
      this.$nextTick(() => {
        // 取机构
        this.getAccountList()
      })
    },
    getAccountList() {
      this.treeLoading = true
      fetchListAccount(this.listQuery, this.pageQuery).then(response => {
        this.treeData = response.data.data
        this.total = response.data.total
        this.treeLoading = false
      })
    },
    // 多选
    handleSelectionChange(value) {
      this.selections = value
    },
    addressDrag() {
      this.$refs.addressDiv.blur()
    },
    cancelAddressDialog() {
      this.$refs.multipleTable.clearSelection()
      this.dialogAddress = false
    },
    // 选择通讯录
    saveAddressForm() {
      if (this.selections.length < 1) {
        this.$message.error('请选择收信人')
      } else {
        this.selections.forEach(v => {
          this.addMailFormData.to_id = v.id + ','
          this.selectNames = v.org_name + ' '
        })
        this.dialogAddress = false
      }
    },
    sendMail(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addMailFormData.to_id = this.addMailFormData.to_id.substring(0, this.addMailFormData.to_id.length - 1)
          if (this.addMailFormData.to_id === '') {
            this.$message.error('请选择发送人')
          } else {
            handleAddMail(this.addMailFormData).then(response => {
              this.$message.success('发送成功')
              setTimeout(() => {
                this.$router.push('index')
              }, 1500)
            })
          }
        }
      })
    },
    cancelSendMail() {
      this.$router.push('/mail/index')
    }
  }
}
</script>

<style scoped>

</style>
