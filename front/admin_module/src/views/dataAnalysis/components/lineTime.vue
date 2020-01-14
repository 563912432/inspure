<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  name: 'LineTime',
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
        legend: { left: 'center', data: ['平均时长', '张三', '李四'] },
        tooltip: { trigger: 'item' },
        grid: { left: '5%', right: '5%', bottom: '5%', containLabel: true },
        xAxis: { type: 'category', name: '考试', splitLine: { show: false }, data: ['基础会计期末考试', '初级会计考试', '会计实操考试'] },
        yAxis: { name: '时长' },
        series: [
          { name: '平均时长', type: 'line', data: [60, 100, 80] },
          { name: '张三', type: 'line', data: [100, 80, 30] },
          { name: '李四', type: 'line', data: [50, 70, 100] }
        ]
      }
      this.chart.setOption(option)
    }
  }
}
</script>
