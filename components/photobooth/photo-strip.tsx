'use client'

import { useEffect, useRef } from 'react'
import { FRAME_COLORS } from './filters'
import type { Character } from './characters'

interface PhotoStripProps {
  photos: string[] // data URLs
  frameColorId: string
  caption: string
  showDate: boolean
  character: Character
  /** Called with the rendered canvas so parent can download */
  onCanvasReady?: (canvas: HTMLCanvasElement) => void
}

/**
 * Renders a classic vertical photo strip on a canvas.
 * Each photo has a cute cartoon character sticker in the corner,
 * plus a bigger character badge in the footer.
 */
export function PhotoStrip({
  photos,
  frameColorId,
  caption,
  showDate,
  character,
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
    const FOOTER = 160
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

    // Load photos + character in parallel
    const imgs: (HTMLImageElement | null)[] = new Array(photos.length).fill(
      null,
    )
    const characterImg = new Image()
    characterImg.crossOrigin = 'anonymous'

    let loaded = 0
    const totalToLoad = photos.length + 1

    const onOne = () => {
      loaded += 1
      if (loaded === totalToLoad) drawAll()
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

    characterImg.onload = onOne
    characterImg.onerror = onOne
    characterImg.src = character.image

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

        // Character sticker in the bottom-left corner of each photo
        drawCharacterSticker(
          ctx,
          characterImg,
          character.accent,
          x + 12,
          y + PHOTO_H - 12 - 70,
          70,
        )
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
      ctx.font = 'italic 600 36px "Instrument Serif", Georgia, serif'
      ctx.fillText(caption || 'Snapbooth', WIDTH / 2, footerY + 38)

      if (showDate) {
        const now = new Date()
        const dateStr = now.toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
        ctx.font = '500 18px Geist, system-ui, sans-serif'
        ctx.globalAlpha = 0.75
        ctx.fillText(dateStr, WIDTH / 2, footerY + 66)
        ctx.globalAlpha = 1
      }

      // Character credit line — "with {name} si {species}"
      ctx.font = 'italic 500 16px Geist, system-ui, sans-serif'
      ctx.globalAlpha = 0.7
      ctx.fillText(
        `featuring ${character.name} si ${character.species}`,
        WIDTH / 2,
        footerY + 96,
      )
      ctx.globalAlpha = 1

      // Tiny brand
      ctx.font = '500 12px Geist, system-ui, sans-serif'
      ctx.globalAlpha = 0.5
      ctx.fillText('snapbooth.app', WIDTH / 2, HEIGHT - 20)
      ctx.globalAlpha = 1
    }
  }, [photos, frameColorId, caption, showDate, character, onCanvasReady])

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

/**
 * Draws a rounded-square character sticker with colored background.
 */
function drawCharacterSticker(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  bg: string,
  x: number,
  y: number,
  size: number,
) {
  const radius = size * 0.22
  ctx.save()

  // Shadow
  ctx.shadowColor = 'rgba(0,0,0,0.25)'
  ctx.shadowBlur = 8
  ctx.shadowOffsetY = 2

  // Rounded bg
  ctx.fillStyle = bg
  roundedRect(ctx, x, y, size, size, radius)
  ctx.fill()

  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetY = 0

  // Clip to rounded rect for image
  roundedRect(ctx, x, y, size, size, radius)
  ctx.clip()

  if (img.complete && img.naturalWidth > 0) {
    drawCover(ctx, img, x, y, size, size)
  }

  ctx.restore()

  // White border
  ctx.save()
  ctx.strokeStyle = 'rgba(255,255,255,0.95)'
  ctx.lineWidth = 2.5
  roundedRect(ctx, x, y, size, size, radius)
  ctx.stroke()
  ctx.restore()
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
