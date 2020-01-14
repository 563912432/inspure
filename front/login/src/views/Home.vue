<template>
  <div class="index">
    <Canvas />
    <div class="login-div">
      <div class="logo"><img src="../assets/image/logo.png" alt="浪潮易云" style="width: 80px;height: 80px"></div>
      <div class="title">浪潮易云RAT理实一体云教学平台</div>
      <div class="form-div">
        <div class="flex flex-justify-center">
          <div class="flex-1 flex flex-column flex-align-center">
            <div :class="[active?'col-grey':'col-white', 'pointer']" @click="choseAccount">账户密码登录</div>
            <div :class="active?'':'line-bottom'"></div>
          </div>
          <div class="flex-1 flex flex-column flex-align-center">
            <div :class="[active?'col-white':'col-grey', 'pointer']" @click="choseTel">手机号登录</div>
            <div :class="active?'line-bottom':''"></div>
          </div>
        </div>
        <div class="loginForm">
          <el-form ref="loginForm" :model="loginForm" label-width="0" style="text-align: left">
            <div v-if="!active">
              <el-form-item prop="username">
                <el-input
                  ref="username"
                  v-model="loginForm.username"
                  clearable
                  tabindex="1"
                  :prefix-icon="userStatus?'el-icon-user-solid':'el-icon-user'"
                  name="username"
                  type="text"
                  placeholder="账号"
                  @focus="usernameFocus"
                  @blur="usernameBlur"/>
              </el-form-item>
              <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
                <el-form-item prop="password">
                  <el-input
                    :key="passwordType"
                    ref="password"
                    v-model="loginForm.password"
                    clearable
                    :type="passwordType"
                    name="password"
                    tabindex="2"
                    :prefix-icon="pwdStatus?'el-icon-lock':'el-icon-unlock'"
                    placeholder="密码"
                    @keyup.native="checkCapslock"
                    @focus="pwdFocus"
                    @blur="pwdBlur"
                  />
<!--                  <span class="show-pwd" @click="showPwd">-->
<!--                    <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />-->
<!--                  </span>-->
                </el-form-item>
              </el-tooltip>
              <!--              <el-form-item>-->
              <!--                <el-input v-model="loginForm.code" clearable prefix-icon="el-icon-message" placeholder="图片验证码" class="w-225 fl" @keyup.enter.native="handleLogin"/>-->
              <!--                <div class="fl" style="height: 48px"><img src="../../assets/image/logo.png" style="width: auto;height: 100%" alt=""></div>-->
              <!--              </el-form-item>-->
            </div>
            <div v-else>
              <el-form-item label="">
                <el-input v-model="loginForm.tel" clearable prefix-icon="el-icon-mobile-phone" placeholder="手机号"></el-input>
              </el-form-item>
              <el-form-item label="" class="send-form-item">
                <el-input v-model="loginForm.code" clearable prefix-icon="el-icon-message" placeholder="验证码" class="w-225 fl" />
                <div class="fl sendCode">发送验证码</div>
              </el-form-item>
            </div>
            <el-form-item>
              <input type="radio" class="radio_type" id="one" :value="1" v-model="loginForm.scope">
              <label for="one">管理员</label>
              <input type="radio" class="radio_type" id="two" :value="2" v-model="loginForm.scope">
              <label for="two">学校</label>
              <input type="radio" class="radio_type" id="three" :value="3" v-model="loginForm.scope">
              <label for="three">学生</label>
            </el-form-item>
            <el-form-item style="text-align: center">
              <el-button :loading="loading" type="primary" size="large" class="w-100p f-20 h-52" @click.native.prevent="handleLogin">登录</el-button>
            </el-form-item>
            <el-form-item style="text-align: center">
              <div class="flex flex-justify-space-between">
                <span>
                  <input type="checkbox" class="checkbox_type" id="checkbox" v-model="checked">
                  <label for="checkbox">记住账号</label>
                </span>
                <span class="col-fff-65 pointer">忘记密码</span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Canvas from '../components/Canvas'
