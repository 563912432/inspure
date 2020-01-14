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
      pieCharts.style.width = (window.innerWidth - 200) / 2 + 'px'
      this.chart = echarts.init(pieCharts)

      const xAxisData = ['工程', '物流', '4S汽车', '电商', '旅游', '超市', '餐饮', '农业', '建筑', 'IT']
      const data = [86, 78, 56, 72, 93, 85, 89, 71, 52, 96]
      this.chart.setOption({
        color: ['#ABC8E9'],
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
        xAxis: [{
          type: 'category',
          data: xAxisData,
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [{
          name: 'back',
          type: 'bar',
          data: data,
          barWidth: '60%',
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: '{b}\n{c}%'
            }
          }
        }]
      })
    }
  }
}
</script>
