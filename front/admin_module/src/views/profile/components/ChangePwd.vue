<template>
  <div class="changePwd pt-20">
    <el-form ref="pwdForm" :model="pwdForm" :rules="pwdRules" label-width="100px" class="basic-form">
      <el-form-item label="旧密码" prop="password">
        <el-input v-model="pwdForm.password" type="password" size="mini" class="w-300" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="pwdForm.newPassword" type="password" size="mini" class="w-300" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="pwdForm.confirmPassword" type="password" size="mini" class="w-300" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" :loading="pwdStatus" @click="saveInfo('pwdForm')">修改</el-button>
        <!--        <el-button size="mini" @click="resetForm('pwdForm')">重置</el-button>-->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { changePwd } from '@/api/user'
export default {
  name: 'ChangePwd',
  data() {
    const checkSame = (rule, value, callback) => {
      if (value !== this.pwdForm.newPassword) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      pwdForm: {
        password: '',
        newPassword: '',
        confirmPassword: ''
      },
      pwdRules: {
        password: [
          { required: true, message: '请输入您的旧密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入您的新密码', trigger: 'blur' },
          { min: 6, max: 30, message: '密码不得小于6位或者大于30位', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入您的新密码', trigger: 'blur' },
          { validator: checkSame, trigger: 'blur' }
        ]
      },
      pwdStatus: false
    }
  },
  methods: {
    saveInfo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          changePwd({ old_password: this.pwdForm.password, new_password: this.pwdForm.newPassword }).then(response => {
            this.$message.success('修改成功')
          }).catch()
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
