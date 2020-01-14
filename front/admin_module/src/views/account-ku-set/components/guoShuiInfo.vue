<template>
  <div class="">
    <el-form
      ref="guoShuiCompanyInfo"
      :model="guoShuiCompanyInfo"
      :rules="rules"
      label-width="120px"
      class="guoShuiCompanyInfo"
    >
      <el-form-item prop="firm_code" label="登录密码" class="fl">
        <el-input v-model="guoShuiCompanyInfo.firm_code" class="w-223" size="mini" type="text" placeholder="例：91370305755666003U" clearable />
      </el-form-item>
      <el-form-item prop="firm_trade" label="所属行业" class="fl">
        <el-input v-model="guoShuiCompanyInfo.firm_trade" class="w-223" size="mini" type="text" placeholder="例：其他软件开发" clearable />
      </el-form-item>
      <div class="clear-float" />
      <el-form-item prop="firm_detail_trade" label="明细行业" class="fl">
        <el-input v-model="guoShuiCompanyInfo.firm_detail_trade" class="w-223" size="mini" type="text" placeholder="例：其他软件开发" clearable />
      </el-form-item>
      <el-form-item prop="firm_registration_trade" label="登记行业" class="fl">
        <el-input v-model="guoShuiCompanyInfo.firm_registration_trade" class="w-223" size="mini" type="text" placeholder="例：其他有限责任公司" clearable />
      </el-form-item>
      <div class="clear-float" />
      <el-form-item prop="firm_legal_person" label="法人姓名" class="fl">
        <el-input v-model="guoShuiCompanyInfo.firm_legal_person" class="w-223" size="mini" type="text" placeholder="例：王小二" clearable />
      </el-form-item>
      <el-form-item prop="firm_address" label="注册地址" class="fl">
        <el-input v-model="guoShuiCompanyInfo.firm_address" class="w-223" size="mini" type="text" placeholder="例：山东省淄博市张店区东方之珠" clearable />
      </el-form-item>
      <div class="clear-float" />
      <el-form-item prop="firm_operating" label="经营地址" class="fl">
        <el-input v-model="guoShuiCompanyInfo.firm_operating" class="w-223" size="mini" type="text" placeholder="例：山东省淄博市张店区东方之珠" clearable />
      </el-form-item>
      <el-form-item prop="firm_bank_code" label="开户行账号" class="fl">
        <el-input v-model="guoShuiCompanyInfo.firm_bank_code" class="w-223" size="mini" type="text" placeholder="例：5159889499889556" clearable />
      </el-form-item>
      <div class="clear-float" />
      <el-form-item prop="firm_type" label="注册类型" class="fl">
        <el-input v-model="guoShuiCompanyInfo.firm_type" class="w-223" size="mini" type="text" placeholder="例：其他有限责任公司" clearable />
      </el-form-item>
      <el-form-item prop="firm_telephone" label="联系电话" class="fl">
        <el-input v-model="guoShuiCompanyInfo.firm_telephone" class="w-223" size="mini" type="text" placeholder="例：15275918888" clearable />
      </el-form-item>
      <div class="clear-float" />
      <el-form-item prop="telephone_name" label="财务负责人姓名" class="fl">
        <el-input v-model="guoShuiCompanyInfo.telephone_name" class="w-223" size="mini" type="text" placeholder="例：李春华" clearable />
      </el-form-item>
      <el-form-item prop="taxation_name" label="办税人员姓名" class="fl">
        <el-input v-model="guoShuiCompanyInfo.taxation_name" class="w-223" size="mini" type="text" placeholder="例：苏三" clearable />
      </el-form-item>
      <div class="clear-float" />
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'GuoShuiInfo',
  props: {
    guoShuiCompanyInfo: {
      type: Object,
      required: true,
      defaults: {}
    }
  },
  data() {
    return {
      rules: {
        firm_code: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        firm_trade: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        firm_detail_trade: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        firm_registration_trade: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        firm_legal_person: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        firm_address: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        firm_operating: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        firm_bank_code: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        firm_type: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        firm_telephone: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        telephone_name: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        taxation_name: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }]
      }
    }
  }
}
</script>

<style scoped>

</style>
