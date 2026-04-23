'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getAvailableTemplates } from './composables/template-options'
import {
  FRAME_STYLES,
  STICKER_THEMES,
} from './filters'

interface ResultCustomizerProps {
  photos: string[]
  selectedPhotoIndices: number[]
  onTogglePhoto: (index: number) => void
  selectedFrame: string
  onFrameChange: (id: string) => void
  polaroidColor: string
  onPolaroidColorChange: (value: string) => void
  selectedTemplate: string
  onTemplateChange: (id: string) => void
  selectedSticker: string
  onStickerChange: (id: string) => void
}

export function ResultCustomizer({
  photos,
  selectedPhotoIndices,
  onTogglePhoto,
  selectedFrame,
  onFrameChange,
  polaroidColor,
  onPolaroidColorChange,
  selectedTemplate,
  onTemplateChange,
  selectedSticker,
  onStickerChange,
}: ResultCustomizerProps) {
  const [showCustomPolaroid, setShowCustomPolaroid] = useState(false)

  const availableTemplates = useMemo(() => {
    const count = Math.max(photos.length, 1)
    return getAvailableTemplates(count)
  }, [photos.length])

  useEffect(() => {
    const isSelectedTemplateAvailable = availableTemplates.some(
      (item) => item.id === selectedTemplate,
    )
    if (!isSelectedTemplateAvailable) {
      onTemplateChange('classic-strip')
    }
  }, [availableTemplates, onTemplateChange, selectedTemplate])

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <h2 className="font-serif text-xl">Kustomisasi Hasil</h2>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <section>
          <SectionHeader title="Template Strip" />
          <div className="grid grid-cols-2 gap-2">
            {availableTemplates.map((item) => {
              const active = item.id === selectedTemplate
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTemplateChange(item.id)}
                  className={cn(
                    'cursor-pointer rounded-lg border px-3 py-2 text-left text-xs font-semibold transition',
                    active
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border hover:border-foreground/30',
                  )}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <SectionHeader title="Warna / Style Frame" />
            <button
              type="button"
              onClick={() => setShowCustomPolaroid((v) => !v)}
              className={cn(
                'cursor-pointer rounded-md border px-2 py-1 text-[10px] font-semibold transition',
                showCustomPolaroid
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background hover:border-foreground/30',
              )}
            >
              Custom
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {FRAME_STYLES.map((c) => {
              const active = c.id === selectedFrame
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onFrameChange(c.id)}
                  aria-pressed={active}
                  className={cn(
                    'cursor-pointer relative overflow-hidden rounded-xl border p-2 text-left transition',
                    active ? 'border-primary ring-2 ring-primary/40' : 'border-border',
                  )}
                  style={{ background: `linear-gradient(135deg, ${c.bg}, ${c.fg}22)` }}
                >
                  <span className="rounded bg-background/85 px-1.5 py-0.5 text-[10px] font-semibold">
                    {c.label}
                  </span>
                  {active && <Check className="absolute top-1.5 right-1.5 h-4 w-4" />}
                </button>
              )
            })}
          </div>
          {showCustomPolaroid && (
            <div className="mt-2 rounded-lg border p-2">
              <label className="flex items-center justify-between gap-3 text-xs font-semibold">
                <span>Custom warna polaroid</span>
                <input
                  type="color"
                  value={polaroidColor}
                  onChange={(e) => onPolaroidColorChange(e.target.value)}
                  className="h-8 w-12 cursor-pointer rounded border"
                  aria-label="Pilih warna polaroid"
                />
              </label>
              {selectedFrame !== 'polaroid' && (
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Warna custom akan terlihat saat style frame Polaroid dipilih.
                </p>
              )}
            </div>
          )}
        </section>

        <section>
          <SectionHeader title="Sticker Theme" />
          <div className="grid grid-cols-3 gap-2">
            {STICKER_THEMES.map((theme) => {
              const active = theme.id === selectedSticker
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => onStickerChange(theme.id)}
                  className={cn(
                    'cursor-pointer rounded-lg border px-2 py-2 text-center text-xs transition',
                    active ? 'border-primary bg-primary/10' : 'border-border',
                  )}
                >
                  <span className="block text-base">
                    {theme.emojis[0] ?? 'Ø'}
                  </span>
                  <span className="text-[10px] font-semibold">{theme.label}</span>
                </button>
              )
            })}
          </div>
        </section>

        <section>
          <SectionHeader title="Pilih Foto yang Dipakai" />
          <div className="grid grid-cols-2 gap-2">
            {photos.map((src, idx) => {
              const active = selectedPhotoIndices.includes(idx)
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onTogglePhoto(idx)}
                  className={cn(
                    'cursor-pointer relative overflow-hidden rounded-lg border transition',
                    active ? 'border-primary ring-2 ring-primary/40' : 'border-border',
                  )}
                >
                  <img
                    src={src}
                    alt={`Foto ${idx + 1}`}
                    className="aspect-4/3 w-full object-cover"
                  />
                  <span className="absolute right-1.5 bottom-1.5 rounded bg-background/90 px-1.5 text-[10px] font-semibold">
                    {active ? 'Dipakai' : 'Off'}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

      </div>
    </div>
  )
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h3 className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
      {title}
    </h3>
  )
}

