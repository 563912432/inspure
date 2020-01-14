<template>
  <canvas id="canvas" />
</template>

<script>
export default {
  name: 'Canvas',
  data() {
    return {
      img: null,
      width: 0,
      height: 0,
      point: 35,
      canvas: null,
      context: null,
      circleArr: []
    }
  },
  mounted: function() {
    this.img = new Image()
    this.img.src = require('../../../assets/image/star.png')

    // 定义画布宽高和生成点的个数
    this.width = window.innerWidth
    this.height = window.innerHeight - 3
    this.canvas = document.getElementById('canvas')
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.context = this.canvas.getContext('2d')
    this.context.strokeStyle = 'rgba(0,0,0,0.2)'
    this.context.strokeWidth = 1
    this.context.fillStyle = 'rgba(255,255,255,.9)'
    this.init()
    setInterval(() => {
      for (var i = 0; i < this.point; i++) {
        var cir = this.circleArr[i]
        cir.x += cir.moveX
        cir.y += cir.moveY
        if (cir.x > this.width) cir.x = 0
        else if (cir.x < 0) cir.x = this.width
        if (cir.y > this.height) cir.y = 0
        else if (cir.y < 0) cir.y = this.height
      }
      this.draw()
    }, 10)
  },
  methods: {
    // 初始化生成原点
    init() {
      for (var s = 0; s < this.point; s++) {
        this.circleArr.push(this.drawCricle(this.context, this.num(this.width), this.num(this.height), this.num(15, 2), this.num(10, -10) / 40, this.num(10, -10) / 40))
      }
      this.draw()
    },
    // 绘制原点
    drawCricle(cxt, x, y, r, moveX, moveY) {
      // 点：圆心xy坐标，半径，每帧移动xy的距离
      var circle = {}
      circle.x = x
      circle.y = y
      circle.r = r
      circle.moveX = moveX
      circle.moveY = moveY
      cxt.beginPath()
      // cxt.arc(circle.x, circle.y, circle.r, 0, 2*Math.PI)
      cxt.drawImage(this.img, circle.x - r * 1.25, circle.y - r * 1.25, r * 3, r * 2.5)
      cxt.closePath()
      cxt.fill()
      return circle
    },
    // 生成max和min之间的随机数
    num(max, _min) {
      var min = arguments[1] || 0
      return Math.floor(Math.random() * (max - min + 1) + min)
    },
    // 每帧绘制
    draw() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      for (var k = 0; k < this.point; k++) {
        this.drawCricle(this.context, this.circleArr[k].x, this.circleArr[k].y, this.circleArr[k].r)
      }
      for (var i = 0; i < this.point; i++) {
        for (var j = 0; j < this.point; j++) {
          if (i + j < this.point) {
            var A = Math.abs(this.circleArr[i + j].x - this.circleArr[i].x)
            var B = Math.abs(this.circleArr[i + j].y - this.circleArr[i].y)
            var lineLength = Math.sqrt(A * A + B * B)
            var C = 1 / lineLength * 7 - 0.009
            var lineOpacity = C > 0.03 ? 0.1 : C
            if (lineOpacity > 0) {
              this.drawLine(this.context, this.circleArr[i].x, this.circleArr[i].y, this.circleArr[i + j].x, this.circleArr[i + j].y, lineOpacity)
            }
          }
        }
      }
    },
    // 绘制线条
    drawLine(cxt, x, y, _x, _y, o) {
      // 线条：开始xy坐标，结束xy坐标，线条透明度
      var line = {}
      line.beginX = x
      line.beginY = y
      line.closeX = _x
      line.closeY = _y
      line.o = o
      cxt.beginPath()
      cxt.strokeStyle = 'rgba(255,255,255,' + o + ')'
      cxt.moveTo(line.beginX, line.beginY)
      cxt.lineTo(line.closeX, line.closeY)
      cxt.closePath()
      cxt.stroke()
    }
  }
}
</script>

<style lang="scss" scoped>
  #canvas{
    position: relative;
    overflow: hidden;
  }
</style>
