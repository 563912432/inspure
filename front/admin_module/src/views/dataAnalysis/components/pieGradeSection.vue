<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  name: 'PieGradeSection',
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'pie-chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      const option = {
        color: ['#62B6ED', '#444449', '#66F084', '#FF9E55'],
        legend: {},
        tooltip: {},
        grid: { left: '5%', right: '5%', bottom: '5%' },
        dataset: {
          source: [
            ['title', '初级会计上午', '初级会计下午', '会计实训考试'],
            ['0-59.0', 10, 30, 30],
            ['60.0-69.0', 20, 40, 10],
            ['70.0-79.0', 10, 10, 50],
            ['80.0-100.0', 30, 10, 30]
          ]
        },
        series: [
          { type: 'pie', radius: 60, center: ['25%', '30%'], encode: { itemName: 'title', value: '初级会计上午' }},
          { type: 'pie', radius: 60, center: ['75%', '30%'], encode: { itemName: 'title', value: '初级会计下午' }},
          { type: 'pie', radius: 60, center: ['50%', '75%'], encode: { itemName: 'title', value: '会计实训考试' }}
        ]
      }
      this.chart.setOption(option)
    }
  }
}
</script>
