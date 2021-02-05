export class Sprite {
  constructor (options) {
    this.ctx = options.ctx
    this.image = options.image
    this.frameIndex = 0
    this.numberOfFrames = options.numberOfFrames || 1
    this.yOffset = options.yOffset || 0
    this.width = options.width
    this.height = options.height
    this.tick = options.tick || 2
  }

  render (index = 0, angle = 0) {
    const rotateAngle = angle - Math.PI / 2
    this.frameIndex = (Math.floor(index / this.tick)) % this.numberOfFrames
    this.ctx.clearRect(0, 0, this.width, this.height)

    this.ctx.save()
    this.ctx.translate(this.width / 2, this.height / 2)
    this.ctx.rotate(rotateAngle)
    this.ctx.translate(-this.width / 2, -this.height / 2)
    this.ctx.drawImage(
      this.image,
      this.xPosition(this.frameIndex),
      this.yPosition(this.frameIndex),
      this.width,
      this.height,
      0,
      0,
      this.width,
      this.height
    )
    this.ctx.restore()
  }

  xPosition (index) {
    const cols = this.image.width / this.width
    return index % cols * this.width
  }

  yPosition (index) {
    const cols = this.image.width / this.width
    return this.yOffset + Math.floor(index / cols) * this.height
  }
}
