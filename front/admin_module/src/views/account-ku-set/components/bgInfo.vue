<template>
  <div class="BgInfo">
    <!--<div class="flex">
      <span>使用税种：</span>
      <div class="tax-div flex-1">
        <span v-if="taxCate && taxCate.length > 0">
          <el-button v-for="(item, index) in taxCate" :key="index" size="mini" plain>
            {{ item.title + item.tax }} <i class="el-icon-close el-icon&#45;&#45;right" @click="delTax(index)"></i>
          </el-button>
        </span>
        <el-button class="fr" type="primary" size="small" @click="addTax">
          添加
        </el-button>
      </div>
    </div>-->
    <div class="">
      <div>账套背景信息：</div>
      <div class="pt-10">
        <quill-editor
          v-model="info"
          :options="editorOption"
        />
      </div>
    </div>
    <div class="mt-10">
      <el-button type="primary" size="small" @click="next">
        下一步
      </el-button>
    </div>
    <!--税种设置-->
    <el-dialog
      v-el-drag-dialog
      :modal="false"
      title="税种设置"
      :visible.sync="dialogTaxVisible"
      :close-on-click-modal="false"
      width="450px"
      center
      @dragDialog="handleTaxDrag"
    >
      <div ref="taxDiv">
        <TaxType />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import { Quill } from 'vue-quill-editor'
import { ImageExtend, QuillWatch } from 'quill-image-extend-module'
import TaxType from './taxType'
Quill.register('modules/ImageExtend', ImageExtend)
export default {
  name: 'BgInfo',
  components: { TaxType },
  directives: { elDragDialog },
  props: {
    status: {
      type: Boolean,
      required: true,
      defaults: true
    }
  },
  data() {
    return {
      editorOption: {
        modules: {
          ImageExtend: {
            loading: true,
            name: 'file',
            size: 1, // 单位为M, 1M = 1024KB
            action: window.domain + 'uploadEditorImg',
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
              xhr.setRequestHeader('token', this.$store.getters.token)
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
        }
      },
      info: '',
      taxCate: [],
      dialogTaxVisible: false
    }
  },
  watch: {
    status(value) {
      if (value) {
        this.initData()
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      const accountAnswer = this.$store.getters.accountAnswer
      if (accountAnswer.material) {
        this.info = accountAnswer.material
      }
    },
    // 新增税种
    addTax() {
      this.dialogTaxVisible = true
    },
    handleTaxDrag() {
      this.$refs['taxDiv'].blur()
    },
    delTax(index) {
      this.$confirm('确定要删除当前的税种吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = this.taxCate
        data.splice(index, 1)
        this.$store.commit('account/SAVE_TAX', data)
        this.$message.success('删除成功')
        this.initData()
      }).catch(() => {
        console.log('cancel')
      })
    },
    next() {
      // 保存背景信息
      if (this.info === '') {
        this.$message.warning('请填写背景信息')
      } else {
        this.$store.commit('account/SAVE_BG_INFO', this.info)
        // this.$store.commit('account/SAVE_TAX', this.taxCate)
        // this.$message.success('保存成功')
        // console.log(this.$store.getters.accountAnswer)
      }
      this.$emit('next')
    }
  }
}
</script>
<style>
  .BgInfo .ql-editor {
    height: 500px;
  }
</style>
<style lang="scss" scoped>
  .BgInfo{
    padding: 20px 0 0 10px;
    .tax-div{
      border: solid 1px #DCDFE6;
      padding: 5px;
      min-height: 50px;
      max-height: 200px;
      overflow-y: auto;
    }
  }
</style>
