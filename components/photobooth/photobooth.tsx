'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Camera,
  Download,
  RefreshCw,
  Sparkles,
  Share2,
  User,
  Users,
  Shuffle as ShuffleIcon,
} from 'lucide-react'
import { CameraStage } from './camera-stage'
import { supportsFacingModeConstraint } from './composables/camera'
import { Controls } from './controls'
import { type FacingMode, type Status } from './entities/photobooth-types'
import { useSelectedPhotos } from './hooks/use-selected-photos'
import { PhotoStrip } from './photo-strip'
import { PosePanel } from './pose-panel'
import { ResultCustomizer } from './result-customizer'
import { buildPoseSequence, type Pose, type PoseMode } from './poses'
import { cn } from '@/lib/utils'

export function Photobooth() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const stripCanvasRef = useRef<HTMLCanvasElement | null>(null)

  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  // Settings
  const [frameColor, setFrameColor] = useState('classic-cream')
  const [polaroidColor, setPolaroidColor] = useState('#ffffff')
  const [templateId, setTemplateId] = useState('classic-strip')
  const [stickerThemeId, setStickerThemeId] = useState('none')
  const [shotCount, setShotCount] = useState(4)
  const [countdownSeconds, setCountdownSeconds] = useState(3)
  const [mirror, setMirror] = useState(true)
  const [caption, setCaption] = useState('Snapbooth')
  const [showDate, setShowDate] = useState(true)

  // Mobile: facing camera
  const [facingMode, setFacingMode] = useState<FacingMode>('user')
  const [canFlipCamera, setCanFlipCamera] = useState(false)

  // Mode foto — user memilih sendiri/couple/campur SEBELUM memotret
  const [poseMode, setPoseMode] = useState<PoseMode>('mix')

  // Pose sequence — diacak & di-loop sebanyak shotCount
  const [poseSequence, setPoseSequence] = useState<Pose[]>(() =>
    buildPoseSequence(4, 'mix', false),
  )

  // Capture state
  const [countdown, setCountdown] = useState<number | null>(null)
  const [flash, setFlash] = useState(false)
  const [currentShot, setCurrentShot] = useState(0)
  const [photos, setPhotos] = useState<string[]>([])
  const [showResultView, setShowResultView] = useState(false)

  // Keep pose-sequence in sync with shotCount & mode
  useEffect(() => {
    setPoseSequence(buildPoseSequence(shotCount, poseMode))
  }, [shotCount, poseMode])

  // Detect multi-camera (mobile usually has front+back)
  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.enumerateDevices) {
      return
    }
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const cams = devices.filter((d) => d.kind === 'videoinput')
        setCanFlipCamera(cams.length > 1)
      })
      .catch(() => {})
  }, [status])

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }, [])

  // Start camera with given facingMode
  const startCamera = useCallback(
    async (mode: FacingMode = facingMode) => {
      setStatus('loading')
      setError(null)
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Browser kamu tidak mendukung akses kamera.')
        }
        stopStream()
        let stream: MediaStream | null = null

        // Safari (khususnya macOS) kadang gagal pada constraint detail.
        // Gunakan fallback bertahap agar kamera tetap bisa terbuka.
        const primaryConstraints: MediaStreamConstraints = supportsFacingModeConstraint()
          ? {
              video: {
                facingMode: { ideal: mode },
                width: { ideal: 1280 },
                height: { ideal: 960 },
              },
              audio: false,
            }
          : {
              video: {
                width: { ideal: 1280 },
                height: { ideal: 960 },
              },
              audio: false,
            }

        try {
          stream = await navigator.mediaDevices.getUserMedia(primaryConstraints)
        } catch {
          // Fallback paling kompatibel lintas browser
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          })
        }

        if (!stream) {
          throw new Error('Gagal mengakses kamera.')
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          // iOS Safari needs explicit play after srcObject
          await videoRef.current.play().catch(() => {})
        }
        setFacingMode(mode)
        // Auto-mirror only for selfie (user) cam
        setMirror(mode === 'user')
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
    },
    [facingMode, stopStream],
  )

  const flipCamera = useCallback(() => {
    const next: FacingMode = facingMode === 'user' ? 'environment' : 'user'
    void startCamera(next)
  }, [facingMode, startCamera])

  // Stop camera on unmount
  useEffect(() => {
    return () => {
      stopStream()
    }
  }, [stopStream])

  useEffect(() => {
    const currentlyShowingResult = photos.length === shotCount && photos.length > 0
    if (currentlyShowingResult) return
    const video = videoRef.current
    const stream = streamRef.current
    if (!video || !stream) return
    if (video.srcObject !== stream) {
      video.srcObject = stream
    }
    void video.play().catch(() => {})
  }, [photos.length, shotCount])

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
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    ctx.setTransform(1, 0, 0, 1, 0, 0)

    return canvas.toDataURL('image/jpeg', 0.92)
  }, [mirror])

  // Capture sequence
  const runCaptureSequence = useCallback(async () => {
    if (status !== 'ready') return

    setShowResultView(false)
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
    setShowResultView(false)
    // Acak lagi supaya sesi berikutnya pose-nya beda
    setPoseSequence(buildPoseSequence(shotCount, poseMode))
  }, [shotCount, poseMode])

  const reshufflePoses = useCallback(() => {
    setPoseSequence(buildPoseSequence(shotCount, poseMode))
  }, [shotCount, poseMode])

  const handleDownload = useCallback(() => {
    const canvas = stripCanvasRef.current
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/png')
    const filename = `snapbooth-${Date.now()}.png`
    const link = document.createElement('a')
    link.download = filename
    link.href = dataUrl
    link.rel = 'noopener'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  const handleShare = useCallback(async () => {
    const canvas = stripCanvasRef.current
    if (!canvas) return
    canvas.toBlob(async (blob) => {
      if (!blob) {
        handleDownload()
        return
      }
      const file = new File([blob], 'snapbooth.png', { type: 'image/png' })
      if (
        typeof navigator !== 'undefined' &&
        typeof navigator.share === 'function' &&
        navigator.canShare?.({ files: [file] })
      ) {
        try {
          await navigator.share({
            files: [file],
            title: 'Snapbooth',
            text: 'Photo strip dari Snapbooth',
          })
        } catch {
          // user cancelled
        }
      } else {
        handleDownload()
      }
    }, 'image/png')
  }, [handleDownload])

  const hasCaptureResult = photos.length === shotCount && photos.length > 0
  const hasResult = hasCaptureResult && showResultView
  const busy = status === 'capturing'

  useEffect(() => {
    if (shotCount > 4 && templateId === 'grid-2x2') {
      setTemplateId('classic-strip')
    }
  }, [shotCount, templateId])

  // Pose yang sedang ditampilkan di panel & PIP
  const activePose = useMemo(() => {
    const idx = Math.min(currentShot, poseSequence.length - 1)
    return poseSequence[idx] ?? poseSequence[0]
  }, [currentShot, poseSequence])

  const poseTitles = useMemo(
    () => poseSequence.map((p) => p.title),
    [poseSequence],
  )

  const { outputPhotoIndices, outputPhotos, outputPoseTitles, toggleSelectedPhoto } = useSelectedPhotos({
    photos,
    poseTitles,
  })

  return (
    <div
      className={cn(
        'grid gap-6',
        'lg:grid-cols-[minmax(0,1fr)_460px] xl:grid-cols-[minmax(0,1fr)_520px]',
      )}
    >
      {/* LEFT: Camera / Strip */}
      <div className="space-y-4">
        {hasResult ? (
          <ResultView
            photos={outputPhotos}
            poseTitles={outputPoseTitles}
            frameColor={frameColor}
            templateId={templateId}
            stickerThemeId={stickerThemeId}
            polaroidColor={polaroidColor}
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
            {/* Mode picker — pilih Solo / Couple / Campur sebelum mulai */}
            <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
              <ModePicker
                mode={poseMode}
                onChange={setPoseMode}
                disabled={busy}
              />

              {/* Pose example panel */}
              <PosePanel
                pose={activePose}
                active={status === 'capturing'}
                index={Math.min(currentShot, poseSequence.length - 1)}
                total={poseSequence.length}
              />
            </div>

            <div className="mx-auto w-full max-w-[620px]">
              <CameraStage
                ref={videoRef}
                status={status}
                errorMessage={error}
                mirror={mirror}
                countdown={countdown}
                flash={flash}
                currentShot={currentShot}
                totalShots={shotCount}
                pose={activePose}
                canFlipCamera={canFlipCamera}
                onRequestCamera={() => void startCamera()}
                onFlipCamera={flipCamera}
              />
            </div>

            {/* Capture CTA */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-3 shadow-sm">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {status === 'ready'
                      ? busy
                        ? `Memotret ${currentShot + 1}/${shotCount}...`
                        : 'Kamera siap!'
                      : 'Kamera belum aktif'}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {status === 'ready'
                      ? `${shotCount} foto · ${countdownSeconds}d · pose random`
                      : 'Aktifkan kamera untuk mulai'}
                  </p>
                </div>
              </div>
              <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                <button
                  type="button"
                  onClick={runCaptureSequence}
                  disabled={status !== 'ready'}
                  className={cn(
                    'inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-lg transition sm:flex-none',
                    'bg-primary text-primary-foreground hover:brightness-110',
                    'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none',
                  )}
                >
                  <Camera className="h-4 w-4" aria-hidden="true" />
                  Mulai Memotret
                </button>
                {hasCaptureResult && (
                  <button
                    type="button"
                    onClick={() => setShowResultView(true)}
                    className="inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold transition hover:bg-secondary sm:flex-none"
                  >
                    Lanjut ke Hasil
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* RIGHT: Controls */}
      {hasResult ? (
        <ResultCustomizer
          photos={photos}
          selectedPhotoIndices={outputPhotoIndices}
          onTogglePhoto={toggleSelectedPhoto}
          selectedFrame={frameColor}
          onFrameChange={setFrameColor}
          polaroidColor={polaroidColor}
          onPolaroidColorChange={setPolaroidColor}
          selectedTemplate={templateId}
          onTemplateChange={setTemplateId}
          selectedSticker={stickerThemeId}
          onStickerChange={setStickerThemeId}
        />
      ) : (
        <aside className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-serif text-xl">Pengaturan Foto</h2>
            <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-accent-foreground uppercase">
              Pra-Foto
            </span>
          </div>
          <Controls
            selectedFrame={frameColor}
            onFrameChange={setFrameColor}
            shotCount={shotCount}
            onShotCountChange={setShotCount}
            countdownSeconds={countdownSeconds}
            onCountdownChange={setCountdownSeconds}
            mirror={mirror}
            onMirrorChange={setMirror}
            onShufflePoses={reshufflePoses}
            livePhotos={photos}
            disabled={busy}
            hideStyleControls
          />
        </aside>
      )}
    </div>
  )
}

function ResultView({
  photos,
  poseTitles,
  frameColor,
  templateId,
  stickerThemeId,
  polaroidColor,
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
  poseTitles: string[]
  frameColor: string
  templateId: string
  stickerThemeId: string
  polaroidColor: string
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
    <div className="grid gap-5 rounded-2xl border bg-card p-5 shadow-sm sm:p-6 md:grid-cols-[auto_1fr]">
      <div className="flex justify-center md:justify-start">
        <PhotoStrip
          photos={photos}
          poseTitles={poseTitles}
          frameColorId={frameColor}
          templateId={templateId}
          stickerThemeId={stickerThemeId}
          polaroidColor={polaroidColor}
          caption={caption}
          showDate={showDate}
          onCanvasReady={onCanvasReady}
        />
      </div>
      <div className="flex flex-col justify-between gap-6">
        <div className="space-y-4">
          <div>
            <h2 className="font-serif text-3xl leading-tight text-balance">
              Photo strip kamu sudah siap
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
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none"
              placeholder="Tulis sesuatu..."
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showDate}
              onChange={(e) => onShowDateChange(e.target.checked)}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            Tampilkan tanggal
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onDownload}
            className="inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:brightness-110"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Download
          </button>
          <button
            type="button"
            onClick={onShare}
            className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold transition hover:bg-secondary"
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
            Bagikan
          </button>
          <button
            type="button"
            onClick={onRetake}
            className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold transition hover:bg-secondary"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Ambil Lagi
          </button>
        </div>
      </div>
    </div>
  )
}

/* --------------- Mode picker --------------- */

function ModePicker({
  mode,
  onChange,
  disabled,
}: {
  mode: PoseMode
  onChange: (m: PoseMode) => void
  disabled?: boolean
}) {
  const options: {
    id: PoseMode
    label: string
    hint: string
    icon: React.ReactNode
  }[] = [
    {
      id: 'solo',
      label: 'Solo',
      hint: '10 pose sendiri',
      icon: <User className="h-4 w-4" aria-hidden="true" />,
    },
    {
      id: 'couple',
      label: 'Couple',
      hint: '10 pose berdua',
      icon: <Users className="h-4 w-4" aria-hidden="true" />,
    },
    {
      id: 'mix',
      label: 'Campur',
      hint: 'Solo + couple',
      icon: <ShuffleIcon className="h-4 w-4" aria-hidden="true" />,
    },
  ]

  return (
    <div
      className="rounded-2xl border bg-card p-3 shadow-sm"
      role="radiogroup"
      aria-label="Mode pose foto"
    >
      <div className="mb-2 flex items-center justify-between px-1">
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Mode Foto
        </p>
        <span className="text-[10px] text-muted-foreground">
          Pilih sebelum mulai
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {options.map((opt) => {
          const active = mode === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt.id)}
              disabled={disabled}
              className={cn(
                'flex min-h-14 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl border px-2 py-2 text-xs font-semibold transition',
                'disabled:cursor-not-allowed disabled:opacity-50',
                active
                  ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                  : 'border-border bg-background hover:border-foreground/30',
              )}
            >
              <span className="flex items-center gap-1.5">
                {opt.icon}
                <span>{opt.label}</span>
              </span>
              <span
                className={cn(
                  'text-[10px] font-normal',
                  active ? 'text-primary-foreground/80' : 'text-muted-foreground',
                )}
              >
                {opt.hint}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
