<template>
  <div class="EyunIndex">
    <input id="param" v-model="formParam" type="hidden" name="param">
    <iframe class="certificate-detail" :src="src" name="iframe" frameborder="0" width="100%" height="100%" />
  </div>
</template>

<script>
import { fetchAccountKuOne } from '@/api/accountKu'
export default {
  name: 'EYunIndex',
  data() {
    return {
      uuid: '',
      formParam: '',
      src: ''
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      const id = this.$store.state.account.currentAccountData.id
      // const userid = this.$store.state.user.userInfo.tel
      const userid = this.$store.state.account.currentAccountData.create_user_tel
      const dbid = this.$store.state.account.currentAccountData.dbid
      // 取登录凭证
      fetchAccountKuOne(id).then(response => {
        this.uuid = response.data.eyun_token
        this.formParam = JSON.stringify({ userid: userid, dbid: dbid, pwd: 'abcd123456789' })
        this.src = 'e-yun.html'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.EyunIndex{
  width: 100%;
  height: 100%;
  overflow-y: hidden;
}
</style>
