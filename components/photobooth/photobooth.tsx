'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Camera,
  Download,
  RefreshCw,
  Sparkles,
  Share2,
} from 'lucide-react'
import { CameraStage } from './camera-stage'
import { Controls } from './controls'
import { PhotoStrip } from './photo-strip'
import { FILTERS, type FilterId } from './filters'
import { cn } from '@/lib/utils'

type Status = 'idle' | 'loading' | 'ready' | 'error' | 'capturing'

export function Photobooth() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const stripCanvasRef = useRef<HTMLCanvasElement | null>(null)

  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  // Settings
  const [filterId, setFilterId] = useState<FilterId>('none')
  const [frameColor, setFrameColor] = useState('cream')
  const [shotCount, setShotCount] = useState(4)
  const [countdownSeconds, setCountdownSeconds] = useState(3)
  const [mirror, setMirror] = useState(true)
  const [caption, setCaption] = useState('Snapbooth')
  const [showDate, setShowDate] = useState(true)

  // Capture state
  const [countdown, setCountdown] = useState<number | null>(null)
  const [flash, setFlash] = useState(false)
  const [currentShot, setCurrentShot] = useState(0)
  const [photos, setPhotos] = useState<string[]>([])

  const filterCss =
    FILTERS.find((f) => f.id === filterId)?.css ?? 'none'

  // Start camera
  const startCamera = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Browser kamu tidak mendukung akses kamera.')
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(() => {})
      }
      setStatus('ready')
    } catch (err) {
      const message =
        err instanceof Error
          ? err.name === 'NotAllowedError'
            ? 'Izin kamera ditolak. Aktifkan di pengaturan browser.'
            : err.message
          : 'Gagal mengakses kamera.'
      setError(message)
      setStatus('error')
    }
  }, [])

  // Stop camera on unmount
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  // Capture single photo from video
  const capturePhoto = useCallback((): string | null => {
    const video = videoRef.current
    if (!video || video.videoWidth === 0) return null

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    if (mirror) {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }
    ctx.filter = filterCss
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    ctx.filter = 'none'
    ctx.setTransform(1, 0, 0, 1, 0, 0)

    return canvas.toDataURL('image/jpeg', 0.92)
  }, [filterCss, mirror])

  // Capture sequence
  const runCaptureSequence = useCallback(async () => {
    if (status !== 'ready') return

    setStatus('capturing')
    setPhotos([])
    const collected: string[] = []

    for (let i = 0; i < shotCount; i += 1) {
      setCurrentShot(i)

      // countdown
      for (let c = countdownSeconds; c > 0; c -= 1) {
        setCountdown(c)
        await wait(1000)
      }
      setCountdown(0) // "Smile!"
      await wait(400)
      setCountdown(null)

      // flash + capture
      setFlash(true)
      const shot = capturePhoto()
      if (shot) {
        collected.push(shot)
        setPhotos([...collected])
      }
      await wait(450)
      setFlash(false)

      // brief pause between shots
      if (i < shotCount - 1) await wait(700)
    }

    setStatus('ready')
    setCurrentShot(0)
  }, [capturePhoto, countdownSeconds, shotCount, status])

  const resetPhotos = useCallback(() => {
    setPhotos([])
  }, [])

  const handleDownload = useCallback(() => {
    const canvas = stripCanvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `snapbooth-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [])

  const handleShare = useCallback(async () => {
    const canvas = stripCanvasRef.current
    if (!canvas) return
    canvas.toBlob(async (blob) => {
      if (!blob) return
      const file = new File([blob], 'snapbooth.png', { type: 'image/png' })
      if (
        typeof navigator !== 'undefined' &&
        navigator.canShare?.({ files: [file] })
      ) {
        try {
          await navigator.share({
            files: [file],
            title: 'Snapbooth',
            text: 'Photo strip dari Snapbooth ✨',
          })
        } catch {
          // user cancelled
        }
      } else {
        handleDownload()
      }
    }, 'image/png')
  }, [handleDownload])

  const hasResult = photos.length === shotCount && photos.length > 0
  const busy = status === 'capturing'

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* LEFT: Camera / Strip */}
      <div className="space-y-4">
        {hasResult ? (
          <ResultView
            photos={photos}
            frameColor={frameColor}
            caption={caption}
            showDate={showDate}
            onCanvasReady={(c) => (stripCanvasRef.current = c)}
            onRetake={() => {
              resetPhotos()
            }}
            onDownload={handleDownload}
            onShare={handleShare}
            onCaptionChange={setCaption}
            onShowDateChange={setShowDate}
          />
        ) : (
          <>
            <CameraStage
              ref={videoRef}
              status={status}
              errorMessage={error}
              filterCss={filterCss}
              mirror={mirror}
              countdown={countdown}
              flash={flash}
              currentShot={currentShot}
              totalShots={shotCount}
              onRequestCamera={startCamera}
            />

            {/* Capture CTA */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {status === 'ready'
                      ? busy
                        ? `Mengambil foto ${currentShot + 1} dari ${shotCount}...`
                        : 'Kamera siap!'
                      : 'Kamera belum aktif'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {status === 'ready'
                      ? `${shotCount} foto · hitungan ${countdownSeconds} detik`
                      : 'Aktifkan kamera untuk mulai'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={runCaptureSequence}
                disabled={status !== 'ready'}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-lg transition',
                  'bg-primary text-primary-foreground hover:brightness-110',
                  'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none',
                )}
              >
                <Camera className="h-4 w-4" aria-hidden="true" />
                Mulai Memotret
              </button>
            </div>
          </>
        )}
      </div>

      {/* RIGHT: Controls */}
      <aside className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-xl">Kustomisasi</h2>
          <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-accent-foreground uppercase">
            Live
          </span>
        </div>
        <Controls
          selectedFilter={filterId}
          onFilterChange={setFilterId}
          selectedFrame={frameColor}
          onFrameChange={setFrameColor}
          shotCount={shotCount}
          onShotCountChange={setShotCount}
          countdownSeconds={countdownSeconds}
          onCountdownChange={setCountdownSeconds}
          mirror={mirror}
          onMirrorChange={setMirror}
          disabled={busy}
        />
      </aside>
    </div>
  )
}

function ResultView({
  photos,
  frameColor,
  caption,
  showDate,
  onCanvasReady,
  onRetake,
  onDownload,
  onShare,
  onCaptionChange,
  onShowDateChange,
}: {
  photos: string[]
  frameColor: string
  caption: string
  showDate: boolean
  onCanvasReady: (c: HTMLCanvasElement) => void
  onRetake: () => void
  onDownload: () => void
  onShare: () => void
  onCaptionChange: (s: string) => void
  onShowDateChange: (v: boolean) => void
}) {
  return (
    <div className="grid gap-5 rounded-2xl border bg-card p-6 shadow-sm md:grid-cols-[auto_1fr]">
      <div className="flex justify-center md:justify-start">
        <PhotoStrip
          photos={photos}
          frameColorId={frameColor}
          caption={caption}
          showDate={showDate}
          onCanvasReady={onCanvasReady}
        />
      </div>
      <div className="flex flex-col justify-between gap-6">
        <div className="space-y-4">
          <div>
            <h2 className="font-serif text-3xl leading-tight text-balance">
              Photo strip kamu sudah siap ✨
            </h2>
            <p className="mt-1 text-sm text-muted-foreground text-pretty">
              Atur caption & tanggal, lalu unduh atau bagikan ke teman.
            </p>
          </div>

          <label className="block text-sm">
            <span className="mb-1.5 block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Caption
            </span>
            <input
              type="text"
              value={caption}
              onChange={(e) => onCaptionChange(e.target.value)}
              maxLength={32}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none"
              placeholder="Tulis sesuatu..."
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showDate}
              onChange={(e) => onShowDateChange(e.target.checked)}
              className="h-4 w-4 rounded border-input accent-[var(--primary)]"
            />
            Tampilkan tanggal
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onDownload}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg transition hover:brightness-110"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Download
          </button>
          <button
            type="button"
            onClick={onShare}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold transition hover:bg-secondary"
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
            Bagikan
          </button>
          <button
            type="button"
            onClick={onRetake}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold transition hover:bg-secondary"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Ambil Lagi
          </button>
        </div>
      </div>
    </div>
  )
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
