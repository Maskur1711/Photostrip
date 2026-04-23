'use client'

import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Pose } from './poses'

interface PosePanelProps {
  pose: Pose
  active: boolean
  index: number
  total: number
  embedded?: boolean
}

/**
 * Panel muncul DI ATAS preview kamera, menampilkan ilustrasi SVG pose
 * yang harus ditiru untuk foto berikutnya.
 */
export function PosePanel({ pose, active, index, total, embedded }: PosePanelProps) {
  const { Scene, title, description, type, accent } = pose
  return (
    <div
      className={cn(
        'relative flex items-stretch gap-3 rounded-2xl border bg-card p-2.5 shadow-sm transition-all sm:gap-4 sm:p-3',
        embedded && 'rounded-xl border-0 bg-transparent p-0 shadow-none',
        active ? 'ring-2 ring-primary/40' : '',
      )}
      aria-live="polite"
    >
      {/* Pose illustration (SVG, ringan & responsif) */}
      <div
        className="relative shrink-0 overflow-hidden rounded-xl ring-1 ring-border"
        style={{ backgroundColor: accent }}
      >
        <Scene
          className="block h-20 w-[108px] sm:h-24 sm:w-[132px]"
          showBackdrop={false}
        />
        <div className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
        </div>
      </div>

      {/* Speech bubble content */}
      <div className="relative min-w-0 flex-1 py-1">
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-[-9px] hidden h-3 w-3 -translate-y-1/2 rotate-45 rounded-sm bg-card ring-1 ring-border sm:block"
          style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }}
        />
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-primary uppercase">
            {type === 'couple' ? 'Couple' : 'Solo'}
          </span>
          <span className="font-serif text-base leading-none sm:text-lg">
            {title}
          </span>
          <span className="text-[11px] text-muted-foreground">
            Pose {index + 1}/{total}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-xs text-foreground/80 text-pretty sm:line-clamp-none sm:text-sm">
          {description}
        </p>
      </div>  
    </div>
  )
}
