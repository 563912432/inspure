<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'horizontal-chart'
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
      pieCharts.style.width = (window.innerWidth - 200) / 2 + 'px'
      this.chart = echarts.init(pieCharts)

      const yAxisData = ['中级会计', '基础会计']
      const data = [77, 86]
      this.chart.setOption({
        color: ['#A3CDF2'],
        tooltip: {
          trigger: 'axis',
          formatter: '{c}%',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'value'
          }
        ],
        yAxis: [{
          type: 'category',
          data: yAxisData,
          axisTick: {
            alignWithLabel: true
          }
        }],
        series: [{
          name: 'back',
          type: 'bar',
          data: data,
          barWidth: '60%',
          label: {
            normal: {
              show: true,
              position: 'right',
              formatter: '{b}\n{c}%'
            }
          }
        }]
      })
    }
  }
}
</script>
