<template>
  <canvas ref="path"></canvas>
</template>

<script>
export default {
  data () {
    return {
      xOffset: 150,
      yOffset: 50,
      currentPosition: 0,
      requestedFrame: 0,
      start: [101, 79],
      curve: [
        [187, 101, 270, 85, 346, 120],
        [409, 149, 434, 213, 423, 269],
        [412, 326, 355, 368, 316, 379],
        [264, 394, 186, 377, 154, 354],
        [120, 330, 96, 300, 100, 245],
        [104, 193, 151, 179, 182, 171],
        [224, 160, 283, 169, 316, 184],
        [344, 197, 365, 223, 364, 255],
        [363, 293, 334, 315, 318, 321]
      ],
      path: [],
      ctx: {}
    }
  },
  mounted () {
    this.canvas = this.$refs.path
    this.canvas.width = 800
    this.canvas.height = 600
    this.canvas.style.border = '1px solid'
    this.ctx = this.canvas.getContext('2d')
    this.setPath()
    this.loop = setInterval(() => this.animate(), 50)
  },
  beforeDestroy () {
    window.clearInterval(this.loop)
  },
  methods: {
    drawShape (ctx, xOffset = this.xOffset, yOffset = this.yOffset) {
      ctx.beginPath()
      ctx.strokeStyle = '#753'
      ctx.lineWidth = 32
      ctx.moveTo(this.start[0] + xOffset, this.start[1] + yOffset)
      this.curve.forEach((c) => {
        ctx.bezierCurveTo(
          c[0] + xOffset,
          c[1] + yOffset,
          c[2] + xOffset,
          c[3] + yOffset,
          c[4] + xOffset,
          c[5] + yOffset
        )
      })
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = '#975'
      ctx.lineWidth = 28
      ctx.moveTo(this.start[0] + xOffset, this.start[1] + yOffset)
      this.curve.forEach((c) => {
        ctx.bezierCurveTo(
          c[0] + xOffset,
          c[1] + yOffset,
          c[2] + xOffset,
          c[3] + yOffset,
          c[4] + xOffset,
          c[5] + yOffset
        )
      })
      ctx.stroke()
    },
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
      this.drawShape(this.ctx)
      this.drawBall(this.ctx, this.path[this.currentPosition])
    },
    drawBall (ctx, coords) {
      this.gradient = this.ctx.createRadialGradient(
        coords[0] + this.xOffset - 5,
        coords[1] + this.yOffset - 5,
        0,
        coords[0] + this.xOffset - 5,
        coords[1] + this.yOffset - 5,
        15
      )

      this.gradient.addColorStop(0.01, '#5a5')
      this.gradient.addColorStop(0.3, '#292')
      this.gradient.addColorStop(1, '#070')

      ctx.beginPath()
      ctx.arc(
        coords[0] + this.xOffset,
        coords[1] + this.yOffset,
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
