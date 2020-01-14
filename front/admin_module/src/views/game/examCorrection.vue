<template>
  <div class="resultSearch">
    <ResultByExam v-if="searchResult === '1'" />
    <ResultByStudent v-if="searchResult === '2'" />
  </div>
</template>

<script>
import ResultByExam from './components/resultByExam'
import ResultByStudent from './components/resultByStudent'
export default {
  name: 'ExamCorrection',
  components: { ResultByExam, ResultByStudent },
  data() {
    return {
    }
  },
  computed: {
    searchResult() {
      if (this.$route.params.type) {
        // console.log(this.$route.params.type)
        return this.$route.params.type
      } else {
        return '1'
      }
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  .resultSearch{
    width: 80%;
    min-width: 600px;
    overflow-x: auto;
    overflow-y: hidden;
    height: 530px;
    margin: 80px auto 0;
  }
</style>
