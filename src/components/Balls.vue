<template>
  <canvas ref="canvas1" style="position: absolute; z-index: 20; margin: auto;"></canvas>
</template>

<script>
import { frame, level2 } from '@/lib/constants'
import { Ball } from '@/lib/ball'

export default {
  data () {
    return {
      currentPosition: 0,
      requestedFrame: 0,
      start: level2.start,
      curve: level2.curve,
      path: [],
      ctx: {},
      pathTick: 1
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
    this.balls = [
      new Ball({ yOffset: 0 }),
      new Ball({ yOffset: 1 }),
      new Ball({ yOffset: 2 }),
      new Ball({ yOffset: 3 }),
      new Ball({ yOffset: 4 }),
      new Ball({ yOffset: 5 })
    ]

    // console.log(sprite)
  },
  beforeDestroy () {
    window.clearInterval(this.loop)
  },
  methods: {
    setPath () {
      let last = level2.start.slice()
      this.path = []
      let dirtyPath = []
      const quantize = 2000
      level2.curve.forEach((c) => {
        for (let i = 0; i < quantize; i += 1) {
          const coordinates = getBezierXY(i / quantize, last[0], last[1], ...c)
          coordinates.push(getBezierAngle(i / quantize, last[0], last[1], ...c))
          dirtyPath.push(coordinates)
        }
        last = [c[4], c[5]]
      })
      this.path = dirtyPath.reduce((memo, current) => {
        if (memo.length === 0) {
          return [current]
        }
        const lastMemo = memo[memo.length - 1]
        const len = getLineLen(lastMemo[0], lastMemo[1], current[0], current[1])
        if (len > this.pathTick) {
          return [...memo, current]
        }
        return memo
      }, [dirtyPath[0]])
      console.dir(this.path)
      dirtyPath = []
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
      this.drawBalls()
    },
    drawBalls () {
      // this.curve.forEach((c) => {
      //   this.ctx.fillRect(offset.x + c[4] - 1, offset.y + c[5] - 1, 3, 3) // fill in the pixel at (10,10)
      // })
      // this.path.forEach((c) => {
      //   this.ctx.fillRect(level2.offset.x + c[0], level2.offset.y + c[1], 1, 1) // fill in the pixel at (10,10)
      // })
      this.balls.forEach((ball, index) => {
        const position = this.currentPosition - index * 29
        if (position < 0) return
        ball.sprite.render(position, this.path[position][2])
        this.ctx.shadowColor = 'black'
        this.ctx.shadowBlur = 15

        this.ctx.drawImage(ball.ballCanvas, this.path[position][0] + level2.offset.x - 15, this.path[position][1] + level2.offset.y - 15, 30, 30)
      })
    }
  }
}

// function getBezierLen (sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey) {
//   let res = 0
//   let last = getBezierXY(0, sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey)
//   for (let i = 1; i < 100; i += 1) {
//     const current = getBezierXY(i / 100, sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey)
//     res += Math.sqrt(Math.pow((last[0] - current[0]), 2) + Math.pow((last[1] - current[1]), 2))
//     last = current
//   }
//   return res * 1.01
// }

// eslint-disable-next-line no-extend-native
Array.prototype.last = function () {
  return this[this.length - 1]
}

function getLineLen (sx, sy, ex, ey) {
  return Math.sqrt(Math.pow((sx - ex), 2) + Math.pow((sy - ey), 2))
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

function getBezierAngle (t, sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey) {
  const dx = Math.pow(1 - t, 2) * (cp1x - sx) + 2 * t * (1 - t) * (cp2x - cp1x) + t * t * (ex - cp2x)
  const dy = Math.pow(1 - t, 2) * (cp1y - sy) + 2 * t * (1 - t) * (cp2y - cp1y) + t * t * (ey - cp2y)
  return -Math.atan2(dx, dy) + 0.5 * Math.PI
}
</script>

<style scoped>
</style>
