<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  name: 'ColumnGradeSection',
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'column-chart'
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
    // 设置默认的宽度为100%
    document.getElementById(this.id).style.width = '100%'
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
      const pieCharts = document.getElementById(this.id)
      pieCharts.style.width = window.innerWidth - 250 + 'px'
      this.chart = echarts.init(pieCharts)
      const option = {
        color: ['#62B6ED', '#444449', '#66F084'],
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
        xAxis: { type: 'category' },
        yAxis: {},
        series: [
          { type: 'bar' },
          { type: 'bar' },
          { type: 'bar' }
        ]
      }
      this.chart.setOption(option)
    }
  }
}
</script>
