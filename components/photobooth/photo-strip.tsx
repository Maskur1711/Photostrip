'use client'

import { useEffect, useRef } from 'react'
import {
  buildSlots,
  drawFooter,
  drawFrameBackground,
  drawPhotoCell,
  drawStickerDecorations,
  getTemplateLayout,
} from './composables/strip-canvas'
import { FRAME_STYLES, STICKER_THEMES } from './filters'

interface PhotoStripProps {
  photos: string[]
  poseTitles: string[]
  frameColorId: string
  templateId: string
  stickerThemeId: string
  polaroidColor: string
  caption: string
  showDate: boolean
  onCanvasReady?: (canvas: HTMLCanvasElement) => void
}

export function PhotoStrip({
  photos,
  poseTitles,
  frameColorId,
  templateId,
  stickerThemeId,
  polaroidColor,
  caption,
  showDate,
  onCanvasReady,
}: PhotoStripProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const frame = FRAME_STYLES.find((f) => f.id === frameColorId) ?? FRAME_STYLES[0]
    const sticker = STICKER_THEMES.find((s) => s.id === stickerThemeId) ?? STICKER_THEMES[0]
    const photoCount = Math.max(photos.length, 1)
    const layout = getTemplateLayout(templateId, photoCount)
    const frameBg = sticker.frameBg ?? frame.bg

    const WIDTH = layout.width
    const PADDING = 24
    const GAP = layout.gap
    const FOOTER = layout.footer
    const photoW = Math.floor((WIDTH - PADDING * 2 - GAP * (layout.cols - 1)) / layout.cols)
    const photoH = Math.round(photoW * 0.75)
    const rows = Math.ceil(photoCount / layout.cols)
    const HEIGHT = PADDING + rows * photoH + (rows - 1) * GAP + FOOTER

    canvas.width = WIDTH
    canvas.height = HEIGHT

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const context = ctx
    const readyCanvas = canvas

    drawFrameBackground(context, frame.kind, WIDTH, HEIGHT, frameBg)
    continueRender()

    function continueRender() {
      const slots = buildSlots(
        PADDING,
        GAP,
        rows,
        layout.cols,
        photoW,
        photoH,
        photoCount,
        layout.fillByColumns,
        layout.centerLastRow,
      )
      const imgs: (HTMLImageElement | null)[] = new Array(photos.length).fill(null)
      let loaded = 0

      const finalize = () => {
        drawAll()
      }

      const onOneLoaded = () => {
        loaded += 1
        if (loaded === photos.length) finalize()
      }

      photos.forEach((src, idx) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          imgs[idx] = img
          onOneLoaded()
        }
        img.onerror = onOneLoaded
        img.src = src
      })

      if (photos.length === 0) {
        finalize()
        return
      }

      function drawAll() {
        slots.forEach((slot, idx) => {
          if (idx >= photos.length) return
          const img = imgs[idx]
          drawPhotoCell(context, {
            img,
            x: slot.x,
            y: slot.y,
            w: slot.w,
            h: slot.h,
            frameKind: frame.kind,
            frameColor: frame.fg,
            frameBg,
            polaroidColor,
            rounded: false,
          })
        })

        drawFooter(context, {
          width: WIDTH,
          height: HEIGHT,
          footer: FOOTER,
          caption,
          showDate,
          color: frame.fg,
        })
        drawStickerDecorations(context, sticker.emojis, WIDTH, HEIGHT)
        onCanvasReady?.(readyCanvas)
      }
    }
    void poseTitles
  }, [photos, poseTitles, frameColorId, templateId, stickerThemeId, polaroidColor, caption, showDate, onCanvasReady])

  return (
    <canvas
      ref={canvasRef}
      className="h-auto w-full max-w-[360px] rounded-md shadow-2xl ring-1 ring-foreground/10"
      aria-label="Pratinjau photo strip"
    />
  )
}