import { Message } from 'element-ui'
export default {
  name: 'Home',
  components: { Canvas },
  data () {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      active: 0,
      loginForm: {
        username: '',
        password: '',
        tel: '',
        code: '',
        imgCode: '',
        scope: 1
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      checked: true,
      redirect: undefined,
      otherQuery: {},
      userStatus: false,
      pwdStatus: false
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  mounted () {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    checkCapslock ({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if ((shiftKey && (key >= 'a' && key <= 'z')) || (!shiftKey && (key >= 'A' && key <= 'Z'))) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    choseAccount () {
      if (this.active) {
        this.active = !this.active
      }
    },
    choseTel () {
      if (!this.active) {
        this.active = !this.active
      }
    },
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          const formData = { username: this.loginForm.username.trim(), password: this.loginForm.password, scope: this.loginForm.scope }
          window.axios.post('http://117.50.43.204:8000/auth/v1/login', formData).then(response => {
            const data = response.data
            if (!data.error_code) {
              switch (this.loginForm.scope) {
                case 1:
                  // 存cookie
                  this.$store.dispatch('adminLogin', data.data).then(
                    // 存之后跳转到管理端根目录
                    location.href = '/admin'
                  ).catch(() => {
                    this.loading = false
                  })
                  break
                case 2:
                  // 存cookie
                  this.$store.dispatch('orgLogin', data.data).then(
                    // 存之后跳转到管理端根目录
                    location.href = '/org'
                  ).catch(() => {
                    this.loading = false
                  })
                  break
                case 3:
                  // 存cookie
                  this.$store.dispatch('studentLogin', data.data).then(
                    // 存之后跳转到管理端根目录
                    location.href = '/student'
                  ).catch(() => {
                    this.loading = false
                  })
                  break
              }
            } else {
              Message.error(data.msg)
              this.loading = false
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery (query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    usernameFocus () {
      this.userStatus = true
    },
    usernameBlur () {
      this.userStatus = false
    },
    pwdFocus () {
      this.pwdStatus = true
    },
    pwdBlur () {
      this.capsTooltip = false
      this.pwdStatus = false
    }
  }
}
</script>
<style>
  .form-div .el-tabs__nav-wrap::after{
    height: 0;
  }
  .form-div .el-tabs__item{
    font-size: 16px;
  }
  .form-div .loginForm .el-form-item{
    margin-bottom: 20px;
  }
  .form-div .loginForm .el-form-item--medium .el-form-item__content{
    line-height: 20px;
  }
  .form-div .loginForm .el-input__inner{
    background: #3235B4;
    border: solid 1px #3235B4;
    height: 48px;
    line-height: 48px;
    font-size: 16px;
    padding-left: 50px;
    color: #ffffff;
  }
  .form-div .loginForm .el-input--medium .el-input__icon{
    line-height: 48px;
    font-size: 16px;
    margin: 0 10px;
  }
  .form-div .loginForm .el-button--primary{
    background-image: linear-gradient(154deg, #04C2FF 0%, #168FF2 100%);
    background-color: #008AD7;
    border-color: #008AD7;
  }
  .form-div .loginForm .el-button--primary:focus,
  .form-div .loginForm .el-button--primary:hover{
    background-image: none;
    background-color: #008AD7!important;
    border-color: #008AD7!important;
  }
  .form-div .loginForm .send-form-item .el-input__inner{
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: solid 1px #3F44CF;
  }
  .f-20{
    font-size: 20px;
  }
  .h-52{
    height: 52px;
  }
  .col-fff-65{
    color: rgba(255, 255, 255, 0.65);
  }
  .w-225{
    width: 225px;
  }
  .h-48{
    height: 48px;
  }
</style>
<style lang="scss" scoped>
  .index{
    letter-spacing: 1px;
    text-align: center;
    overflow: hidden;
    background: radial-gradient(circle, #3E42CB , #151A67);
    position: relative;
    .login-div{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      -webkit-transform: translateX(-50%) translateY(-50%);
      width: 440px;
      text-align: center;
    }
    .logo{
      opacity: 0.85;
    }
    .title{
      font-size: 24px;
      color: #FFFFFF;
      text-align: center;
      letter-spacing: 1.5px;
      opacity: 0.85;
      margin-top: 13px;
    }
    .form-div{
      margin-top: 45px;
      padding: 30px 35px;
      opacity: 0.85;
      background: #575AEB;
      box-shadow: 0 6px 8px 0 rgba(19,22,92,0.06);
      border-radius: 4px;
      .show-pwd {
        position: absolute;
        right: 10px;
        top: 18px;
        font-size: 16px;
        color: #ffffff;
        cursor: pointer;
        user-select: none;
      }
      .sendCode{
        height: 48px;
        line-height: 48px;
        font-size: 16px;
        color: #ffffff;
        text-align: center;
        width: 145px;
        background-color: #3235B4;
      }
      .loginForm{
        margin-top: 25px;
        label{
          font-size: 14px;
          line-height: 20px;
          display: inline-block;
          padding-left: 10px;
          margin-right: 40px;
          color: rgba(255,255,255,0.65);
          cursor: pointer;
        }
        .radio_type{
          width: 16px;
          height:16px;
          appearance: none;
          position: relative;
          outline: none;
          cursor: pointer;
        }
        .radio_type:before{
          content: '';
          width: 16px;
          height: 16px;
          border: 1px solid #787CF6;
          display: inline-block;
          border-radius: 50%;
          vertical-align: middle;
          outline: none;
        }
        .radio_type:checked:before{
          content: '';
          width: 16px;
          height: 16px;
          border: 2px solid #787CF6;
          display: inline-block;
          border-radius: 50%;
          vertical-align: middle;
          outline: none;
        }
        .radio_type:checked:after{
          content: '';
          width: 8px;
          height: 8px;
          text-align: center;
          border-color: #ffffff;
          background:#ffffff;
          border-radius: 50%;
          display: block;
          position: absolute;
          top: 6px;
          left: 6px;
          outline: none;
        }
        .radio_type:checked+label{
          color: #ffffff;
        }
        .checkbox_type{
          width: 16px;
          height: 16px;
          appearance: none;
          position: relative;
          outline: none;
          cursor: pointer;
        }
        .checkbox_type:before{
          content: '';
          width: 16px;
          height: 16px;
          border: 2px solid #787CF6;
          display: inline-block;
          border-radius: 2px;
          vertical-align: middle;
          outline: none;
        }
        .checkbox_type:checked:before{
          content: '';
          width: 16px;
          height: 16px;
          border: 2px solid #787CF6;
          background:transparent;
          display: inline-block;
          border-radius: 2px;
          vertical-align: middle;
          outline: none;
        }
        .checkbox_type:checked:after{
          content: '';
          width: 10px;
          height:5px;
          border: 2px solid white;
          border-top: transparent;
          border-right: transparent;
          text-align: center;
          display: block;
          position: absolute;
          top: 5px;
          left:4px;
          vertical-align: middle;
          transform: rotate(-45deg);
        }
        .checkbox_type:checked+label{
          color: #ffffff;
        }
      }
      .col-white{
        color: #ffffff;
      }
      .col-grey{
        color: #A0A2FF;;
      }
      .pointer{
        cursor: pointer;
      }
      .line-bottom{
        height: 2px;
        background: #FFFFFF;
        width: 60%;
        margin-top: 10px;
      }
    }
  }
</style>
