'use client'

import { Check, FlipHorizontal2, Shuffle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FRAME_STYLES } from './filters'

interface ControlsProps {
  selectedFrame: string
  onFrameChange: (id: string) => void
  shotCount: number
  onShotCountChange: (n: number) => void
  countdownSeconds: number
  onCountdownChange: (n: number) => void
  mirror: boolean
  onMirrorChange: (v: boolean) => void
  onShufflePoses: () => void
  livePhotos?: string[]
  disabled?: boolean
  hideStyleControls?: boolean
}

export function Controls({
  selectedFrame,
  onFrameChange,
  shotCount,
  onShotCountChange,
  countdownSeconds,
  onCountdownChange,
  mirror,
  onMirrorChange,
  onShufflePoses,
  livePhotos,
  disabled,
  hideStyleControls,
}: ControlsProps) {
  return (
    <div className="space-y-6">
      {/* Pose info / shuffle */}
      <section className="rounded-xl border border-primary/20 bg-primary/5 p-3">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Shuffle className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">20 Pose Lucu Random</p>
            <p className="mt-0.5 text-xs text-muted-foreground text-pretty">
              Solo & couple bergantian. Setiap foto dapat pose berbeda — ikuti ilustrasi di atas kamera!
            </p>
            <button
              type="button"
              onClick={onShufflePoses}
              disabled={disabled}
              className={cn(
                'cursor-pointer  mt-2 inline-flex min-h-9 items-center gap-1.5 rounded-full border border-primary/30 bg-background px-3 py-1.5 text-xs font-semibold text-primary transition',
                'hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50',
              )}
            >
              <Shuffle className="h-3.5 w-3.5" aria-hidden="true" />
              Acak ulang pose
            </button>
          </div>
        </div>
      </section>

      {!hideStyleControls && (
        <>
          {/* Frame style */}
          <section>
            <SectionHeader title="Style Frame" />
            <div className="grid grid-cols-3 gap-2">
              {FRAME_STYLES.map((c) => {
                const active = c.id === selectedFrame
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onFrameChange(c.id)}
                    disabled={disabled}
                    aria-pressed={active}
                    aria-label={`Frame ${c.label}`}
                    className={cn(
                      'cursor-pointer relative flex min-h-14 items-end justify-start overflow-hidden rounded-xl border p-2 text-left transition disabled:cursor-not-allowed disabled:opacity-50',
                      active
                        ? 'border-primary ring-2 ring-primary/40'
                        : 'border-border hover:border-foreground/40',
                    )}
                    style={{ background: `linear-gradient(135deg, ${c.bg}, ${c.fg}33)` }}
                  >
                    <span className="relative z-10 rounded bg-background/85 px-1.5 py-0.5 text-[10px] font-semibold">
                      {c.label}
                    </span>
                    {active && (
                      <Check
                        className="absolute top-1.5 right-1.5 h-4 w-4"
                        style={{ color: c.kind === 'love' ? '#fff' : c.fg }}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </section>

        </>
      )}

      {/* Shot count & countdown */}
      <section className="grid grid-cols-2 gap-4">
        <div>
          <SectionHeader title="Jumlah Foto" />
          <div className="grid grid-cols-3 gap-2">
            {[2, 4, 6, 8].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onShotCountChange(n)}
                disabled={disabled}
                className={cn(
                  'cursor-pointer flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
                  shotCount === n
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:border-foreground/30',
                )}
                aria-pressed={shotCount === n}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div>
          <SectionHeader title="Hitung Mundur" />
          <div className="flex gap-2">
            {[3, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onCountdownChange(n)}
                disabled={disabled}
                className={cn(
                  'cursor-pointer flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
                  countdownSeconds === n
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:border-foreground/30',
                )}
                aria-pressed={countdownSeconds === n}
              >
                {n}s
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Mirror toggle */}
      <section>
        <button
          type="button"
          onClick={() => onMirrorChange(!mirror)}
          disabled={disabled}
          className={cn(
            'cursor-pointer flex min-h-11 w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
            mirror
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-foreground/30',
          )}
          aria-pressed={mirror}
        >
          <span className="flex items-center gap-2">
            <FlipHorizontal2 className="h-4 w-4" aria-hidden="true" />
            Mode Cermin (selfie)
          </span>
          <span
            className={cn(
              'relative inline-flex h-5 w-9 items-center rounded-full transition',
              mirror ? 'bg-primary' : 'bg-muted-foreground/30',
            )}
            aria-hidden="true"
          >
            <span
              className={cn(
                'inline-block h-4 w-4 rounded-full bg-background shadow transition',
                mirror ? 'translate-x-4' : 'translate-x-0.5',
              )}
            />
          </span>
        </button>
      </section>

      {!!livePhotos?.length && (
        <section>
          <SectionHeader title="Hasil Sementara" />
          <div className="max-h-[210px] overflow-y-auto rounded-xl border p-2">
            <div className="grid grid-cols-2 gap-2">
            {livePhotos.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Hasil foto ${idx + 1}`}
                className="aspect-4/3 w-full rounded-md border object-cover"
              />
            ))}
            </div>
          </div>
        </section>
      )}
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

