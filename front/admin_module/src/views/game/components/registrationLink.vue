<template>
  <div class="link">
    <div id="qrcode" ref="qrcode" />
    <p>微信扫码可直接报名</p>
    <el-input v-model="linkUrl" :readonly="true">
      <template slot="prepend">报名地址：</template>
      <el-button slot="append" v-clipboard:copy="linkUrl" v-clipboard:success="onCopy" v-clipboard:error="onError" class="shareline" @click="copyLink">复制链接</el-button>
    </el-input>
    <el-button plain size="small" class="mt-10 mb-5" @click="downs">下载</el-button>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'

export default {
  name: 'RegistrationLink',
  data() {
    return {
      linkUrl: 'https://www.inspur.com/exam/101',
      gameName: '', // 比赛名称
      gameId: '' // 比赛ID
    }
  },
  mounted() {
    setTimeout(() => {
      this.qrcodeScan() // 注：需在mounted里触发qrcodeScan函数
    })
  },
  methods: {
    copyLink() {
      console.log('复制链接')
    },
    // 复制成功后的操作
    onCopy() {
      this.$message({
        message: '链接复制成功',
        type: 'success'
      })
    },
    // 复制失败后的操作
    onError() {
      this.$message.error('链接复制失败')
    },
    // 根据地质生成二维码
    qrcodeScan() {
      new QRCode('qrcode', {
        width: 150, // 二维码宽度
        height: 150, // 二维码高度
        text: 'https://www.inspur.com/exam/101' // 二维码链接
      })
    },
    // 二维码下载
    downs() {
      // //找到canvas标签
      const myCanvas = document.getElementById('qrcode').getElementsByTagName('canvas')
      const img = document.getElementById('qrcode').getElementsByTagName('img')
      // // //创建一个a标签节点
      const a = document.createElement('a')
      const gameName = this.gameName
      // //设置a标签的href属性（将canvas变成png图片）
      const imgURL = myCanvas[0].toDataURL('image/jpg')
      const ua = navigator.userAgent
      if (ua.indexOf('Trident') !== -1 && ua.indexOf('Windows') !== -1) { // IE内核 并且  windows系统 情况下 才执行;
        var bstr = atob(imgURL.split(',')[1])
        var n = bstr.length
        var u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        var blob = new Blob([u8arr])
        window.navigator.msSaveOrOpenBlob(blob, gameName + '.' + 'png')
      } else if (ua.indexOf('Firefox') > -1) { // 火狐兼容下载
        const blob = this.base64ToBlob(imgURL) // new Blob([content]);
        const evt = document.createEvent('HTMLEvents')
        evt.initEvent('click', true, true) // initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
        a.download = ' ' // 下载图片名称，如果填内容识别不到，下载为未知文件，所以我这里就不填为空
        a.href = URL.createObjectURL(blob)
        a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window })) // 兼容火狐
      } else { // 谷歌兼容下载
        img.src = myCanvas[0].toDataURL('image/jpg')
        // a.href = myCanvas[0].toDataURL('image/png').replace('image/png', 'image/octet-stream')
        a.href = img.src
        // 设置下载文件的名字
        a.download = gameName
        // 点击
        a.click()
      }
    },
    // base64转blob
    base64ToBlob(code) {
      const parts = code.split(';base64,')
      const contentType = parts[0].split(':')[1]
      const raw = window.atob(parts[1])
      const rawLength = raw.length
      const uInt8Array = new Uint8Array(rawLength)
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
      }
      return new Blob([uInt8Array], { type: contentType })
    }
  }
}
</script>

<style>
  .link img{
    margin: 15px auto;
  }
</style>
<style scoped>
  .link{
    text-align: center;
  }
  .link p{
    margin: 10px;
  }
  .mb-5 {
    margin-bottom: 5px;
  }
</style>
