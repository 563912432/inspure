<template>
  <div class="accountKuSet">
    <!--模块开启信息-->
    <div class="w-100p">
      <div class="filter-container">
        <Header :title="title" class="fl mr-20" />
        <div class="search-more fl" @click="searchState = !searchState">
          <span>高级搜索</span>
          <i :class="searchState?'el-icon-arrow-up':'el-icon-arrow-down'" />
        </div>
        <div class="fr mb-12 text-right">
          <el-button size="small" type="primary" @click="createAccount">新建账套</el-button>
          <el-button size="small" type="primary" @click="delAccountSome">批量删除</el-button>
          <!--          <el-button size="small" type="primary" @click="setRate">税率设置</el-button>-->
          <el-button size="small" type="primary" @click="setTrade">行业设置</el-button>
        </div>
        <el-collapse-transition>
          <div v-show="searchState" class="search-more-content">
            <div class="flex flex-justify-space-between mb-20">
              <span><span class="w-65 inline-block text-right">账套名称：</span>
                <el-input v-model="listQuery.title" clearable size="mini" class="w-190" />
              </span>
              <span><span class="w-65 inline-block text-right">月份数：</span>
                <el-input v-model="listQuery.has_month" clearable size="mini" class="w-190" />
              </span>
            </div>
            <div class="flex flex-justify-space-between mb-20">
              <span><span class="w-65 inline-block text-right">纳税类型：</span>
                <el-select v-model="listQuery.tax_type" clearable size="mini" placeholder="请选择" class="w-190">
                  <el-option label="全部" value="" />
                  <el-option v-for="(item, index) in payTaxTypeList" :key="index" :value="item.key" :label="item.value" />
                </el-select>
              </span>
              <span><span class="w-65 inline-block text-right">会计制度：</span>
                <el-select v-model="listQuery.accountSystem" placeholder="请选择会计制度" size="mini" clearable class="w-190">
                  <el-option label="全部" value="" />
                  <el-option v-for="item in accountSystemList" :key="item.key" :label="item.key" :value="item.value" />
                </el-select>
              </span>
            </div>
            <div class="flex flex-justify-space-between mb-20">
              <span><span class="w-65 inline-block text-right">所属行业：</span>
                <el-select v-model="listQuery.industry_name" size="mini" placeholder="请选择所属行业" clearable class="w-190">
                  <el-option label="全部" value="" />
                  <!--                  <el-option v-for="(item, index) in tradeList" :key="index" :lable="item.key" :value="item.value" />-->
                </el-select>
              </span>
              <span><span class="w-65 inline-block text-right">账套类型：</span>
                <el-select v-model="listQuery.account_type" placeholder="请选择账套类型" size="mini" clearable class="w-190">
                  <el-option label="全部" value="" />
                  <el-option v-for="(item, index) in accountTypeList" :key="index" :label="item.value" :value="item.key" />
                </el-select>
              </span>
            </div>
            <div class="flex flex-justify-space-between mb-20">
              <span><span class="w-65 inline-block text-right">上架状态：</span>
                <el-select v-model="listQuery.enable" size="mini" placeholder="请选择上架状态" clearable class="w-190">
                  <el-option label="全部" value="" />
                  <el-option v-for="(item, index) in showStatusList" :key="index" :label="item.value" :value="item.key" />
                </el-select>
              </span>
              <span><span class="w-65 inline-block text-right">账套用途：</span>
                <el-select v-model="listQuery.purpose" placeholder="请选择账套用途" size="mini" clearable class="w-190">
                  <el-option label="全部" value="" />
                  <el-option v-for="(item, index) in accountUseList" :key="index" :label="item.value" :value="item.key" />
                </el-select>
              </span>
            </div>
            <div class="text-right">
              <el-button v-waves size="mini" type="primary" @click="getList">
                查询
              </el-button>
            </div>
          </div>
        </el-collapse-transition>
      </div>
      <el-table
        v-loading="listLoading"
        size="mini"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column label="操作" width="220" align="center">
          <template slot-scope="{row}">
            <el-button type="text" size="mini" @click="delAccountOne(row.id)">
              删除
            </el-button>
            <el-button type="text" size="mini" @click="editAccount(row.id)">
              修改
            </el-button>
            <el-button type="text" size="mini" @click="addData(row)">
              数据添加
            </el-button>
            <el-button type="text" size="mini" @click="setEnable(row)">
              上下架
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="编号" width="" type="index" align="center" />
        <el-table-column label="账套名称" width="" prop="title" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="启用时间" width="" prop="enable_date" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="月份数" width="60" prop="has_month" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="纳税类型" prop="tax_type" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="会计制度" prop="account_rule" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="所属行业" prop="industry_name" width="" align="center" :show-overflow-tooltip="true">
          <template slot-scope="{row}">{{ row['industry']?row['industry']['industry_name']: row['industry_id'] }}</template>
        </el-table-column>
        <el-table-column label="账套类型" prop="account_type" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="最后更新日期" prop="updated_at" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="上架状态" prop="enable" width="" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="用途" prop="purpose" width="80" align="center" :show-overflow-tooltip="true" />
      </el-table>
      <pagination v-show="total>0" class="text-center" :total="total" :page.sync="pageQuery.page" :limit.sync="pageQuery.page_size" @pagination="getList" />
    </div>

    <!--行业设置弹窗-->
    <el-dialog v-el-drag-dialog width="650px" :modal="false" :close-on-click-modal="false" title="行业设置" :visible.sync="dialogTradeVisible" @dragDialog="handleTradeDrag">
      <div ref="tradeDiv">
        <IndustryType />
      </div>
    </el-dialog>
    <!--导入弹窗-->
    <el-dialog
      v-el-drag-dialog
      :modal="false"
      title="批量导入"
      :visible.sync="importDialogVisible"
      :close-on-click-modal="false"
      width="400px"
      center
      :before-close="closeImportDialog"
      @dragDialog="handleImportDrag"
    >
      <el-alert
        :closable="false"
        title="导入须知"
        type="success"
        class="mb-20"
      >
        <div ref="importDiv" class="f14 p-5">
          <div slot="tip" class="small mt-10" style="line-height: 20px">文件大小不得超过5M，请先点击下载
            <a
              class="c-orange"
              :href="host + '@/assets/xls/pointExample.xls'"
              target="_blank"
            >示例文档</a>，按照示例文档填写后上传
          </div>
        </div>
      </el-alert>
      <el-form
        ref="importForm"
        :model="importForm"
        :rules="importFormRules"
        label-position="right"
        label-width="80px"
      >
        <el-form-item label="上传文件" prop="file">
          <el-upload
            ref="upload"
            :limit="1"
            class="upload-demo"
            :action="host + 'batchUploadStudentDocument'"
            :data="importForm"
            :headers="headers"
            :before-upload="beforeUploadDocument"
            :on-success="handleUploadFileSuccess"
            :on-error="handleUploadFileError"
            :show-file-list="true"
            :auto-upload="true"
          >
            <el-button size="small" type="primary">选择文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--上下架设置弹窗-->
    <el-dialog v-el-drag-dialog width="450px" :modal="false" :close-on-click-modal="false" title="上下架设置" :visible.sync="dialogEnableVisible" @dragDialog="handleEnableDrag">
      <div ref="enableDiv">
        <el-form ref="enableForm" :rules="enableRules" :model="enableFormData" label-position="left" label-width="85px">
          <el-form-item label="上架状态" prop="enable">
            <el-select v-model="enableFormData.enable" size="mini" placeholder="请选择上架状态" clearable class="w-190">
              <el-option v-for="(item, index) in showStatusList" :key="index" :value="item.key" :label="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="saveEnable('enableForm')">
          保存
        </el-button>
        <el-button size="small" plain @click="dialogEnableVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Header from '@/views/common/header-span'
