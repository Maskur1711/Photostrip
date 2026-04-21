'use client'

import { forwardRef } from 'react'
import { Camera, CameraOff, Loader2, SwitchCamera } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Pose } from './poses'

interface CameraStageProps {
  status: 'idle' | 'loading' | 'ready' | 'error' | 'capturing'
  errorMessage?: string | null
  filterCss: string
  mirror: boolean
  countdown: number | null
  flash: boolean
  currentShot: number
  totalShots: number
  pose: Pose
  canFlipCamera: boolean
  onRequestCamera: () => void
  onFlipCamera: () => void
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
      pose,
      canFlipCamera,
      onRequestCamera,
      onFlipCamera,
    },
    ref,
  ) {
    const showPIP = status === 'ready' || status === 'capturing'
    const { Scene, title } = pose

    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-foreground/95 shadow-xl ring-1 ring-border">
        {/* Video feed — playsInline essential for iOS mobile */}
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
                {totalShots} foto berurutan dengan pose lucu berbeda tiap jepretan.
              </p>
            </div>
            <button
              type="button"
              onClick={onRequestCamera}
              className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-lg transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground/95 focus-visible:outline-none"
            >
              <Camera className="h-4 w-4" aria-hidden="true" />
              Nyalakan Kamera
            </button>
          </div>
        )}

        {/* Loading */}
        {status === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-background">
            <Loader2 className="h-10 w-10 animate-spin text-primary-foreground" aria-hidden="true" />
            <p className="text-sm text-background/80">Menyambungkan kamera...</p>
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
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-lg transition hover:brightness-110"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* Flip-camera button (mobile-friendly) */}
        {canFlipCamera && (status === 'ready' || status === 'capturing') && (
          <button
            type="button"
            onClick={onFlipCamera}
            disabled={status === 'capturing'}
            aria-label="Ganti kamera depan/belakang"
            className={cn(
              'absolute top-3 right-3 inline-flex h-11 w-11 items-center justify-center rounded-full',
              'bg-foreground/60 text-background shadow backdrop-blur-sm transition',
              'hover:bg-foreground/75 disabled:cursor-not-allowed disabled:opacity-50',
              'focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none',
            )}
          >
            <SwitchCamera className="h-5 w-5" aria-hidden="true" />
          </button>
        )}

        {/* Pose PIP — menampilkan contoh pose berikutnya di pojok kanan bawah */}
        {showPIP && (
          <div className="pointer-events-none absolute right-3 bottom-3 flex items-end gap-2 sm:right-4 sm:bottom-4">
            <div
              className="relative overflow-hidden rounded-2xl shadow-2xl ring-2 ring-background/80"
              style={{ backgroundColor: pose.accent }}
            >
              <Scene
                className="block h-20 w-28 sm:h-24 sm:w-32"
                showBackdrop={false}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/85 to-transparent px-2 py-1">
                <p className="text-[9px] font-semibold tracking-wide text-background uppercase">
                  Tirukan
                </p>
                <p className="truncate font-serif text-xs leading-tight text-background sm:text-sm">
                  {title}
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
              className="countdown-pop font-serif text-[7rem] leading-none text-background drop-shadow-[0_8px_30px_rgba(0,0,0,0.45)] sm:text-[9rem]"
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
          <div className="absolute top-3 left-3 rounded-full bg-foreground/60 px-3 py-1 text-xs font-medium text-background backdrop-blur">
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
