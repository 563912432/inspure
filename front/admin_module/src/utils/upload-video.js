/* eslint-disable */
import OSS from 'ali-oss'
import { videoAuth } from '@/api/objKu'
export default {
  props: {
    exam: {
      required: false,
      type: Object
    }
  },
  data() {
    return {
      submitLoading: false,
      progress: {
        show: false,
        percent: 0
      },
      videoName: '',
      editorOption: {
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            ['clean'],
            ['linkCourse.vue', 'image', 'code']
          ]
        }
      },
      uploadTemp: null, // 视频上传临时变量存储
      videoUploadConfig: {
        allowed: ['video/avi', '.avi', '.f4v', 'video/mpeg', '.mpg', 'video/mp4', '.mp4', 'video/x-flv', '.flv', 'video/x-ms-wmv', '.wmv', 'video/quicktime', '.mov', 'video/3gpp', '.3gp', '.rmvb', 'video/x-matroska', '.mkv', '.asf', '.264', '.ts', '.mts', '.dat', '.vob', 'audio/mpeg', '.mp3', 'audio/x-wav', '.wav', 'video/x-m4v', '.m4v', 'video/webm', '.webm', '.mod']
      },
      paramsData: null
    }
  },
  computed: {
    course() {
      return window.sessionStorage.getItem('current-course') ? JSON.parse(window.sessionStorage.getItem('current-course')) : null
    }
  },
  created() {
    if (this.exam.title) {
      this.tm = {
        type: this.exam.type,
        level: this.exam.level,
        title: this.exam.title,
        answer: this.exam.type === this.$store.state.examType.DUO_XUAN ? this.exam.answer.split(',') : this.exam.answer,
        parse: this.exam.parse,
        video: this.exam.video,
        options: this.exam.options,
        // 知识点
        point: this.exam.point
      }
      this.videoName = this.exam.video
    }
  },
  methods: {
    uploadChange() {
      this.$refs.videoUploadDom.clearFiles()
    },
    uploadVideo(file) {
      // 验证格式是否支持
      const isLt50M = file.file.size / 1024 / 1024 < 50
      if (this.videoUploadConfig.allowed.indexOf(file.file.type) === -1) {
        this.$message.error('不支持的视频格式')
        return false
      }
      // 验证单次文件上传大小 不能超过100M
      if (!isLt50M) {
        this.$message.error('视频文件大小不得超过50M')
        return false
      }
      this.videoName = file.file.name
      // 第一步
      this.getParamsData(() => {
        // 第二步 从保利获取阿里云OSS上传授权
        this.getOssToken(file.file)
      })
    },
    // 获取秘钥
    getParamsData(fn) {
      videoAuth().then(res => {
        this.paramsData = res.data.resultData
        fn()
      })
    },
    getOssToken(file) {
      if (!this.paramsData) {
        return false
      }
      $.ajax({
        type: 'post',
        url: 'http://api.polyv.net/v2/aliyunoss/' + this.paramsData.userid + '/init',
        data: {
          ptime: this.paramsData.ptime,
          sign: this.paramsData.sign,
          hash: this.paramsData.hash,
          title: file.name,
          describ: '',
          cataid: this.paramsData.cateid,
          tag: this.teacher.school + '_' + this.teacher.username,
          luping: 0, // 是否录屏优化
          keepsource: 0, // 是否转码
          filesize: file.size,
          autoid: 1,
          uploadType: 'plugin_aliyun_chunk',
          compatible: 1
        }
      }).then(res => {
        if (res.status !== 'success') {
          this.$message.error('获取上传授权失败')
          return false
        }
        if (file.size > res.data.remainSpace) {
          this.$message.error('上传空间不足')
          return false
        }
        this.tm.video = res.data.vid
        this.uploadTemp = {
          data: res.data,
          file: file
        }
      })
    },
    upload(n, file, fn) {
      this.progress.show = true
      const filename_oss = n.dir + n.vid + file.name.substring(file.name.lastIndexOf('.'))
      var ossClient = new OSS.Wrapper({
        endpoint: location.protocol + '//' + n.endpoint,
        bucket: n.bucketName,
        accessKeyId: n.accessId,
        accessKeySecret: n.accessKey,
        stsToken: n.token,
        secure: location.protocol.toLocaleUpperCase() === 'HTTPS:'
      })
      ossClient.multipartUpload(filename_oss, file, {
        partSize: this._getPartSize(file.size), // 分片大小
        progress: this._emitProgress
        // checkpoint: this.checkpoint,
        // startPartUpload: this._emitStartPartUpload
      }).then(response => {
        // 第四步 成功回调通知
        this.callbackPolyvNotify(response, fn)
      }).catch((error) => {
        this.$message.error('上传失败')
        console.log(error)
      })
    },
    // 分片大小
    _getPartSize(t) {
      let e
      return t <= 2147483648 ? e = 2097152 : t <= 5368709120 ? e = Math.ceil(t / 2e3) : t <= 10737418240 ? e = Math.ceil(t / 4e3) : t <= 21474836480 ? e = Math.ceil(t / 8e3) : t <= 32212254720 && (e = Math.ceil(t / 1e4)),
      e
    },
    // 进度回调
    _emitProgress(percent) {
      this.progress.percent = Math.floor(percent * 100)
      return function(done) {
        done()
      }
    },
    // 回调通知保利上传结果
    callbackPolyvNotify(response, fn) {
      const r = response.res.requestUrls[0].split('?')
      const o = r[0]
      const a = response.etag
      this.getParamsData(() => {
        const data = {
          ptime: this.paramsData.ptime,
          sign: this.paramsData.sign,
          hash: this.paramsData.hash,
          object: o.replace('https://', 'http://'),
          etag: a,
          vid: this.tm.video,
          compatible: 1
        }
        $.ajax({
          type: 'post',
          url: 'http://api.polyv.net/v2/aliyunoss/' + this.paramsData.userid + '/completeUpload',
          data: data
        }).then(res => {
          if (res.status !== 'success') {
            console.log('上传失败，失败信息：' + res.message);
          } else {
            this.$message.success('视频上传成功')
            fn()
          }
        })
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 第三步 开始上传
          if (this.uploadTemp && this.tm.video) {
            this.upload(this.uploadTemp.data, this.uploadTemp.file, () => {
              this.uploadTemp = null
              this.addTm(this.tm)
            })
          } else {
            this.addTm(this.tm)
          }
        }
      })
    },
    addTm(tm) {
      let url = 'teacher/tm'
      if (this.exam && this.exam.id) {
        url = 'teacher/tm/' + this.exam.id
      }
      tm.cid = this.course.id
      this.submitLoading = true
      axios.post(url, tm).then(res => {
        this.submitLoading = false
        if (res.data.status === 1) {
          this.$message.success(res.data.info)
          if (this.exam && this.exam.id) {
            return false
          } else {
            this.resetTmForm()
          }
        } else {
          this.$message.error(res.data.info)
        }
      }).catch(() => {
      })
    }
  }
}
