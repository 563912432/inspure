<style>
  .duoxuanSmall {
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
  <div class="duoxuanSmall p-20">
    <el-form ref="form" label-width="100px" :model="tm" :rules="rules">
      <el-form-item label="题目：" required>
        <quill-editor
          v-model="tm.title"
          :options="editorOption"
        />
        <div>（这里填写题目描述）</div>
      </el-form-item>
      <el-form-item v-for="(item, index) in tm.optionsTmpArr" :key="index" :label="'选项'+ optionNumberToLetter[item.key] +'：'" required>
        <quill-editor
          v-model="item.value"
          :options="editorOption"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-circle-plus-outline" class="w-100p" @click="addOption">添加一个选项</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-delete" class="w-100p" @click="delOption">删除一个选项</el-button>
      </el-form-item>
      <el-form-item label="正确答案：" prop="answer" required>
        <el-checkbox-group v-model="tm.answer">
          <el-checkbox v-for="(item, index) in tm.optionsTmpArr" :key="index" :label="optionNumberToLetter[item.key]" border>{{ optionNumberToLetter[item.key] }}</el-checkbox>
        </el-checkbox-group>
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
  name: 'DuoxuanSmall',
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
      submitLoading: false
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
        if (Array.isArray(this.tiMuData.options) && this.tiMuData.options.length > 0) {
          this.tiMuData.options.forEach((v, i) => {
            data.push({ key: i + 1, value: v })
          })
        } else {
          data = [{ key: 1, value: '' }, { key: 2, value: '' }, { key: 3, value: '' }, { key: 4, value: '' }]
        }
        this.tm = {
          type: this.tiMuData.type,
          title: this.tiMuData.title,
          answer: this.tiMuData.answer,
          parse: this.tiMuData.parse,
          optionsTmpArr: data,
          options: this.tiMuData.options
        }
      } else {
        this.tm = {
          type: this.$store.getters.timuType.DUO_XUAN,
          title: '',
          answer: [],
          parse: '',
          optionsTmpArr: [{ key: 1, value: '' }, { key: 2, value: '' }, { key: 3, value: '' }, { key: 4, value: '' }],
          options: []
        }
      }
    },
    // 添加一个选项
    addOption() {
      this.tm.optionsTmpArr.push({ key: this.tm.optionsTmpArr.length + 1, value: '' })
    },
    // 删除一个选项
    delOption() {
      if (this.tm.optionsTmpArr.length > 4) {
        this.tm.optionsTmpArr.splice(this.tm.optionsTmpArr.length - 1, 1)
      }
    },
    resetTmForm() {
      this.tm = {
        type: this.$store.getters.timuType.DUO_XUAN,
        title: '',
        answer: [],
        parse: '',
        optionsTmpArr: [{ key: 1, value: '' }, { key: 2, value: '' }, { key: 3, value: '' }, { key: 4, value: '' }],
        options: []
      }
    },
    submitForm(formName) {
      if (this.tm.title === '') {
        this.$message.error('请填写题目')
      } else {
        for (let i = 0; i < this.tm.optionsTmpArr.length; i++) {
          if (this.tm.optionsTmpArr[i].value === '') {
            this.$message.error('请填写选项')
            break
          }
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitLoading = true
            const tmpArr = []
            this.tm.optionsTmpArr.forEach(v => {
              tmpArr.push(v.value)
            })
            this.tm.options = tmpArr
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
    },
    goBack() {
      this.$router.go(-1)
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
