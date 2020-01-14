<style>
  .panduanSmall {
    position: relative;
  }

  .ql-editor {
    height: 80px;
  }

  .el-upload {
    display: block;
  }

  .ql-toolbar.ql-snow {
    padding: 0;
  }

</style>
<template>
  <div class="panduanSmall p-20">
    <el-form ref="form" label-width="100px" :model="tm" :rules="rules">
      <el-form-item label="题目：" required>
        <quill-editor
          v-model="tm.title"
          :options="editorOption"
        />
        <div>（这里填写题目描述）</div>
      </el-form-item>
      <el-form-item label="正确答案：" prop="answer" required>
        <el-radio-group v-model="tm.answer">
          <el-radio label="A" border>正确</el-radio>
          <el-radio label="B" border>错误</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="文字解析：" required>
        <quill-editor
          v-model="tm.parse"
          :options="editorOption"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" block :loading="submitLoading" @click="submitForm('form')">保存试题</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import uploadVideo from '@/mixins/upload-video'
import { Quill } from 'vue-quill-editor'
import { ImageExtend, QuillWatch } from 'quill-image-extend-module'

Quill.register('modules/ImageExtend', ImageExtend)
export default {
  name: 'PanduanSmall',
  props: {
    tmIndex: {
      type: String,
      required: true,
      defaults: ''
    }
  },
  // mixins: [uploadVideo],
  data() {
    return {
      tm: {},
      pointStr: '', // todo
      pointArr: [], // todo
      pointIdArr: [], // todo
      rules: {
        answer: [
          { required: true, message: '正确答案 不得为空', trigger: 'change' }
        ]
      },
      editorOption: {
        modules: {
          ImageExtend: {
            loading: true,
            name: 'file',
            size: 1, // 单位为M, 1M = 1024KB
            action: window.host + 'uploadEditorImg',
            response: (res) => {
              if (res.status === 1) {
                return res.resultData
              } else {
                this.$message.error(res.info)
              }
            },
            sizeError: () => {
              this.$message.error('图片尺寸最大为1M')
            },
            // 可选参数 设置请求头部
            headers: (xhr) => {
              xhr.setRequestHeader('token', this.$store.state.access_token_teacher)
            }
          },
          toolbar: {
            container: ['bold', 'italic', 'underline', { 'script': 'sub' }, { 'script': 'super' }, 'clean', 'image'],
            handlers: {
              'image': function() {
                QuillWatch.emit(this.quill.id)
              }
            }
          }
        },
        placeholder: ''
      },
      dialogVisible: false,
      submitLoading: false,
      tiMuData: {}
    }
  },
  computed: {
    ...mapGetters(['timuType', 'optionNumberToLetter', 'tmSmall'])
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      if (this.tmIndex !== '') {
        this.tiMuData = this.tmSmall[this.tmIndex]
        this.tm = {
          type: this.tiMuData.type,
          title: this.tiMuData.title,
          answer: this.tiMuData.answer.join(','),
          parse: this.tiMuData.parse
        }
      } else {
        this.tm = {
          type: this.$store.getters.timuType.PAN_DUAN,
          title: '',
          answer: [],
          parse: ''
        }
      }
    },
    resetTmForm() {
      this.tm = {
        type: this.$store.getters.timuType.PAN_DUAN,
        title: '',
        answer: '',
        parse: ''
      }
    },
    submitForm(formName) {
      if (this.tm.title === '') {
        this.$message.error('请填写题目')
      } else {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitLoading = true
            this.tm.answer = this.tm.answer.split()
            // 存【有题目，改；没有，存】
            if (this.tmIndex !== '') {
              // this.tmSmall[this.tmIndex] = this.tm
              this.$set(this.tmSmall, this.tmIndex, this.tm) // 视图更新
              this.$store.commit('tm/SAVE_TM', this.tmSmall)
              this.$message.success('编辑成功')
              this.submitLoading = false
              this.$emit('resetType')
            } else {
              const data = this.tmSmall
              data.push(this.tm)
              this.$store.commit('tm/SAVE_TM', data)
              this.$message.success('添加成功')
              this.submitLoading = false
              this.$emit('resetType')
            }
          }
        })
      }
    },
    // dialog拖拽
    handleDrag() {
      this.$refs.div.blur()
    }
  }
}
</script>

<style lang="scss" scoped>
  .point-div{
    border: solid 1px #DCDFE6;
    padding: 5px;
    min-height: 50px;
    max-height: 100px;
    overflow-y: auto;
  }
</style>
