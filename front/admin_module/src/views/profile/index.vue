<template>
  <div class="profile">
    <Header :title="title" />
    <div class="wrap-parent bg-white">
      <div class="wrapper-left fl">
        <el-upload
          class="avatar-uploader"
          name="avatar"
          :headers="headers"
          :action="host + 'uploadImg'"
          :show-file-list="false"
        >
          <img v-if="avatar" :src="avatar" class="avatar-img" alt="">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
        <el-button plain size="mini" style="margin-top: 20px" :loading="imgStatus" @click="saveImgUrl">保存</el-button>
      </div>
      <el-tabs v-model="activeName" class="wrapper-right fl">
        <el-tab-pane label="基础资料" name="first">
          <BasicInfo />
        </el-tab-pane>
        <el-tab-pane label="修改密码" name="second">
          <ChangePwd />
        </el-tab-pane>
        <el-tab-pane label="更换手机号" name="third">
          <ChangeTel />
        </el-tab-pane>
      </el-tabs>
      <div class="clear-float" />
    </div>
  </div>
</template>
<script>
import { changeAvatar } from '@/api/user'
import Header from '@/views/common/header'
import BasicInfo from './components/BasicInfo'
import ChangePwd from './components/ChangePwd'
import ChangeTel from './components/ChangeTel'
export default {
  name: 'Profile',
  components: { Header, BasicInfo, ChangePwd, ChangeTel },
  data() {
    return {
      imageUrl: '',
      imgStatus: false,
      activeName: 'first'
    }
  },
  computed: {
    title() {
      return this.$route.meta.title
    },
    headers() {
      return {
        token: this.$store.state.access_token_student
      }
    },
    host() {
      return this.$store.getters.host
    },
    avatar() {
      return this.$store.getters.avatar
    }
  },
  methods: {
    // 上传成功后的回调
    handleAvatarSuccess(res, file) {
    },
    // 保存上传后的图片
    saveImgUrl() {
      this.imgStatus = true
      changeAvatar({ url: 'http://www.wenyunjy.com/Uploads/20171125/5a19297d97a9a.png' }).then(response => {
        this.$message.success('保存成功')
        this.imgStatus = false
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }).catch(() => {
        this.imgStatus = false
      })
    },
    // 上传之前的回调
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式或者 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>
<style>
  .profile .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .profile .avatar-uploader .el-upload:hover {
    border-color: #7CCB40;
  }
  .profile .el-tabs__item{
    height: 20px;
    line-height: 20px;
    margin: 20px 0;
    padding: 0 30px;
    font-size: 15px;
    border-right:  solid 1px #dcdfe6;
  }
  .profile .el-tabs__item:last-child{
    border-right: none;
  }
  .profile .el-tabs__nav-wrap::after{
    height: 1px;
  }
</style>
<style lang="scss" scoped>
  .wrap-parent{
    padding: 70px 50px;
    .wrapper-left{
      width: 100px;
      text-align: center;
      margin-top: 20px;
      .avatar-uploader-icon {
        font-size: 25px;
        color: #8c939d;
        width: 80px;
        height: 80px;
        line-height: 80px!important;
        text-align: center;
      }

      .avatar-img {
        width: 80px;
        height: 80px!important;
        display: block;
      }
    }
    .wrapper-right{
      margin-left: 60px;
      width: 600px;
    }
  }
</style>
