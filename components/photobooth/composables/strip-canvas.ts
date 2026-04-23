export type FrameKind = 'classic' | 'polaroid' | 'vintage' | 'modern' | 'love'

export interface TemplateLayout {
  cols: number
  width: number
  gap: number
  fillByColumns: boolean
  centerLastRow: boolean
  footer: number
}

export interface Slot {
  x: number
  y: number
  w: number
  h: number
}

export function getTemplateLayout(templateId: string, count: number): TemplateLayout {
  if (templateId === 'classic-strip' && count === 8) {
    return { cols: 2, width: 760, gap: 16, fillByColumns: true, centerLastRow: false, footer: 110 }
  }

  if (templateId === 'grid-2x2') {
    return { cols: 2, width: 760, gap: 16, fillByColumns: false, centerLastRow: true, footer: 110 }
  }

  if (templateId === 'grid-3x3') {
    return { cols: 3, width: 900, gap: 14, fillByColumns: false, centerLastRow: true, footer: 92 }
  }

  if (templateId === 'grid-4x4') {
    return { cols: 4, width: 1080, gap: 12, fillByColumns: false, centerLastRow: true, footer: 88 }
  }

  return { cols: 1, width: 600, gap: 20, fillByColumns: false, centerLastRow: false, footer: 110 }
}

export function buildSlots(
  padding: number,
  gap: number,
  rows: number,
  cols: number,
  w: number,
  h: number,
  itemCount: number,
  fillByColumns = false,
  centerLastRow = false,
): Slot[] {
  const slots: Slot[] = []

  if (fillByColumns) {
    for (let c = 0; c < cols; c += 1) {
      for (let r = 0; r < rows; r += 1) {
        slots.push({
          x: padding + c * (w + gap),
          y: padding + r * (h + gap),
          w,
          h,
        })
      }
    }
    return slots
  }

  for (let r = 0; r < rows; r += 1) {
    const remaining = itemCount - r * cols
    const colsInRow = Math.max(0, Math.min(cols, remaining))
    if (colsInRow === 0) break
    const rowOffset = centerLastRow ? ((cols - colsInRow) * (w + gap)) / 2 : 0
    for (let c = 0; c < colsInRow; c += 1) {
      slots.push({
        x: padding + rowOffset + c * (w + gap),
        y: padding + r * (h + gap),
        w,
        h,
      })
    }
  }

  return slots
}

export function drawFrameBackground(
  ctx: CanvasRenderingContext2D,
  kind: FrameKind,
  width: number,
  height: number,
  baseBg: string,
) {
  if (kind === 'modern') {
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, '#eef4ff')
    gradient.addColorStop(1, '#c8d8ff')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
    return
  }

  ctx.fillStyle = baseBg
  ctx.fillRect(0, 0, width, height)

  if (kind === 'vintage') {
    for (let y = 0; y < height; y += 18) {
      for (let x = 0; x < width; x += 18) {
        const alpha = ((x + y) % 36 === 0 ? 0.06 : 0.02).toFixed(3)
        ctx.fillStyle = `rgba(76, 53, 37, ${alpha})`
        ctx.fillRect(x, y, 1.5, 1.5)
      }
    }
  }
}

export function drawPhotoCell(
  ctx: CanvasRenderingContext2D,
  opts: {
    img: HTMLImageElement | null
    x: number
    y: number
    w: number
    h: number
    frameKind: FrameKind
    frameColor: string
    frameBg: string
    polaroidColor: string
    rounded: boolean
  },
) {
  const { img, x, y, w, h, frameKind, frameColor, frameBg, polaroidColor, rounded } = opts

  if (frameKind === 'polaroid') {
    const border = 10
    ctx.fillStyle = polaroidColor
    ctx.fillRect(x - border, y - border, w + border * 2, h + border * 2)
    ctx.strokeStyle = 'rgba(0,0,0,0.16)'
    ctx.strokeRect(x - border + 0.5, y - border + 0.5, w + border * 2 - 1, h + border * 2 - 1)
  }

  if (frameKind === 'love') {
    drawHeartImage(ctx, img, x + w / 2, y + h / 2, w * 0.92, h * 0.92, frameColor)
    return
  }

  if (img) {
    if (rounded || frameKind === 'modern') {
      roundedRect(ctx, x, y, w, h, 24)
      ctx.save()
      ctx.clip()
      drawCover(ctx, img, x, y, w, h)
      ctx.restore()
    } else {
      drawCover(ctx, img, x, y, w, h)
    }
  } else {
    ctx.fillStyle = frameBg
    ctx.globalAlpha = 0.4
    ctx.fillRect(x, y, w, h)
    ctx.globalAlpha = 1
  }
}

export function drawFooter(
  ctx: CanvasRenderingContext2D,
  opts: {
    width: number
    height: number
    footer: number
    caption: string
    showDate: boolean
    color: string
  },
) {
  const { width, height, footer, caption, showDate, color } = opts
  const y = height - footer + 12
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.font = 'italic 600 36px "Instrument Serif", Georgia, serif'
  ctx.fillText(caption || 'Snapbooth', width / 2, y + 36)

  if (showDate) {
    const now = new Date()
    const dateStr = now.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
    ctx.font = '500 16px Geist, system-ui, sans-serif'
    ctx.globalAlpha = 0.72
    ctx.fillText(dateStr, width / 2, y + 62)
    ctx.globalAlpha = 1
  }
}

export function drawStickerDecorations(
  ctx: CanvasRenderingContext2D,
  emojis: string[],
  width: number,
  height: number,
) {
  if (emojis.length === 0) return

  const stickerCount = Math.max(5, Math.min(10, emojis.length * 2))
  const marginX = 22
  const marginTop = 28
  const marginBottom = 110
  const points: Array<[number, number]> = []

  for (let i = 0; i < stickerCount; i += 1) {
    const x = marginX + Math.random() * (width - marginX * 2 - 40)
    const y = marginTop + Math.random() * (height - marginTop - marginBottom)
    points.push([x, y])
  }

  ctx.font = '40px "Apple Color Emoji","Segoe UI Emoji",sans-serif'
  points.forEach(([x, y], index) => {
    ctx.fillText(emojis[index % emojis.length], x, y)
  })
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
) {
  const imgRatio = img.width / img.height
  const targetRatio = dw / dh
  let sx = 0
  let sy = 0
  let sw = img.width
  let sh = img.height

  if (imgRatio > targetRatio) {
    sw = img.height * targetRatio
    sx = (img.width - sw) / 2
  } else {
    sh = img.width / targetRatio
    sy = (img.height - sh) / 2
  }

  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
}

function drawHeartImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  strokeColor: string,
) {
  const x = centerX - width / 2
  const y = centerY - height / 2
  ctx.save()
  heartPath(ctx, x, y, width, height)
  ctx.clip()
  if (img) {
    drawCover(ctx, img, x, y, width, height)
  } else {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)'
    ctx.fillRect(x, y, width, height)
  }
  ctx.restore()

  ctx.save()
  heartPath(ctx, x, y, width, height)
  ctx.lineWidth = 8
  ctx.strokeStyle = strokeColor
  ctx.stroke()
  ctx.restore()
}

function heartPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + width / 2, y + height * 0.9)
  ctx.bezierCurveTo(
    x + width * 1.1,
    y + height * 0.55,
    x + width * 0.8,
    y + height * 0.05,
    x + width / 2,
    y + height * 0.28,
  )
  ctx.bezierCurveTo(
    x + width * 0.2,
    y + height * 0.05,
    x - width * 0.1,
    y + height * 0.55,
    x + width / 2,
    y + height * 0.9,
  )
  ctx.closePath()
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}
