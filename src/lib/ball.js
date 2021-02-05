import { Sprite } from '@/lib/sprite'

export class Ball {
  constructor (options) {
    const image = new Image()
    image.src = 'balls.png'

    const yOffset = options.yOffset * 180
    this.ballCanvas = document.createElement('canvas')
    this.ballCanvas.width = 30
    this.ballCanvas.height = 30
    this.sprite = new Sprite({
      ctx: this.ballCanvas.getContext('2d'),
      image,
      width: 30,
      height: 30,
      numberOfFrames: 60,
      ticksPerFrame: 1,
      yOffset
    })
  }
}
