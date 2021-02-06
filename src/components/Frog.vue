<template>
  <canvas ref="frog" style="position: absolute; z-index: 30;"  @mousemove="mousemove" @click="click"></canvas>
</template>

<script>
import { frame, level2 } from '@/lib/constants'
import { EventBus } from '@/lib/event-bus'
import { Ball } from '@/lib/ball'

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
    this.frogPosition = { x: level2.frogPosition.x, y: level2.frogPosition.y }
    this.canvas = this.$refs.frog
    this.canvas.width = frame.width
    this.canvas.height = frame.height
    this.canvas.style.border = '1px solid'
    this.ctx = this.canvas.getContext('2d')
    this.zuma = new Image()
    this.zuma.onload = () => {
      this.drawFrog()
    }
    this.bullet = new Ball({ yOffset: 0 })
    this.zuma.src = '/zuma.png'
    this.bulletPosition = -20
    this.loop = setInterval(() => this.animateBullet(), 1000 / frame.rafe)
  },
  methods: {
    drawFrog () {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx.setTransform(1, 0, 0, 1, 0, 0)
      this.ctx.translate(this.frogPosition.x, this.frogPosition.y)
      this.ctx.rotate(this.angle)
      this.ctx.translate(-this.frogRadius, -this.frogRadius)
      this.ctx.shadowColor = 'black'
      this.ctx.shadowBlur = 1

      this.ctx.drawImage(this.zuma, 0, 0, this.frogRadius * 2, this.frogRadius * 2)
      this.bullet.sprite.render(this.bulletPosition + 20, Math.PI * 1.5)
      this.clearCircle(this.bullet.ctx, 15, this.bulletPosition - 15, 40)
      this.ctx.shadowColor = 'black'
      this.ctx.shadowBlur = 5
      this.ctx.drawImage(this.bullet.ballCanvas, 35, -this.bulletPosition + 5)
    },
    mousemove (e) {
      this.angle = Math.atan2(e.pageX - level2.frogPosition.x, -(e.pageY - level2.frogPosition.y))
      this.drawFrog()
      EventBus.$emit('mousemove', e)
    },
    click () {
      this.bullet = new Ball({ yOffset: Math.floor(Math.random() * 6) })
      this.bulletPosition = -20
    },
    animateBullet () {
      if (this.bulletPosition < 0) {
        this.bulletPosition += 1
        this.drawFrog()
      }
    },
    clearCircle (ctx, x, y, radius) {
      ctx.save()
      ctx.globalCompositeOperation = 'destination-in'
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

  },
  beforeDestroy () {
    window.clearInterval(this.loop)
  }
}
</script>

<style scoped>
</style>
