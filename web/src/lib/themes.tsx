export type DecorKind =
  | 'none' | 'stars' | 'scanlines' | 'grid' | 'pixels' | 'mesh'
  // Neon Observatory
  | 'stars-dense' | 'hero-star' | 'constellation' | 'nebula'
  // Midnight Minimal
  | 'mid-grain' | 'line-graph' | 'vignette'
  // Cyber Terminal
  | 'ascii-bars' | 'terminal-grid' | 'crt-frame'
  // Blueprint
  | 'dim-lines' | 'bp-grid' | 'bp-border'
  // Wrapped Classic (hue varies by cardType)
  | 'classic-gradient'
  // Open Source Universe (planet/comet/galaxy by cardType)
  | 'universe-effects'
  // Pixel Arcade (badge/score/screen by cardType)
  | 'arcade-effects'
  // Glass Aurora (iridescent/layers by cardType)
  | 'glass-effects'

// Card types used in the ShareStudio carousel + poster
export type CardType = 'language' | 'numbers' | 'streak' | 'peak' | 'repo' | 'personality' | 'share'

export interface Theme {
  id: string
  name: string
  emoji: string
  tagline: string
  card: string
  tile: string
  accent: string
  value: string
  muted: string
  chip: string
  decor: DecorKind
  mono: boolean
  tilt: {
    innerGradient: string
    glowColor: string
    hue: number
    shineOpacity: number
  }
  // Per-card-type decor overrides — if a card type isn't listed, the theme default decor is used.
  cards: Partial<Record<CardType, { decor?: DecorKind }>>
}