import { fetchAccountKuListDetail, handleAccountKuDel, handleAccountEnable } from '@/api/accountKu'
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import Pagination from '@/components/Pagination'
import IndustryType from './components/industryType' // secondary package based on el-pagination
export default {
  name: 'AccountKuSet',
  components: { IndustryType, Pagination, Header },
  directives: { elDragDialog, waves },
  data() {
    return {
      module: {
        plan: ''
      },
      listLoading: true,
      list: null,
      total: 10,
      listQuery: {
        title: '',
        has_month: '',
        tax_type: '',
        accountSystem: '',
        industry_name: '',
        account_type: '',
        enable: '',
        purpose: ''
      },
      pageQuery: {
        page: 1,
        page_size: 10
      },
      dialogTradeVisible: false,
      multipleSelection: [],
      importDialogVisible: false,
      importForm: {},
      importFormRules: {},
      searchState: false,
      dialogEnableVisible: false,
      enableFormData: {
        enable: ''
      },
      enableRules: {
        enable: [{ required: true, message: '请选择上下架状态', trigger: 'change' }]
      }
    }
  },
  computed: {
    title() {
      return this.$route.meta.title
    },
    // 期限
    openTime() {
      return this.$store.getters.openTime
    },
    // 纳税人类型
    payTaxTypeList() {
      return this.$store.getters.payTaxTypeList
    },
    // 会计制度
    accountSystemList() {
      return this.$store.getters.accountSystemList
    },
    // 行业
    tradeList() {
      return this.$store.getters.tradeList
    },
    // 账套类型
    accountTypeList() {
      return this.$store.getters.accountTypeList
    },
    // 上架状态
    showStatusList() {
      return this.$store.getters.showStatusList
    },
    // 账套用途
    accountUseList() {
      return this.$store.getters.accountUseList
    },
    host() {
      return window.host
    },
    headers() {
      return {
        token: this.$store.state.access_token_teacher
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchAccountKuListDetail(this.listQuery, this.pageQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // 表格选项多选
    handleSelectionChange(value) {
      this.multipleSelection = value
    },
    // 新建账套
    createAccount() {
      this.$router.push('/accountKu/addAccount')
    },
    // 单条删除
    delAccountOne(id) {
      if (id) {
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          handleAccountKuDel({ id: id }).then((response) => {
            this.$message.success('删除成功')
            this.getList()
          })
        })
      } else {
        this.$message.warning('请选择要删除的账套库')
      }
    },
    // 批量删除
    delAccountSome() {
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
          handleAccountKuDel({ id: tmpString }).then((response) => {
            this.$message.success('删除成功')
            this.getList()
          })
        }).catch(() => {
          console.log('cancel')
        })
      } else {
        this.$message({
          message: '请选择要删除的账套库',
          type: 'warning',
          duration: 2000
        })
      }
    },
    // 税率设置
    setRate() {},
    // 行业设置
    setTrade() {
      this.dialogTradeVisible = true
    },
    // 编辑
    editAccount(id) {
      this.$router.push('/accountKu/addAccount/' + id)
    },
    // 数据添加
    addData(row) {
      // 保存当前账套信息
      this.$store.commit('account/SAVE_CURRENT_ACCOUNT_DATA', row)
      this.$router.push('/accountKu/addAccountData/' + row.id)
    },
    handleEnableDrag() {
      this.$refs['enableDiv'].blur()
    },
    // 上下架设置
    setEnable(row) {
      this.enableFormData.id = row.id
      if (row.enable === '未启用') {
        this.enableFormData.enable = 0
      }
      if (row.enable === '部分启用') {
        this.enableFormData.enable = 1
      }
      this.dialogEnableVisible = true
    },
    // 上下架保存
    saveEnable(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          handleAccountEnable(this.enableFormData).then(response => {
            this.$message.success('状态保存成功')
            this.dialogEnableVisible = false
            this.getList()
          })
        }
      })
    },
    handleTradeDrag() {
      this.$refs.tradeDiv.blur()
    },
    handleImport() {
      this.importDialogVisible = true
    },
    handleDel() {},
    // 上传弹窗
    // 关闭之前，清空form
    closeImportDialog() {
      this.importForm = {}
      this.importDialogVisible = false
    },
    beforeUploadDocument(file) {
      const isLt5M = file.size / 1024 / 1024 < 5
      // 验证单次文件上传大小 不能超过5M
      if (!isLt5M) {
        this.$message.error('文件大小不得超过5M')
        return false
      }
    },
    handleUploadFileSuccess(res, file) {
      if (res.status === 1) {
        this.$message.success('行业批量导入成功')
        this.closeImportDialog()
        this.getList(null)
      } else {
        this.$refs.upload.clearFiles()
        this.$message.error(res.info)
      }
    },
    handleUploadFileError() {
      this.$refs.upload.clearFiles()
      this.$message.error('批量导入失败')
    },
    handleImportDrag() {
      this.$refs.importDiv.blur()
    }
  }
}
</script>

<style lang="scss" scoped>
  .accountKuSet {
    .header{
      height: 40px;
      line-height: 40px;
      border-bottom: solid 1px #EEEEEE;
    }
    .search-more-content{
      left: 85px;
    }
  }
</style>
