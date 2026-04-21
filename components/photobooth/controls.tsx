'use client'

import { Check, FlipHorizontal2, Shuffle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FILTERS, FRAME_COLORS, type FilterId } from './filters'

interface ControlsProps {
  selectedFilter: FilterId
  onFilterChange: (id: FilterId) => void
  selectedFrame: string
  onFrameChange: (id: string) => void
  shotCount: number
  onShotCountChange: (n: number) => void
  countdownSeconds: number
  onCountdownChange: (n: number) => void
  mirror: boolean
  onMirrorChange: (v: boolean) => void
  onShufflePoses: () => void
  disabled?: boolean
}

export function Controls({
  selectedFilter,
  onFilterChange,
  selectedFrame,
  onFrameChange,
  shotCount,
  onShotCountChange,
  countdownSeconds,
  onCountdownChange,
  mirror,
  onMirrorChange,
  onShufflePoses,
  disabled,
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
                'mt-2 inline-flex min-h-9 items-center gap-1.5 rounded-full border border-primary/30 bg-background px-3 py-1.5 text-xs font-semibold text-primary transition',
                'hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50',
              )}
            >
              <Shuffle className="h-3.5 w-3.5" aria-hidden="true" />
              Acak ulang pose
            </button>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section>
        <SectionHeader title="Filter" />
        <div className="grid grid-cols-4 gap-2">
          {FILTERS.map((f) => {
            const active = f.id === selectedFilter
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onFilterChange(f.id)}
                disabled={disabled}
                className={cn(
                  'group relative flex aspect-square flex-col items-center justify-end overflow-hidden rounded-xl border p-2 text-[11px] font-medium transition',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  active
                    ? 'border-primary ring-2 ring-primary/40'
                    : 'border-border hover:border-foreground/30',
                )}
                aria-pressed={active}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(135deg, oklch(0.85 0.08 30), oklch(0.7 0.14 45))',
                    filter: f.css,
                  }}
                />
                <span className="relative z-10 rounded-md bg-background/85 px-1.5 py-0.5 text-foreground backdrop-blur-sm">
                  {f.label}
                </span>
                {active && (
                  <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" aria-hidden="true" />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </section>

      {/* Frame color */}
      <section>
        <SectionHeader title="Warna Frame" />
        <div className="flex flex-wrap gap-2">
          {FRAME_COLORS.map((c) => {
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
                  'relative h-11 w-11 rounded-full border-2 transition disabled:cursor-not-allowed disabled:opacity-50',
                  active
                    ? 'border-primary ring-2 ring-primary/40 ring-offset-2 ring-offset-background'
                    : 'border-border hover:border-foreground/40',
                )}
                style={{ backgroundColor: c.bg }}
              >
                {active && (
                  <Check
                    className="absolute inset-0 m-auto h-4 w-4"
                    style={{ color: c.fg }}
                    aria-hidden="true"
                  />
                )}
              </button>
            )
          })}
        </div>
      </section>

      {/* Shot count & countdown */}
      <section className="grid grid-cols-2 gap-4">
        <div>
          <SectionHeader title="Jumlah Foto" />
          <div className="flex gap-2">
            {[3, 4].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onShotCountChange(n)}
                disabled={disabled}
                className={cn(
                  'flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
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
                  'flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
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
            'flex min-h-11 w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
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
