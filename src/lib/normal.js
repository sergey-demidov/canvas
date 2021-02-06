// this two functions were promoted to be global
// to make firefoxs jit happy - URGH
function clamp (x, min, max) {
  if (x < min) return min
  if (x > max) return max - 1
  return x
}

// this is basically where the magic happens
function drawLight (canvas, ctx, normals, textureData, shiny, specularity, lx, ly, lz) {
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imgData.data
  let i = 0
  let ni = 0
  let dx = 0; let dy = 0; let dz = 0
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      // get surface normal
      const nx = normals[ni]
      const ny = normals[ni + 1]
      const nz = normals[ni + 2]

      // make it a bit faster by only updateing the direction
      // for every other pixel
      if (shiny > 0 || (ni & 1) === 0) {
        // calculate the light direction vector
        dx = lx - x
        dy = ly - y
        dz = lz

        // normalize it
        const magInv = 1.0 / Math.sqrt(dx * dx + dy * dy + dz * dz)
        dx *= magInv
        dy *= magInv
        dz *= magInv
      }

      // take the dot product of the direction and the normal
      // to get the amount of specularity
      const dot = dx * nx + dy * ny + dz * nz
      let spec = Math.pow(dot, 20) * specularity
      spec += Math.pow(dot, 400) * shiny
      // spec + ambient
      const intensity = spec + 0.5

      for (let channel = 0; channel < 3; channel++) {
        data[i + channel] = Math.round(clamp(textureData[i + channel] * intensity, 0, 255))
      }
      i += 4
      ni += 3
    }
  }
  ctx.putImageData(imgData, 0, 0)
}

export function normalmap (canvasId, texture, normalmap, specularity, shiny) {
  const canvas = document.getElementById(canvasId)
  if (typeof canvas.getContext === 'undefined') {
    document.write('unsupported browser')
    return
  }

  const ctx = canvas.getContext('2d')

  function getDataFromImage (img) {
    canvas.width = img.width
    canvas.height = img.height
    ctx.clearRect(0, 0, img.width, img.height)
    ctx.drawImage(img, 0, 0)
    return ctx.getImageData(0, 0, img.width, img.height)
  }

  function loadImage (src, callback) {
    const img = document.createElement('img')
    img.onload = callback
    img.src = src
    return img
  }

  const normals = []
  let textureData = null
  const normalsImg = loadImage(normalmap, function () {
    const data = getDataFromImage(normalsImg).data
    // precalculate the normals
    for (let i = 0; i < canvas.height * canvas.width * 4; i += 4) {
      let nx = data[i]
      // flip the y value
      let ny = 255 - data[i + 1]
      let nz = data[i + 2]

      // normalize
      const magInv = 1.0 / Math.sqrt(nx * nx + ny * ny + nz * nz)
      nx *= magInv
      ny *= magInv
      nz *= magInv

      normals.push(nx)
      normals.push(ny)
      normals.push(nz)
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const textureImg = loadImage(texture, function () {
      textureData = getDataFromImage(textureImg).data
      main()
    })
  })

  function main () {
    canvas.onmousemove = function (e) {
      drawLight(canvas, ctx, normals, textureData, shiny, specularity, e.clientX + 50, e.clientY + 50, 100)
    }
  }
}
