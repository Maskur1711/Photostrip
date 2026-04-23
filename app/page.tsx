import { Photobooth } from '@/components/photobooth/photobooth'
import { Camera, Sparkles, Heart } from 'lucide-react'

export default function Page() {
  return (
    <main className="min-h-dvh bg-background">
      {/* Top nav */}
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm"
              aria-hidden="true"
            >
              <Camera className="h-5 w-5" strokeWidth={2.25} />
            </div>
            <div className="leading-tight">
              <p className="font-serif text-xl">Snapbooth</p>
              <p className="text-[11px] tracking-wider text-muted-foreground uppercase">
                Photobooth Online
              </p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a
              href="#photobooth"
              className="text-muted-foreground transition hover:text-foreground"
            >
              Photobooth
            </a>
            <a
              href="#fitur"
              className="text-muted-foreground transition hover:text-foreground"
            >
              Fitur
            </a>
            <a
              href="#cara"
              className="text-muted-foreground transition hover:text-foreground"
            >
              Cara Pakai
            </a>
          </nav>
          <a
            href="#photobooth"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition hover:brightness-110"
          >
            Mulai
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 pt-14 pb-10 text-center md:px-6 md:pt-20 md:pb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            <Sparkles
              className="h-3.5 w-3.5 text-primary"
              aria-hidden="true"
            />
            100% di browser · tanpa upload ke server
          </div>
          <h1 className="mx-auto mt-5 max-w-3xl font-serif text-5xl leading-[1.05] tracking-tight text-balance md:text-7xl">
            Bikin <em className="italic text-primary">photo strip</em> lucu
            dengan 20 pose kartun.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground text-pretty md:text-lg">
            Pose solo & couple ala Zootopia muncul acak setiap jepretan —
            tinggal tiru ilustrasinya, kamera otomatis memotret. Ringan di HP,
            tanpa upload ke server.
          </p>
          <div className="mt-7 flex items-center justify-center gap-3">
            <a
              href="#photobooth"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:brightness-110"
            >
              <Camera className="h-4 w-4" aria-hidden="true" />
              Mulai Memotret
            </a>
            <a
              href="#cara"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold shadow-sm transition hover:bg-secondary"
            >
              Lihat cara pakai
            </a>
          </div>

          {/* Decorative mini strip */}
          <div
            aria-hidden="true"
            className="mx-auto mt-14 flex w-fit items-end justify-center gap-3 md:mt-16"
          >
            <MiniFilm rotate="-rotate-6" tone="bg-[oklch(0.88_0.08_30)]" />
            <MiniFilm rotate="rotate-2" tone="bg-primary" />
            <MiniFilm rotate="-rotate-3" tone="bg-[oklch(0.85_0.06_60)]" />
          </div>
        </div>
      </section>

      {/* Photobooth */}
      <section id="photobooth" className="scroll-mt-20">
        <div className="mx-auto max-w-8xl px-4 pb-16 md:px-6">
          <Photobooth />
        </div>
      </section>

      {/* Features */}
      <section
        id="fitur"
        className="scroll-mt-20 border-t border-border/60 bg-secondary/40"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">
              Kenapa Snapbooth
            </p>
            <h2 className="mt-2 font-serif text-4xl leading-tight text-balance md:text-5xl">
              Semua yang kamu butuhkan untuk sesi foto seru.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <FeatureCard
              icon={<Sparkles className="h-5 w-5" aria-hidden="true" />}
              title="20 Pose Random"
              description="10 pose solo + 10 pose couple bergaya Zootopia, muncul bergantian acak tiap jepretan."
            />
            <FeatureCard
              icon={<Camera className="h-5 w-5" aria-hidden="true" />}
              title="Mobile Friendly"
              description="Dibangun dengan SVG ringan. Toggle kamera depan-belakang langsung dari HP."
            />
            <FeatureCard
              icon={<Heart className="h-5 w-5" aria-hidden="true" />}
              title="Privasi Aman"
              description="Semua proses terjadi di browser. Foto kamu tidak pernah dikirim ke server."
            />
          </div>
        </div>
      </section>

      {/* How to */}
      <section id="cara" className="scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
            <div>
              <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                Cara Pakai
              </p>
              <h2 className="mt-2 font-serif text-4xl leading-tight text-balance md:text-5xl">
                Tiga langkah sederhana, hasil memorable.
              </h2>
              <p className="mt-4 text-muted-foreground text-pretty">
                Snapbooth dirancang supaya kamu bisa langsung pose tanpa ribet.
                Cukup izinkan akses kamera, sesuaikan gaya, lalu tekan tombol
                capture.
              </p>
            </div>
            <ol className="space-y-5">
              <Step
                n={1}
                title="Nyalakan kamera"
                desc="Klik 'Nyalakan Kamera' dan izinkan akses di browser."
              />
              <Step
                n={2}
                title="Tiru pose"
                desc="Ilustrasi pose muncul di atas kamera — solo atau couple, berganti tiap foto."
              />
              <Step
                n={3}
                title="Download"
                desc="Tekan 'Mulai Memotret', pose, lalu download photo strip-nya."
              />
            </ol>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground md:flex-row md:px-6">
          <p>© {new Date().getFullYear()} Photostrip</p>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mt-4 font-serif text-xl">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground text-pretty">
        {description}
      </p>
    </div>
  )
}

function Step({
  n,
  title,
  desc,
}: {
  n: number
  title: string
  desc: string
}) {
  return (
    <li className="flex gap-4">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary bg-background font-serif text-lg text-primary"
        aria-hidden="true"
      >
        {n}
      </span>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground text-pretty">{desc}</p>
      </div>
    </li>
  )
}

function MiniFilm({
  rotate,
  tone,
}: {
  rotate: string
  tone: string
}) {
  return (
    <div
      className={`${rotate} ${tone} flex w-16 flex-col gap-1 rounded-md p-1.5 shadow-lg ring-1 ring-foreground/5`}
    >
      <span className="block aspect-square rounded-sm bg-background/70" />
      <span className="block aspect-square rounded-sm bg-background/70" />
      <span className="block aspect-square rounded-sm bg-background/70" />
      <span className="block h-2 rounded-sm bg-background/50" />
    </div>
  )
}
