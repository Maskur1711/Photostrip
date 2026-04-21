'use client'

import { useEffect, useRef } from 'react'
import { FRAME_COLORS } from './filters'
import type { Pose } from './poses'

interface PhotoStripProps {
  photos: string[] // data URLs
  poseTitles: string[] // pose title used for each photo (parallel to photos[])
  frameColorId: string
  caption: string
  showDate: boolean
  /** Called with the rendered canvas so parent can download */
  onCanvasReady?: (canvas: HTMLCanvasElement) => void
}

/**
 * Renders a classic vertical photo strip on a canvas.
 * Each photo gets a small pose-title label in the corner.
 */
export function PhotoStrip({
  photos,
  poseTitles,
  frameColorId,
  caption,
  showDate,
  onCanvasReady,
}: PhotoStripProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const frame =
      FRAME_COLORS.find((f) => f.id === frameColorId) ?? FRAME_COLORS[0]

    // Strip dimensions (portrait)
    const WIDTH = 600
    const PADDING = 30
    const GAP = 20
    const PHOTO_W = WIDTH - PADDING * 2
    const PHOTO_H = Math.round(PHOTO_W * 0.75) // 4:3
    const FOOTER = 140
    const HEIGHT = PADDING + (PHOTO_H + GAP) * photos.length + FOOTER

    canvas.width = WIDTH
    canvas.height = HEIGHT

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Background
    ctx.fillStyle = frame.bg
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    // Subtle inner border
    ctx.strokeStyle = frame.fg
    ctx.globalAlpha = 0.12
    ctx.lineWidth = 2
    ctx.strokeRect(10, 10, WIDTH - 20, HEIGHT - 20)
    ctx.globalAlpha = 1

    // Load all photo images in parallel
    const imgs: (HTMLImageElement | null)[] = new Array(photos.length).fill(null)
    let loaded = 0

    const onOne = () => {
      loaded += 1
      if (loaded === photos.length) drawAll()
    }

    photos.forEach((src, i) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        imgs[i] = img
        onOne()
      }
      img.onerror = onOne
      img.src = src
    })

    if (photos.length === 0) {
      drawFooter()
      onCanvasReady?.(canvas)
      return
    }

    function drawAll() {
      if (!ctx) return

      photos.forEach((_, i) => {
        const x = PADDING
        const y = PADDING + i * (PHOTO_H + GAP)
        const img = imgs[i]
        if (img) {
          drawCover(ctx, img, x, y, PHOTO_W, PHOTO_H)
        } else {
          ctx.fillStyle = frame.fg
          ctx.globalAlpha = 0.1
          ctx.fillRect(x, y, PHOTO_W, PHOTO_H)
          ctx.globalAlpha = 1
        }
        // Photo border
        ctx.strokeStyle = frame.fg
        ctx.globalAlpha = 0.15
        ctx.lineWidth = 1
        ctx.strokeRect(x + 0.5, y + 0.5, PHOTO_W - 1, PHOTO_H - 1)
        ctx.globalAlpha = 1

        // Pose label chip in the bottom-left corner
        const label = poseTitles[i] || `Pose ${i + 1}`
        drawPoseChip(ctx, label, x + 12, y + PHOTO_H - 12, frame.fg, frame.bg)
      })
      drawFooter()
      onCanvasReady?.(canvas)
    }

    function drawFooter() {
      if (!ctx) return
      const footerY = HEIGHT - FOOTER + 14
      ctx.fillStyle = frame.fg

      // Caption (serif-ish)
      ctx.textAlign = 'center'
      ctx.font = 'italic 600 38px "Instrument Serif", Georgia, serif'
      ctx.fillText(caption || 'Snapbooth', WIDTH / 2, footerY + 40)

      if (showDate) {
        const now = new Date()
        const dateStr = now.toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
        ctx.font = '500 18px Geist, system-ui, sans-serif'
        ctx.globalAlpha = 0.75
        ctx.fillText(dateStr, WIDTH / 2, footerY + 70)
        ctx.globalAlpha = 1
      }

      // Tiny brand
      ctx.font = '500 12px Geist, system-ui, sans-serif'
      ctx.globalAlpha = 0.5
      ctx.fillText('snapbooth.app · 20 cute poses', WIDTH / 2, HEIGHT - 20)
      ctx.globalAlpha = 1
    }
  }, [photos, poseTitles, frameColorId, caption, showDate, onCanvasReady])

  return (
    <canvas
      ref={canvasRef}
      className="h-auto w-full max-w-[320px] rounded-md shadow-2xl ring-1 ring-foreground/10"
      aria-label="Pratinjau photo strip"
    />
  )
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

/** Draws a small rounded pill label with the pose name. */
function drawPoseChip(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number, // bottom-left anchor
  strokeColor: string,
  bgColor: string,
) {
  const paddingX = 10
  const paddingY = 6
  ctx.save()
  ctx.font = 'italic 600 16px "Instrument Serif", Georgia, serif'
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'
  const metrics = ctx.measureText(text)
  const w = Math.ceil(metrics.width) + paddingX * 2
  const h = 26
  const rx = h / 2

  const top = y - h

  ctx.shadowColor = 'rgba(0,0,0,0.18)'
  ctx.shadowBlur = 6
  ctx.shadowOffsetY = 2
  ctx.fillStyle = bgColor
  roundedRect(ctx, x, top, w, h, rx)
  ctx.fill()

  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetY = 0

  ctx.strokeStyle = strokeColor
  ctx.globalAlpha = 0.25
  ctx.lineWidth = 1
  roundedRect(ctx, x + 0.5, top + 0.5, w - 1, h - 1, rx - 0.5)
  ctx.stroke()
  ctx.globalAlpha = 1

  ctx.fillStyle = strokeColor
  ctx.fillText(text, x + paddingX, top + h / 2 + 1)

  // tiny "pose" prefix sparkle dot
  ctx.beginPath()
  ctx.arc(x + 3, top + h / 2, 2, 0, Math.PI * 2)
  ctx.fillStyle = strokeColor
  ctx.globalAlpha = 0.4
  ctx.fill()
  ctx.globalAlpha = 1

  ctx.restore()
  // suppress unused paddingY warning
  void paddingY
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
