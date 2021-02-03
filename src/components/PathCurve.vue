<template>
  <canvas ref="pathCurve" style="position: absolute; z-index: 10; margin: auto"></canvas>
</template>

<script>
import { frame, offset, level1 } from '@/lib/constants'

export default {
  data () {
    return {
      requestedFrame: 0,
      start: level1.start,
      curve: level1.curve,
      ctx: {}
    }
  },
  mounted () {
    this.canvas = this.$refs.pathCurve
    this.canvas.width = frame.width
    this.canvas.height = frame.height
    this.canvas.style.border = '1px solid'
    this.ctx = this.canvas.getContext('2d')
    this.drawShape(this.ctx)
  },
  methods: {
    drawShape (ctx) {
      ctx.beginPath()
      ctx.strokeStyle = '#753'
      ctx.lineWidth = 32
      ctx.moveTo(this.start[0] + offset.x, this.start[1] + offset.y)
      this.curve.forEach((c) => {
        ctx.bezierCurveTo(
          c[0] + offset.x,
          c[1] + offset.y,
          c[2] + offset.x,
          c[3] + offset.y,
          c[4] + offset.x,
          c[5] + offset.y
        )
      })
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = '#975'
      ctx.lineWidth = 28
      ctx.moveTo(this.start[0] + offset.x, this.start[1] + offset.y)
      this.curve.forEach((c) => {
        ctx.bezierCurveTo(
          c[0] + offset.x,
          c[1] + offset.y,
          c[2] + offset.x,
          c[3] + offset.y,
          c[4] + offset.x,
          c[5] + offset.y
        )
      })
      ctx.stroke()
    }
  }
}
</script>

<style scoped>
</style>
