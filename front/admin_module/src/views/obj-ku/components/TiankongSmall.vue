<style>
  .tiankongSmall {
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
  <div class="tiankongSmall p-20">
    <el-form ref="form" label-width="100px" :model="tm">
      <el-form-item label="题目：" required>
        <quill-editor
          v-model="tm.title"
          :options="editorOption"
        />
        <div>（这里填写题目描述）</div>
      </el-form-item>
      <!--答案-->
      <el-form-item v-for="(item, index) in tm.answerTmpArr" :key="index" :label="'填空'+ item.key +'：'" required>
        <quill-editor
          v-model="item.value"
          :options="editorOption"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-circle-plus-outline" class="w-100p" @click="addAnswer">添加一个填空</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-delete" class="w-100p" @click="delOption">删除一个填空</el-button>
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
  name: 'TiankongSmall',
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
        let data = []
        if (Array.isArray(this.tiMuData.answer) && this.tiMuData.answer.length > 0) {
          this.tiMuData.answer.forEach((v, i) => {
            data.push({ key: i + 1, value: v })
          })
        } else {
          data = [{ key: 1, value: '' }]
        }
        this.tm = {
          type: this.tiMuData.type,
          title: this.tiMuData.title,
          parse: this.tiMuData.parse,
          answerTmpArr: data,
          answer: this.tiMuData.answer
        }
      } else {
        this.tm = {
          type: this.$store.getters.timuType.TIAN_KONG,
          title: '',
          answer: [],
          parse: '',
          answerTmpArr: [{ key: 1, value: '' }]
        }
      }
    },
    // 添加一个填空答案
    addAnswer() {
      this.tm.answerTmpArr.push({ key: this.tm.answerTmpArr.length + 1, value: '' })
    },
    // 删除一个填空答案
    delOption() {
      if (this.tm.answerTmpArr.length > 1) {
        this.tm.answerTmpArr.splice(this.tm.answerTmpArr.length - 1, 1)
      }
    },
    resetTmForm() {
      this.tm = {
        type: this.$store.getters.timuType.TIAN_KONG,
        title: '',
        answer: [],
        parse: '',
        answerTmpArr: [{ key: 1, value: '' }]
      }
    },
    submitForm(formName) {
      if (this.tm.title === '') {
        this.$message.error('请填写题目')
      } else {
        for (let i = 0; i < this.tm.answerTmpArr.length; i++) {
          if (this.tm.answerTmpArr[i].value === '') {
            this.$message.error('请填写填空答案')
            break
          }
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitLoading = true
            const tmpArr = []
            this.tm.answerTmpArr.forEach(v => {
              tmpArr.push(v.value)
            })
            this.tm.answer = tmpArr
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
