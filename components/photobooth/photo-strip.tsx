'use client'

import { useEffect, useRef } from 'react'
import { FRAME_COLORS } from './filters'

interface PhotoStripProps {
  photos: string[] // data URLs
  frameColorId: string
  caption: string
  showDate: boolean
  /** Called with the rendered canvas so parent can download */
  onCanvasReady?: (canvas: HTMLCanvasElement) => void
}

/**
 * Renders a classic vertical photo strip on a canvas.
 * Size tuned for good print / share quality.
 */
export function PhotoStrip({
  photos,
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
    const FOOTER = 130
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

    let loaded = 0
    const images: HTMLImageElement[] = []

    if (photos.length === 0) {
      drawFooter()
      onCanvasReady?.(canvas)
      return
    }

    photos.forEach((src, i) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        images[i] = img
        loaded += 1
        if (loaded === photos.length) {
          drawAll()
        }
      }
      img.onerror = () => {
        loaded += 1
        if (loaded === photos.length) drawAll()
      }
      img.src = src
    })

    function drawAll() {
      if (!ctx) return
      photos.forEach((_, i) => {
        const x = PADDING
        const y = PADDING + i * (PHOTO_H + GAP)
        const img = images[i]
        if (img) {
          // Draw cover-style (crop to fit)
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
      })
      drawFooter()
      onCanvasReady?.(canvas)
    }

    function drawFooter() {
      if (!ctx) return
      const footerY = HEIGHT - FOOTER + 10
      ctx.fillStyle = frame.fg

      // Caption (serif-ish)
      ctx.textAlign = 'center'
      ctx.font = 'italic 600 34px "Instrument Serif", Georgia, serif'
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
        ctx.fillText(dateStr, WIDTH / 2, footerY + 72)
        ctx.globalAlpha = 1
      }

      // Tiny brand
      ctx.font = '500 12px Geist, system-ui, sans-serif'
      ctx.globalAlpha = 0.5
      ctx.fillText('snapbooth.app', WIDTH / 2, HEIGHT - 20)
      ctx.globalAlpha = 1
    }
  }, [photos, frameColorId, caption, showDate, onCanvasReady])

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
    // image is wider → crop sides
    sw = img.height * targetRatio
    sx = (img.width - sw) / 2
  } else {
    sh = img.width / targetRatio
    sy = (img.height - sh) / 2
  }

  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
}
