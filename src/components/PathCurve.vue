<template>
  <canvas ref="pathCurve" style="position: absolute; z-index: 10; margin: auto" @mousemove="mousemove"></canvas>
</template>

<script>
import { frame, level2 } from '@/lib/constants'
import { EventBus } from '@/lib/event-bus'

export default {
  data () {
    return {
      requestedFrame: 0,
      start: level2.start,
      curve: level2.curve,
      ctx: {}
    }
  },
  mounted () {
    this.canvas = this.$refs.pathCurve
    this.canvas.width = frame.width
    this.canvas.height = frame.height
    this.canvas.style.border = '1px solid'
    this.ctx = this.canvas.getContext('2d')
    this.background = new Image()
    this.background.src = 'level_1.png'
    this.background.onload = () => {
      this.drawShape(this.ctx)
    }
    this.skull = new Image()
    this.skull.src = 'skull.png'
    this.skull.onload = () => {
      this.drawShape(this.ctx)
    }

    EventBus.$on('mousemove', (e) => this.mousemove(e))
  },
  methods: {
    drawShape (ctx = this.ctx) {
      // this.ctx.filter = 'drop-shadow(-1px 1px 2px #0007)'
      // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      ctx.drawImage(this.background, 0, 0)
      ctx.shadowOffsetX = 5
      ctx.shadowOffsetY = 5
      ctx.shadowColor = 'black'
      ctx.shadowBlur = 10
      ctx.drawImage(this.skull, level2.skullPosition.x, level2.skullPosition.y)

      // ctx.font = '120px "Material Icons"'
      // ctx.strokeStyle = '#000'
      // ctx.fillStyle = '#0003'
      // ctx.strokeText('\u{13002}', 150, 150)
      // ctx.globalCompositeOperation = 'xor'
      // ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
      ctx.strokeStyle = '#5312'
      ctx.beginPath()
      ctx.lineWidth = 16
      ctx.moveTo(level2.start[0] + level2.offset.x, level2.start[1] + level2.offset.y)
      this.curve.forEach((c) => {
        ctx.bezierCurveTo(
          c[0] + level2.offset.x,
          c[1] + level2.offset.y,
          c[2] + level2.offset.x,
          c[3] + level2.offset.y,
          c[4] + level2.offset.x,
          c[5] + level2.offset.y
        )
      })
      ctx.stroke()
    },
    mousemove (e) {
      // return e
      // const x = e.pageX - frame.width / 2
      // const y = e.pageY - frame.width / 2
      // this.ctx.filter = `drop-shadow(${-x / 100}px ${-y / 100}px 3px #0007)`
      // this.requestedFrame = window.requestAnimationFrame(() => this.drawShape())
    }
  }
}
</script>

<style scoped>
.ancient {
  font-family: 'Material Icons', sans-serif;
}
</style>
