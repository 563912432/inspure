<template>
  <div class="smallTm">
    <DanxuanSmall v-if="timuType.DAN_XUAN === parseInt(type)" :tm-index="tmSmallIndex.toString()" @resetType="resetType" />
    <DuoxuanSmall v-if="timuType.DUO_XUAN === parseInt(type)" :tm-index="tmSmallIndex.toString()" @resetType="resetType" />
    <PanduanSmall v-if="timuType.PAN_DUAN === parseInt(type)" :tm-index="tmSmallIndex.toString()" @resetType="resetType" />
    <TiankongSmall v-if="timuType.TIAN_KONG === parseInt(type)" :tm-index="tmSmallIndex.toString()" @resetType="resetType" />
    <JiandaSmall v-if="timuType.JIAN_DA === parseInt(type)" :tm-index="tmSmallIndex.toString()" @resetType="resetType" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import DanxuanSmall from './DanxuanSmall'
import DuoxuanSmall from './DuoxuanSmall'
import PanduanSmall from './PanduanSmall'
import TiankongSmall from './TiankongSmall'
import JiandaSmall from './JiandaSmall'
export default {
  name: 'SmallTm',
  components: { JiandaSmall, TiankongSmall, PanduanSmall, DuoxuanSmall, DanxuanSmall },
  props: {
    type: {
      type: String,
      required: true,
      defaults: ''
    },
    tmSmallIndex: {
      type: String,
      required: true,
      defaults: ''
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['timuType']),
    title() {
      return this.$route.meta.title
    }
  },
  methods: {
    resetType() {
      this.$emit('resetType')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
