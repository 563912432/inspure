<template>
  <div class="YuLan">
    <div class="mb-12 flex flex-justify-space-between">
      <span>
        <el-select v-model="month" placeholder="请选择月份" size="small">
          <el-option v-for="(item, index) in monthData" :key="index" :label="item" :value="item" />
        </el-select>
      </span>
    </div>
    <!--    <div class="h-20 line-height-20">账套使用税种税率分别为：</div>-->
    <!--    <div class="h-20 line-height-20">-->
    <!--      <span v-for="(item, index) in accountAnswer['bgInfo']['taxCate']" :key="index" class="mr-20">{{ item['title'] }}：{{ item['tax'] }}</span>-->
    <!--    </div>-->
    <div class="mt-10">
      <div class="line-height-20" v-html="accountAnswer['material']" />
    </div>
    <div class="h-20 line-height-20 mb-10">二、根据以下交易和事项填写并审核凭证</div>
    <div v-for="(item, index) in accountAnswer['yeWu'][month]" :key="index" class="mb-8">
      <span>{{ item.material }}</span>
      <span v-if="item['materialImg'] && item['materialImg'].length > 0">
        <span>（原始单据：</span>
        <span v-for="(img, imgIndex) in item['materialImg']" :key="imgIndex">
          <span class="text-blue pointer mr-10" @click="imgDetail(img['url'])">{{ img['title'] }}</span>
        </span>
        <span>）</span>
      </span>
    </div>
    <!--图片查看-->
    <el-dialog
      v-el-drag-dialog
      :modal="false"
      title="查看凭证"
      :visible.sync="imageVisible"
      :close-on-click-modal="false"
      width="600px"
      center
      @dragDialog="handleImageDrag"
    >
      <div ref="imageDiv" class="">
        <img :src="imageUrl" alt="" style="width: 100%;height: auto">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
export default {
  name: 'YuLan',
  directives: { elDragDialog },
  data() {
    return {
      imageVisible: false,
      imageUrl: '',
      monthData: [],
      month: ''
    }
  },
  computed: {
    accountAnswer() {
      return this.$store.getters.accountAnswer
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      if (this.accountAnswer.accountData && this.accountAnswer.accountData.length > 0) {
        this.accountAnswer.accountData.forEach(v => {
          this.monthData.push(v.month)
        })
        this.month = this.monthData[0] // 第一个月份
      } else {
        this.$message.warning('请先维护月份')
      }
    },
    imgDetail(imgUrl) {
      this.imageUrl = imgUrl
      this.imageVisible = true
    },
    handleImageDrag() {
      this.$refs['imageDiv'].blur()
    }
  }
}
</script>

<style lang="scss" scoped>
  .YuLan{
    padding: 10px 0 10px 10px;
    .h-20 {
      height: 20px;
    }
    .line-height-20 {
      line-height: 20px;
    }
    .text-blue {
      color: #0378D9;
    }
    .mr-10 {
      margin-right: 10px;
    }
    .mb-8 {
      margin-bottom: 8px;
    }
  }
</style>
