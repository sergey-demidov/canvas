<template>
  <canvas ref="frog" style="position: absolute; z-index: 30;"  @mousemove="mousemove"></canvas>
</template>

<script>
import { frame } from '@/lib/constants'

export default {
  data () {
    return {
      ctx: {},
      frogRadius: 50,
      frogPosition: {},
      angle: 0
    }
  },
  mounted () {
    this.frogPosition = { x: frame.width / 2, y: frame.height / 2 }
    this.canvas = this.$refs.frog
    this.canvas.width = frame.width
    this.canvas.height = frame.height
    this.canvas.style.border = '1px solid'
    this.ctx = this.canvas.getContext('2d')
    this.zuma = new Image()
    this.zuma.onload = () => {
      this.drawFrog()
    }
    this.zuma.src = '/zuma.png'
  },
  methods: {
    drawFrog () {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx.setTransform(1, 0, 0, 1, 0, 0)
      this.ctx.translate(this.frogPosition.x, this.frogPosition.y)
      this.ctx.rotate(this.angle)
      this.ctx.translate(-this.frogRadius, -this.frogRadius)
      this.ctx.drawImage(this.zuma, 0, 0, this.frogRadius * 2, this.frogRadius * 2)
    },
    mousemove (e) {
      this.angle = Math.atan2(e.pageX - frame.width / 2, -(e.pageY - frame.height / 2))
      this.drawFrog()
    }

  }
}
</script>

<style scoped>
</style>