export const THEMES: Theme[] = [
  {
    id: 'neon',
    name: 'Neon Observatory',
    emoji: '🌌',
    tagline: 'Aurora gradients, stars, glassmorphism',
    card: 'border border-indigo-400/20 bg-gradient-to-br from-[#0b0f19] via-[#1e1b4b] to-[#3b0764]',
    tile: 'border border-white/10 bg-white/[0.06]',
    accent: 'text-indigo-300',
    value: 'text-white',
    muted: 'text-indigo-200/60',
    chip: 'border border-white/15 bg-white/10 text-white',
    decor: 'stars',
    mono: false,
    tilt: {
      innerGradient: 'linear-gradient(145deg, rgba(76,29,149,0.55) 0%, rgba(56,189,248,0.35) 100%)',
      glowColor: 'rgba(99,102,241,0.55)',
      hue: 243,
      shineOpacity: 0.75,
    },
    cards: {
      language: { decor: 'stars-dense' },
      streak: { decor: 'stars-dense' },
      repo: { decor: 'hero-star' },
      personality: { decor: 'constellation' },
      share: { decor: 'nebula' },
    },
  },
  {
    id: 'classic',
    name: 'Wrapped Classic',
    emoji: '🎵',
    tagline: 'Bold gradients, giant typography',
    card: 'border border-white/10 bg-gradient-to-br from-emerald-500 via-green-600 to-[#0d3b1e]',
    tile: 'border border-white/15 bg-black/20',
    accent: 'text-emerald-100',
    value: 'text-white',
    muted: 'text-white/60',
    chip: 'bg-black/25 text-white',
    decor: 'none',
    mono: false,
    tilt: {
      innerGradient: 'linear-gradient(145deg, rgba(16,185,129,0.5) 0%, rgba(2,44,34,0.55) 100%)',
      glowColor: 'rgba(16,185,129,0.5)',
      hue: 152,
      shineOpacity: 0.8,
    },
    cards: {
      language: { decor: 'classic-gradient' },
      numbers: { decor: 'classic-gradient' },
      streak: { decor: 'classic-gradient' },
      peak: { decor: 'classic-gradient' },
      repo: { decor: 'classic-gradient' },
      personality: { decor: 'classic-gradient' },
      share: { decor: 'classic-gradient' },
    },
  },
  {
    id: 'midnight',
    name: 'Midnight Minimal',
    emoji: '⚫',
    tagline: 'Clean, editorial, professional',
    card: 'border border-white/10 bg-[#0b0b0f]',
    tile: 'border border-white/[0.08] bg-white/[0.04]',
    accent: 'text-neutral-300',
    value: 'text-white',
    muted: 'text-neutral-500',
    chip: 'border border-white/10 bg-white/5 text-neutral-300',
    decor: 'none',
    mono: false,
    tilt: {
      innerGradient: 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
      glowColor: 'rgba(255,255,255,0.22)',
      hue: 220,
      shineOpacity: 0.45,
    },
    cards: {
      language: { decor: 'mid-grain' },
      streak: { decor: 'line-graph' },
      share: { decor: 'vignette' },
    },
  },
  {
    id: 'terminal',
    name: 'Cyber Terminal',
    emoji: '🛰',
    tagline: 'CRT hacker aesthetic',
    card: 'border border-green-500/30 bg-[#04120a]',
    tile: 'border border-green-500/20 bg-green-500/5',
    accent: 'text-green-400',
    value: 'text-green-300',
    muted: 'text-green-500/70',
    chip: 'border border-green-500/30 bg-green-500/10 text-green-400',
    decor: 'scanlines',
    mono: true,
    tilt: {
      innerGradient: 'linear-gradient(145deg, rgba(34,197,94,0.22) 0%, rgba(6,78,59,0.45) 100%)',
      glowColor: 'rgba(34,197,94,0.4)',
      hue: 142,
      shineOpacity: 0.6,
    },
    cards: {
      language: { decor: 'ascii-bars' },
      streak: { decor: 'terminal-grid' },
      share: { decor: 'crt-frame' },
    },
  },
  {
    id: 'universe',
    name: 'Open Source Universe',
    emoji: '🌍',
    tagline: 'Repos as planets, stars as commits',
    card: 'border border-purple-300/20 bg-gradient-to-br from-[#050816] via-[#111a4d] to-[#2b1055]',
    tile: 'border border-purple-300/20 bg-white/[0.06]',
    accent: 'text-cyan-300',
    value: 'text-white',
    muted: 'text-slate-400',
    chip: 'border border-purple-300/25 bg-purple-400/10 text-purple-200',
    decor: 'stars',
    mono: false,
    tilt: {
      innerGradient: 'linear-gradient(145deg, rgba(88,28,135,0.5) 0%, rgba(14,165,233,0.3) 100%)',
      glowColor: 'rgba(168,85,247,0.5)',
      hue: 265,
      shineOpacity: 0.75,
    },
    cards: {
      repo: { decor: 'universe-effects' },
      streak: { decor: 'universe-effects' },
      personality: { decor: 'universe-effects' },
    },
  },
  {
    id: 'blueprint',
    name: 'Blueprint',
    emoji: '📐',
    tagline: 'Engineering drawings, grids',
    card: 'border-2 border-[#0b3d91]/30 bg-[#eaf3ff]',
    tile: 'border border-[#0b3d91]/25 bg-white/60',
    accent: 'text-[#0b3d91]',
    value: 'text-[#0a2f6b]',
    muted: 'text-[#0b3d91]/70',
    chip: 'border border-[#0b3d91]/30 bg-[#0b3d91]/10 text-[#0b3d91]',
    decor: 'grid',
    mono: true,
    tilt: {
      innerGradient: 'linear-gradient(145deg, rgba(11,61,145,0.14) 0%, rgba(11,61,145,0.3) 100%)',
      glowColor: 'rgba(26,91,214,0.35)',
      hue: 214,
      shineOpacity: 0.25,
    },
    cards: {
      language: { decor: 'dim-lines' },
      streak: { decor: 'bp-grid' },
      share: { decor: 'bp-border' },
    },
  },
  {
    id: 'arcade',
    name: 'Pixel Arcade',
    emoji: '🎮',
    tagline: 'Retro 8-bit, chunky, nostalgic',
    card: 'border-4 border-[#fde047] bg-[#24175a]',
    tile: 'border-2 border-[#fde047]/40 bg-[#fde047]/10',
    accent: 'text-[#4ade80]',
    value: 'text-white',
    muted: 'text-[#fde047]/70',
    chip: 'bg-[#ec4899] text-white',
    decor: 'pixels',
    mono: true,
    tilt: {
      innerGradient: 'linear-gradient(145deg, rgba(236,72,153,0.4) 0%, rgba(59,130,246,0.35) 100%)',
      glowColor: 'rgba(250,204,21,0.5)',
      hue: 48,
      shineOpacity: 0.8,
    },
    cards: {
      personality: { decor: 'arcade-effects' },
      streak: { decor: 'arcade-effects' },
      share: { decor: 'arcade-effects' },
    },
  },
  {
    id: 'aurora',
    name: 'Glass Aurora',
    emoji: '💎',
    tagline: 'Frosted glass, liquid gradients',
    card: 'border border-white/25 bg-white/10 backdrop-blur-xl',
    tile: 'border border-white/20 bg-white/10',
    accent: 'text-cyan-200',
    value: 'text-white',
    muted: 'text-white/60',
    chip: 'border border-white/20 bg-white/15 text-white',
    decor: 'mesh',
    mono: false,
    tilt: {
      innerGradient: 'linear-gradient(145deg, rgba(34,211,238,0.25) 0%, rgba(232,121,249,0.2) 100%)',
      glowColor: 'rgba(103,232,249,0.45)',
      hue: 190,
      shineOpacity: 0.7,
    },
    cards: {
      language: { decor: 'glass-effects' },
      share: { decor: 'glass-effects' },
      personality: { decor: 'glass-effects' },
    },
  },
]

