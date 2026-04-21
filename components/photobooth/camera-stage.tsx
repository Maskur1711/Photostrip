'use client'

import { forwardRef } from 'react'
import Image from 'next/image'
import { Camera, CameraOff, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Character } from './characters'

interface CameraStageProps {
  status: 'idle' | 'loading' | 'ready' | 'error' | 'capturing'
  errorMessage?: string | null
  filterCss: string
  mirror: boolean
  countdown: number | null
  flash: boolean
  currentShot: number
  totalShots: number
  character: Character
  onRequestCamera: () => void
}

export const CameraStage = forwardRef<HTMLVideoElement, CameraStageProps>(
  function CameraStage(
    {
      status,
      errorMessage,
      filterCss,
      mirror,
      countdown,
      flash,
      currentShot,
      totalShots,
      character,
      onRequestCamera,
    },
    ref,
  ) {
    const showCharacterPIP = status === 'ready' || status === 'capturing'

    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-foreground/95 shadow-xl ring-1 ring-border">
        {/* Video feed */}
        <video
          ref={ref}
          playsInline
          muted
          autoPlay
          className={cn(
            'h-full w-full object-cover transition-[filter] duration-300',
            mirror && 'scale-x-[-1]',
            status !== 'ready' && status !== 'capturing' && 'opacity-0',
          )}
          style={{ filter: filterCss }}
        />

        {/* Idle state */}
        {status === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center text-background">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Camera className="h-8 w-8" aria-hidden="true" />
            </div>
            <div className="max-w-sm space-y-2">
              <h2 className="font-serif text-2xl leading-tight text-balance">
                Siap untuk berpose?
              </h2>
              <p className="text-sm text-background/70 text-pretty">
                Nyalakan kamera untuk mulai memotret. Kami akan ambil{' '}
                {totalShots} foto berurutan dengan hitungan mundur.
              </p>
            </div>
            <button
              type="button"
              onClick={onRequestCamera}
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-lg transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground/95 focus-visible:outline-none"
            >
              <Camera className="h-4 w-4" aria-hidden="true" />
              Nyalakan Kamera
            </button>
          </div>
        )}

        {/* Loading */}
        {status === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-background">
            <Loader2
              className="h-10 w-10 animate-spin text-primary-foreground"
              aria-hidden="true"
            />
            <p className="text-sm text-background/80">
              Menyambungkan kamera...
            </p>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center text-background">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
              <CameraOff className="h-8 w-8" aria-hidden="true" />
            </div>
            <div className="max-w-sm space-y-1">
              <h3 className="font-medium">Tidak bisa mengakses kamera</h3>
              <p className="text-sm text-background/70 text-pretty">
                {errorMessage ??
                  'Periksa izin kamera di browser kamu, lalu coba lagi.'}
              </p>
            </div>
            <button
              type="button"
              onClick={onRequestCamera}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-lg transition hover:brightness-110"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* Character PIP (picture-in-picture) — contoh pose live di pojok */}
        {showCharacterPIP && (
          <div className="pointer-events-none absolute right-4 bottom-4 flex items-end gap-2">
            <div
              className="relative h-24 w-24 overflow-hidden rounded-2xl shadow-2xl ring-2 ring-background/80 sm:h-28 sm:w-28"
              style={{ backgroundColor: character.accent }}
            >
              <Image
                src={character.image || '/placeholder.svg'}
                alt=""
                fill
                sizes="112px"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 to-transparent px-2 py-1">
                <p className="text-[10px] font-semibold tracking-wide text-background uppercase">
                  Tirukan
                </p>
                <p className="font-serif text-sm text-background">
                  {character.name}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Countdown overlay */}
        {countdown !== null && (
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            aria-live="assertive"
            aria-atomic="true"
          >
            <span
              key={countdown}
              className="countdown-pop font-serif text-[9rem] leading-none text-background drop-shadow-[0_8px_30px_rgba(0,0,0,0.45)]"
            >
              {countdown === 0 ? 'Smile!' : countdown}
            </span>
          </div>
        )}

        {/* Flash overlay */}
        {flash && (
          <div
            className="pointer-events-none absolute inset-0 bg-background flash-anim"
            aria-hidden="true"
          />
        )}

        {/* Shot counter */}
        {status === 'capturing' && (
          <div className="absolute top-4 left-4 rounded-full bg-foreground/60 px-3 py-1 text-xs font-medium text-background backdrop-blur">
            Foto {currentShot + 1} / {totalShots}
          </div>
        )}

        {/* Decorative corner marks */}
        {(status === 'ready' || status === 'capturing') && (
          <>
            <CornerMark className="top-3 left-3" />
            <CornerMark className="top-3 right-3 rotate-90" />
            <CornerMark className="bottom-3 right-3 rotate-180" />
            <CornerMark className="bottom-3 left-3 -rotate-90" />
          </>
        )}
      </div>
    )
  },
)

function CornerMark({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute h-6 w-6 border-t-2 border-l-2 border-background/70',
        className,
      )}
    />
  )
}
