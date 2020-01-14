<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  name: 'ColumnGrade',
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
      // 防止默认无宽度
      const pieCharts = document.getElementById(this.id)
      pieCharts.style.width = window.innerWidth - 250 + 'px'
      this.chart = echarts.init(pieCharts)
      const option = {
        color: ['#62B6ED', '#444449', '#66F084', '#FF9E55'],
        legend: {},
        tooltip: {},
        grid: { left: '5%', right: '5%', bottom: '5%' },
        dataset: {
          dimensions: ['title', '参考率', '及格率', '平均分', '平均时长'],
          source: [
            ['title', '参考率', '及格率', '平均分', '平均时长'],
            ['山东财经大学', 100.00, 10, 80, 60.00],
            ['山东工程学院', 100.00, 10, 80, 60.00],
            ['济南职业学院', 100.00, 10, 80, 60.00]
          ]
        },
        xAxis: { type: 'category' },
        yAxis: {},
        series: [
          { type: 'bar' },
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
