'use client'

import Image from 'next/image'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Character } from './characters'

interface PosePanelProps {
  character: Character
  active: boolean
}

/**
 * Panel yang muncul DI ATAS preview kamera, menampilkan karakter
 * kartun bergaya Zootopia dan pose yang harus ditiru user.
 */
export function PosePanel({ character, active }: PosePanelProps) {
  return (
    <div
      className={cn(
        'relative flex items-center gap-4 rounded-2xl border bg-card p-3 shadow-sm transition-all',
        'sm:p-4',
        active ? 'ring-2 ring-primary/40' : 'opacity-90',
      )}
      aria-live="polite"
    >
      {/* Character illustration */}
      <div
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl shadow-md sm:h-24 sm:w-24"
        style={{ backgroundColor: character.accent }}
      >
        <Image
          src={character.image || '/placeholder.svg'}
          alt={`Karakter ${character.name} si ${character.species}`}
          fill
          sizes="96px"
          className="object-cover"
          priority
        />
        {/* Little sparkle corner */}
        <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
        </div>
      </div>

      {/* Speech bubble content */}
      <div className="relative min-w-0 flex-1">
        {/* Speech tail pointing left to character */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 -left-2 h-3 w-3 -translate-y-1/2 rotate-45 rounded-sm bg-card ring-1 ring-border"
          style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }}
        />
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-primary uppercase">
            {character.species}
          </span>
          <span className="font-serif text-lg leading-none">
            {character.name}
          </span>
          <span className="text-xs text-muted-foreground">
            · {character.pose}
          </span>
        </div>
        <p className="mt-1.5 text-sm text-foreground/80 text-pretty">
          <span className="font-medium">Tirukan posenya:</span>{' '}
          {character.tagline}
        </p>
      </div>
    </div>
  )
}
