<template>
  <div class="addtimu">
    <Header :title="title" :is-back-show="true" :path-url="'/objKu/index'" />
    <div class="option-div">
      <el-radio v-for="(item,index) in timuTypeList" :key="index" v-model="type" :label="parseInt(index)" size="mini" border>
        {{ item }}
      </el-radio>
    </div>
    <div class="bg-white">
      <Danxuan v-if="timuType.DAN_XUAN === type" :ti-mu-data="tm" />
      <Duoxuan v-if="timuType.DUO_XUAN === type" :ti-mu-data="tm" />
      <Panduan v-if="timuType.PAN_DUAN === type" :ti-mu-data="tm" />
      <Tiankong v-if="timuType.TIAN_KONG === type" :ti-mu-data="tm" />
      <Jianda v-if="timuType.JIAN_DA === type" :ti-mu-data="tm" />
      <Zuhe v-if="timuType.ZU_HE === type" :ti-mu-data="tm" :ti-mu-type-list="timuTypeList" />
    </div>
  </div>
</template>

<script>
import { handleOneTm, fetchTiMuTypeList } from '@/api/objKu'
import Header from '@/views/common/header'
import Danxuan from './components/Danxuan'
import Duoxuan from './components/Duoxuan'
import Panduan from './components/Panduan'
import { mapGetters } from 'vuex'
import Tiankong from './components/Tiankong'
import Jianda from './components/Jianda'
import Zuhe from './components/Zuhe'
export default {
  name: 'AddTimu',
  components: { Zuhe, Jianda, Tiankong, Header, Danxuan, Duoxuan, Panduan },
  data() {
    return {
      type: '',
      tm: {},
      timuTypeList: []
    }
  },
  computed: {
    ...mapGetters(['timuType']),
    title() {
      return this.$route.meta.title
    }
  },
  watch: {
    type(value) {
      this.tm['type'] = value
    }
  },
  created() {
    this.initData()
    this.getTiMuTypeList()
  },
  methods: {
    initData() {
      if (this.$route.params.id) {
        // 查询当前题的详情
        handleOneTm({ id: this.$route.params.id }).then(response => {
          this.tm = response.data
          this.type = this.tm.type
        })
      } else {
        this.type = this.$store.getters.timuType.DAN_XUAN
      }
    },
    getTiMuTypeList() {
      fetchTiMuTypeList().then(response => {
        this.timuTypeList = response
      })
    }
  }
}
</script>
<style>
  .addtimu .el-radio {
    background-color: #ffffff;
    margin-right: 10px!important;
  }
</style>
<style lang="scss" scoped>
  .addtimu{
    .option-div{
      padding: 20px 5px;
      background-color: #F4FAFD;
    }
  }
</style>
