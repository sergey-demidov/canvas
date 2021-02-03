<template>
  <canvas ref="canvas1" style="position: absolute; z-index: 20; margin: auto;"></canvas>
</template>

<script>
import { frame, offset, level1 } from '@/lib/constants'

export default {
  data () {
    return {
      currentPosition: 0,
      requestedFrame: 0,
      start: level1.start,
      curve: level1.curve,
      path: [],
      ctx: {}
    }
  },
  mounted () {
    this.canvas = this.$refs.canvas1
    this.canvas.width = frame.width
    this.canvas.height = frame.height
    this.canvas.style.border = '1px solid'
    this.ctx = this.canvas.getContext('2d')
    this.setPath()
    this.loop = setInterval(() => this.animate(), 1000 / frame.rafe)
  },
  beforeDestroy () {
    window.clearInterval(this.loop)
  },
  methods: {
    setPath () {
      let last = this.start.slice()
      this.path = [last]
      this.curve.forEach((c) => {
        for (let i = 0; i < 1000; i += 1) {
          const coordinates = getBezierXY(i / 1000, last[0], last[1], ...c)
          if (!isCoordsCloser(coordinates, this.path[this.path.length - 1])) {
            this.path.push(coordinates)
          }
        }
        last = [c[4], c[5]]
      })
    },
    animate () {
      this.requestedFrame = window.requestAnimationFrame(this.update)
      if (this.currentPosition >= this.path.length - 1) {
        this.currentPosition = 0
      } else {
        this.currentPosition += 1
      }
    },
    update () {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.drawBall(this.ctx, this.path[this.currentPosition])
    },
    drawBall (ctx, coords) {
      this.gradient = this.ctx.createRadialGradient(
        coords[0] + offset.x - 5,
        coords[1] + offset.y - 5,
        0,
        coords[0] + offset.x - 5,
        coords[1] + offset.y - 5,
        15
      )

      this.gradient.addColorStop(0.01, '#5a5')
      this.gradient.addColorStop(0.3, '#292')
      this.gradient.addColorStop(1, '#070')

      ctx.beginPath()
      ctx.arc(
        coords[0] + offset.x,
        coords[1] + offset.y,
        15,
        0,
        Math.PI * 2
      )
      ctx.fillStyle = this.gradient
      ctx.fill()
      ctx.closePath()
    }
  }
}

function getBezierXY (t, sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey) {
  return [
    Math.pow(1 - t, 3) * sx +
      3 * t * Math.pow(1 - t, 2) * cp1x +
      3 * t * t * (1 - t) * cp2x +
      t * t * t * ex,
    Math.pow(1 - t, 3) * sy +
      3 * t * Math.pow(1 - t, 2) * cp1y +
      3 * t * t * (1 - t) * cp2y +
      t * t * t * ey
  ]
}

function isCoordsCloser (a1, a2) {
  return a1.every((v, i) => Math.round(v) === Math.round(a2[i]))
}
</script>

<style scoped>
</style>