export function getTheme(id: string): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0]
}

const STARS = [
  { left: '12%', top: '18%', size: 'h-0.5 w-0.5', opacity: 0.7 },
  { left: '28%', top: '10%', size: 'h-1 w-1', opacity: 0.5 },
  { left: '45%', top: '24%', size: 'h-0.5 w-0.5', opacity: 0.4 },
  { left: '62%', top: '12%', size: 'h-0.5 w-0.5', opacity: 0.6 },
  { left: '78%', top: '22%', size: 'h-1 w-1', opacity: 0.4 },
  { left: '88%', top: '40%', size: 'h-0.5 w-0.5', opacity: 0.5 },
  { left: '10%', top: '52%', size: 'h-0.5 w-0.5', opacity: 0.5 },
  { left: '20%', top: '70%', size: 'h-1 w-1', opacity: 0.4 },
  { left: '36%', top: '80%', size: 'h-0.5 w-0.5', opacity: 0.6 },
  { left: '55%', top: '68%', size: 'h-0.5 w-0.5', opacity: 0.5 },
  { left: '70%', top: '82%', size: 'h-1 w-1', opacity: 0.4 },
  { left: '84%', top: '64%', size: 'h-0.5 w-0.5', opacity: 0.6 },
  { left: '50%', top: '40%', size: 'h-0.5 w-0.5', opacity: 0.35 },
  { left: '8%', top: '36%', size: 'h-1 w-1', opacity: 0.35 },
]

const STARS_DENSE = [
  ...STARS,
  { left: '4%', top: '14%', size: 'h-0.5 w-0.5', opacity: 0.5 },
  { left: '16%', top: '44%', size: 'h-0.5 w-0.5', opacity: 0.45 },
  { left: '24%', top: '58%', size: 'h-1 w-1', opacity: 0.35 },
  { left: '32%', top: '32%', size: 'h-0.5 w-0.5', opacity: 0.55 },
  { left: '40%', top: '16%', size: 'h-0.5 w-0.5', opacity: 0.4 },
  { left: '58%', top: '50%', size: 'h-0.5 w-0.5', opacity: 0.45 },
  { left: '66%', top: '30%', size: 'h-1 w-1', opacity: 0.3 },
  { left: '74%', top: '74%', size: 'h-0.5 w-0.5', opacity: 0.5 },
  { left: '92%', top: '18%', size: 'h-0.5 w-0.5', opacity: 0.45 },
  { left: '46%', top: '62%', size: 'h-1 w-1', opacity: 0.35 },
  { left: '14%', top: '88%', size: 'h-0.5 w-0.5', opacity: 0.4 },
  { left: '82%', top: '48%', size: 'h-0.5 w-0.5', opacity: 0.35 },
]

