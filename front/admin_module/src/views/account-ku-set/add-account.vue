<template>
  <div class="addAccount">
    <Header :title="title" :is-back-show="true" :path-url="'/accountKu/index'" class="mb-12" />
    <div class="bg-white box-shadow p-20">
      <el-form ref="form" :rules="rules" :model="formData" label-position="left" label-width="95px">
        <el-form-item label="账套名称" prop="title" class="w-570">
          <el-input v-model="formData.title" size="mini" />
        </el-form-item>
        <el-form-item label="所属行业" prop="trade" class="w-570">
          <el-select v-model="formData.industry_id" placeholder="请选择" size="mini">
            <el-option v-for="(item, index) in tradeList" :key="index" :value="item.id" :label="item.industry_name" />
          </el-select>
        </el-form-item>
        <el-form-item label="公司名称" prop="company" class="fl">
          <el-input v-model="formData.company" size="mini" class="w-223" />
        </el-form-item>
        <el-form-item label="税号" prop="tax_no" class="fl ml-10">
          <el-input v-model="formData.tax_no" size="mini" style="width: 178px" />
        </el-form-item>
        <div class="clear-float" />
        <el-form-item label="启用日期" prop="enable_date" class="fl">
          <el-date-picker
            v-model="formData.enable_date"
            align="right"
            type="month"
            value-format="yyyyMM"
            size="mini"
            placeholder="选择启用日期"
          />
        </el-form-item>
        <el-form-item label="会计制度" prop="account_rule" class="fl ml-10">
          <el-select v-model="formData.account_rule" placeholder="请选择会计制度" size="mini">
            <el-option v-for="(item, index) in accountSystemList" :key="index" :value="item.key" :label="item.value" />
          </el-select>
        </el-form-item>
        <div class="clear-float" />
        <el-form-item label="开户行账号" prop="account_id" class="fl">
          <el-input v-model="formData.account_id" size="mini" class="w-223" />
        </el-form-item>
        <el-form-item label="开户行名称" prop="account_name" class="fl ml-10">
          <el-input v-model="formData.account_name" size="mini" style="width: 178px" />
        </el-form-item>
        <div class="clear-float" />
        <el-form-item label="开户行地址" prop="account_address" class="">
          <el-input v-model="formData.account_address" size="mini" style="width: 223px" />
        </el-form-item>
        <el-form-item label="增值税" prop="tax_type">
          <el-radio-group v-model="formData.tax_type" size="mini">
            <el-radio v-for="(item, index) in addTaxList" :key="index" :label="item.key">{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="账套类型" prop="account_type">
          <el-radio-group v-model="formData.account_type" size="mini">
            <el-radio v-for="(item, index) in accountTypeList" :key="index" :label="item.key">{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="账套用途" prop="purpose">
          <el-radio-group v-model="formData.purpose" size="mini">
            <el-radio v-for="(item, index) in accountUseList" :key="index" :label="item.key">{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="saveAccount">保存</el-button>
          <el-button plain size="mini" @click="cancelAccount">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { handleAccountKuAdd, fetchAccountKuOne, fetchListIndustryType } from '@/api/accountKu'
import { mapGetters } from 'vuex'
import Header from '@/views/common/header'
export default {
  name: 'AddAccount',
  components: { Header },
  data() {
    return {
      formData: {
        title: '',
        company: '',
        industry_id: '',
        tax_no: '',
        tax_type: '',
        account_type: '',
        account_rule: '',
        purpose: '',
        enable_date: '',
        account_id: '',
        account_name: '',
        account_address: ''
      },
      tradeList: [],
      rules: {
        title: [{ required: true, message: '账套名称必须填写', trigger: 'blur' }],
        company: [{ required: true, message: '公司名称必须填写', trigger: 'blur' }],
        tax_no: [{ required: true, message: '税号必须填写', trigger: 'blur' }],
        industry_id: [{ required: true, message: '所属行业必须填写', trigger: 'blur' }],
        enable_date: [{ required: true, message: '请选择启用时间', trigger: 'change' }],
        account_rule: [{ required: true, message: '请选择会计制度', trigger: 'change' }],
        account_id: [{ required: true, message: '请填写开户行账号', trigger: 'blur' }],
        account_name: [{ required: true, message: '请填写开户行名称', trigger: 'blur' }],
        account_address: [{ required: true, message: '请填写开户行地址', trigger: 'blur' }],
        tax_type: [{ required: true, message: '请选择增值税', trigger: 'change' }],
        account_type: [{ required: true, message: '请选择账套类型', trigger: 'change' }],
        purpose: [{ required: true, message: '请选择账套用途', trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapGetters(['accountSystemList', 'addTaxList', 'accountTypeList', 'accountUseList']),
    title() {
      return this.$route.meta.title
    }
  },
  created() {
    if (this.$route.params.id) {
      this.getList(this.$route.params.id)
    }
    this.getTradeList()
  },
  methods: {
    getList(id) {
      fetchAccountKuOne(id).then(response => {
        const data = response.data
        this.formData = {
          title: data.title,
          company: data.company,
          industry_id: data.industry_id,
          tax_no: data.tax_no,
          tax_type: data.tax_type === '小规模纳税人' ? 2 : 1,
          account_type: data.account_type === '真账' ? 1 : 2,
          account_rule: data.account_rule,
          account_id: data.account_id,
          account_name: data.account_name,
          account_address: data.account_address,
          purpose: data.purpose === '售卖' ? 1 : 2,
          enable_date: data.enable_date
        }
      })
    },
    getTradeList() {
      // 取行业列表
      fetchListIndustryType().then(response => {
        this.tradeList = response.data
      })
    },
    saveAccount() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          handleAccountKuAdd(this.formData).then(response => {
            this.$message.success('添加成功')
            this.formData = {
              title: '',
              company: '',
              industry_id: '',
              tax_no: '',
              tax_type: '',
              account_type: '',
              account_rule: '',
              account_id: '',
              account_name: '',
              account_address: '',
              purpose: '',
              enable_date: ''
            }
            this.$nextTick(() => {
              this.$refs['form'].clearValidate()
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancelAccount() {
      this.$router.push('/accountKu/index')
    }
  }
}
</script>

<style scoped>

</style>
