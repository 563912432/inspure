<template>
  <div class="changeTel pt-20">
    <el-form ref="modifyTelForm" :model="modifyTelForm" :rules="modifyTelFormRule" label-width="100px">
      <div class="mb-10 f-13 col-666">您当前的手机号是：{{ tel }}</div>
      <el-form-item label="新手机号码" prop="password">
        <el-input v-model="modifyTelForm.tel" clearable size="mini" class="w-300" />
      </el-form-item>
      <el-form-item label="验证码" prop="yzm">
        <el-input v-model="modifyTelForm.yzm" readonly clearable size="mini" auto-complete="off" class="w-300">
          <!--          <template slot="append">-->
          <!--            <div v-if="isUsed" class="pointer el-button&#45;&#45;text code" @click="sendCode">{{ yzmText }}</div>-->
          <!--            <div v-else class="pointer el-button&#45;&#45;text code">{{ yzmText }}</div>-->
          <!--          </template>-->
        </el-input>
      </el-form-item>
      <!--      <el-form-item label="登录密码" prop="confirmed_password">-->
      <!--        <el-input v-model="modifyTelForm.pwd" clearable type="password" size="mini" class="w-300" />-->
      <!--      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" size="mini" :loading="status" @click="saveInfo('modifyTelForm')">修改</el-button>
        <!--        <el-button size="mini" @click="resetForm('modifyTelForm')">重置</el-button>-->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { changeTel } from '@/api/user'
export default {
  name: 'ChangeTel',
  data() {
    return {
      yzmText: '发送验证码',
      status: false,
      // 修改手机号码的form表单
      modifyTelForm: {
        tel: '',
        yzm: '123123',
        pwd: ''
      },
      isUsed: true,
      modifyTelFormRule: {
        tel: [
          { required: true, message: '请输入您的新手机号码', trigger: 'blur' },
          { pattern: /^1[3-8][0-9]{9}$/, message: '手机号码格式非法', trigger: 'blur' }
        ],
        yzm: [
          { required: true, message: '请输入手机验证码', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    tel() {
      return this.$store.state.user.userInfo.tel
    }
  },
  methods: {
    resetForm(formName) {},
    sendCode() {
      if (this.modifyTelForm.tel && /^1[3-8][0-9]{9}$/.exec(this.modifyTelForm.tel)) {
        this.sendVerifyCode(this.modifyTelForm.tel, () => {
          this.$message.success('验证码已经发送')
          let i = 180
          const timer = setInterval(() => {
            if (i >= 1) {
              this.isUsed = false
              this.yzmText = i + '秒后重发'
              i--
            } else {
              this.isUsed = true
              clearInterval(timer)
              this.yzmText = '发送验证码'
            }
          }, 1000)
        })
      } else {
        this.$message.error('请填写您的新手机号码')
      }
    },
    saveInfo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          changeTel({ tel: this.modifyTelForm.tel, code: this.modifyTelForm.yzm }).then(response => {
            this.$message.success('修改成功')
            setTimeout(() => {
              window.location.reload()
            }, 1000)
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