export function Decor({ kind, cardType }: { kind: DecorKind; cardType?: CardType }) {
  if (kind === 'stars' || kind === 'stars-dense') {
    const dots = kind === 'stars-dense' ? STARS_DENSE : STARS
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {dots.map((s, i) => (
          <span
            key={i}
            className={`absolute rounded-full bg-white ${s.size}`}
            style={{ left: s.left, top: s.top, opacity: s.opacity }}
          />
        ))}
        <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl" />
      </div>
    )
  }

  if (kind === 'hero-star') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400/25 blur-2xl" />
        <div className="absolute left-1/2 top-1/3 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-300/15 blur-xl" />
        {STARS.slice(0, 6).map((s, i) => (
          <span key={i} className={`absolute rounded-full bg-white ${s.size}`} style={{ left: s.left, top: s.top, opacity: s.opacity * 0.6 }} />
        ))}
      </div>
    )
  }

  if (kind === 'constellation') {
    const lines = [
      [12, 18, 28, 10], [28, 10, 45, 24], [45, 24, 62, 12],
      [62, 12, 78, 22], [12, 18, 20, 70], [20, 70, 36, 80],
    ]
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {STARS_DENSE.map((s, i) => (
          <span key={i} className={`absolute rounded-full bg-indigo-300/60 ${s.size}`} style={{ left: s.left, top: s.top, opacity: s.opacity * 0.8 }} />
        ))}
        <svg className="absolute inset-0 h-full w-full opacity-20">
          {lines.map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`} stroke="rgba(199,210,254,0.6)" strokeWidth="1" />
          ))}
        </svg>
      </div>
    )
  }

  if (kind === 'nebula') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute left-1/3 top-1/4 h-40 w-40 -translate-x-1/2 rounded-full bg-cyan-400/15 blur-2xl" />
        <div className="absolute bottom-1/4 right-1/4 h-32 w-32 rounded-full bg-indigo-400/20 blur-2xl" />
      </div>
    )
  }

  if (kind === 'mid-grain') {
    return (
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px',
        }}
      />
    )
  }

  if (kind === 'line-graph') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg className="absolute inset-0 h-full w-full opacity-[0.15]" viewBox="0 0 400 500" preserveAspectRatio="none">
          <polyline
            points="0,400 40,380 80,350 120,370 160,300 200,320 240,260 280,220 320,180 360,140 400,100"
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="2"
          />
          <polyline
            points="0,420 40,400 80,410 120,390 160,340 200,360 240,290 280,250 320,210 360,170 400,120"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
            strokeDasharray="4 3"
          />
        </svg>
      </div>
    )
  }

  if (kind === 'vignette') {
    return (
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
        }}
      />
    )
  }

  if (kind === 'ascii-bars') {
    const bars = ['████████░░', '██████░░░░', '████░░░░░░', '██░░░░░░░░', '█░░░░░░░░░']
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden p-4 font-mono text-[9px] leading-tight text-green-500/20 sm:text-[10px]">
        {bars.map((b, i) => (
          <div key={i}>{`  ${b}  ${i === 0 ? '■' : ''}`}</div>
        ))}
      </div>
    )
  }

  if (kind === 'terminal-grid') {
    return (
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(74,222,128,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.4) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />
    )
  }

  if (kind === 'crt-frame') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px] shadow-[inset_0_0_80px_rgba(0,0,0,0.6)]" />
    )
  }

  if (kind === 'dim-lines') {
    return (
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]" viewBox="0 0 380 480">
        <line x1="30" y1="180" x2="140" y2="180" stroke="#0b3d91" strokeWidth="1" />
        <polygon points="140,177 148,180 140,183" fill="#0b3d91" />
        <line x1="30" y1="240" x2="140" y2="240" stroke="#0b3d91" strokeWidth="1" />
        <polygon points="140,237 148,240 140,243" fill="#0b3d91" />
        <line x1="30" y1="300" x2="140" y2="300" stroke="#0b3d91" strokeWidth="1" />
        <polygon points="140,297 148,300 140,303" fill="#0b3d91" />
        <line x1="30" y1="360" x2="140" y2="360" stroke="#0b3d91" strokeWidth="1" />
        <polygon points="140,357 148,360 140,363" fill="#0b3d91" />
      </svg>
    )
  }

  if (kind === 'bp-grid') {
    return (
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(11,61,145,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(11,61,145,0.35) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />
    )
  }

  if (kind === 'bp-border') {
    return (
      <div className="pointer-events-none absolute inset-2 rounded-[24px] border-2 border-[#0b3d91]/25">
        <div className="pointer-events-none absolute right-3 bottom-3 flex items-center gap-2 rounded border border-[#0b3d91]/30 bg-[#0b3d91]/10 px-2 py-1 text-[9px] font-medium text-[#0b3d91]/70">
          DEVWRAPPED · SHEET 1 OF 1
        </div>
      </div>
    )
  }

  if (kind === 'scanlines') {
    return (
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(74,222,128,0.6) 0px, rgba(74,222,128,0.6) 1px, transparent 1px, transparent 3px)',
        }}
      />
    )
  }

  if (kind === 'grid') {
    return (
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(rgba(11,61,145,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(11,61,145,0.18) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
    )
  }

  if (kind === 'pixels') {
    return (
      <>
        <div className="pointer-events-none absolute left-3 top-3 h-3 w-3 bg-[#fde047]" />
        <div className="pointer-events-none absolute right-3 top-3 h-3 w-3 bg-[#4ade80]" />
        <div className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 bg-[#ec4899]" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 bg-[#4ade80]" />
      </>
    )
  }

  if (kind === 'mesh') {
    return (
      <>
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-fuchsia-400/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-8 right-10 h-28 w-28 rounded-full bg-emerald-300/25 blur-2xl" />
      </>
    )
  }

  // ─── Wrapped Classic ──────────────────────────────────────────────
  // Each card type gets a different bold gradient hue (Spotify Wrapped style).
  if (kind === 'classic-gradient') {
    const gradients: Partial<Record<CardType, string>> = {
      language: 'from-emerald-500/20 via-green-600/15 to-emerald-700/20',
      numbers: 'from-violet-500/20 via-purple-600/15 to-indigo-700/20',
      streak: 'from-amber-500/20 via-orange-600/15 to-rose-700/20',
      peak: 'from-rose-500/20 via-red-600/15 to-pink-700/20',
      repo: 'from-sky-500/20 via-blue-600/15 to-cyan-700/20',
      personality: 'from-pink-500/20 via-fuchsia-600/15 to-violet-700/20',
      share: 'from-indigo-600/25 via-violet-600/20 to-purple-700/25',
    }
    const gradient = gradients[cardType ?? 'numbers'] ?? gradients.numbers
    return (
      <div className={`pointer-events-none absolute inset-0 z-[1] bg-gradient-to-br ${gradient}`} />
    )
  }

  // ─── Open Source Universe ─────────────────────────────────────────
  if (kind === 'universe-effects') {
    if (cardType === 'repo') {
      // Planet orb with orbital glow
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/4 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-purple-400/25 to-cyan-400/15 shadow-[0_0_40px_rgba(139,92,246,0.3)]" />
          <div className="absolute left-1/4 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-300/10" style={{ transform: 'translate(-50%,-50%) rotateX(75deg)' }} />
          <div className="absolute left-1/4 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-300/5" style={{ transform: 'translate(-50%,-50%) rotateX(75deg) rotateZ(15deg)' }} />
        </div>
      )
    }
    if (cardType === 'streak') {
      // Comet trail
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-10%] top-[30%] h-[2px] w-[120%] -rotate-[20deg] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
          <div className="absolute left-[-5%] top-[28%] h-[1px] w-[110%] -rotate-[20deg] bg-gradient-to-r from-transparent via-purple-400/15 to-transparent" />
          <div className="absolute right-[5%] top-[27%] h-2 w-2 rounded-full bg-cyan-300/40 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
        </div>
      )
    }
    if (cardType === 'personality') {
      // Galaxy swirl
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.15]">
          <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_0deg,transparent,rgba(139,92,246,0.4),transparent,rgba(34,211,238,0.3),transparent)]" style={{ animation: 'spin 20s linear infinite' }} />
          <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/20 blur-xl" />
        </div>
      )
    }
    return null
  }

  // ─── Pixel Arcade ────────────────────────────────────────────────
  if (kind === 'arcade-effects') {
    if (cardType === 'personality') {
      // Pixel badge border
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-3 border-4 border-dashed border-[#fde047]/40" />
          <div className="absolute inset-3 border border-[#fde047]/10" />
          <div className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-[#fde047]/15 px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#fde047]/60">
            ★ SELECTED ★
          </div>
        </div>
      )
    }
    if (cardType === 'streak') {
      // Retro high-score box
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute right-4 top-4 rounded border-2 border-dashed border-[#4ade80]/50 px-2 py-1 font-mono text-[10px] font-bold text-[#4ade80]">
            HIGH SCORE
          </div>
        </div>
      )
    }
    if (cardType === 'share') {
      // Retro screen frame
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-2 rounded-2xl border-2 border-[#fde047]/25" />
          <div className="absolute inset-3 rounded-xl border border-[#fde047]/10" />
        </div>
      )
    }
    return null
  }

  // ─── Glass Aurora ────────────────────────────────────────────────
  if (kind === 'glass-effects') {
    if (cardType === 'share') {
      // Stacked glass panels
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-4 top-6 right-4 bottom-8 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm" />
          <div className="absolute left-8 top-10 right-8 bottom-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-[2px]" />
          <div className="absolute left-12 top-14 right-12 bottom-16 rounded-2xl border border-white/[0.04] bg-white/[0.01]" />
        </div>
      )
    }
    if (cardType === 'language') {
      // Iridescent sweep
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.08]">
          <div
            className="absolute inset-[-50%] rotate-[30deg]"
            style={{
              background: 'linear-gradient(120deg, rgba(255,0,128,0.3), rgba(0,200,255,0.3), rgba(128,255,0,0.3), rgba(255,0,128,0.3))',
              backgroundSize: '200% 200%',
              animation: 'iridescent 8s ease-in-out infinite',
            }}
          />
        </div>
      )
    }
    if (cardType === 'personality') {
      // Frosted glass accent
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-4 top-4 right-4 bottom-4 rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-[4px]" />
        </div>
      )
    }
    return null
  }

  return null
}
