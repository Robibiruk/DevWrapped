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
  // New themes (per-card-type effects)
  | 'magma-effects' | 'abyss-effects' | 'sakura-effects' | 'noir-effects'

// Archetype → theme recommendation mapping
export const ARCHETYPE_THEME: Record<string, string> = {
  explorer: 'neon',
  specialist: 'blueprint',
  finisher: 'noir',
  'night-owl': 'midnight',
  'weekend-warrior': 'abyss',
  fixer: 'terminal',
  starter: 'magma',
}

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
    id: 'magma',
    name: 'Magma Core',
    emoji: '🌋',
    tagline: 'Molten lava gradients, forged in fire',
    card: 'border border-orange-700/30 bg-gradient-to-br from-[#1c0a00] via-[#3a1100] to-[#1a0600]',
    tile: 'border border-orange-800/20 bg-orange-900/10',
    accent: 'text-orange-300',
    value: 'text-white',
    muted: 'text-orange-200/60',
    chip: 'border border-orange-600/30 bg-orange-600/10 text-orange-300',
    decor: 'magma-effects',
    mono: false,
    tilt: {
      innerGradient: 'linear-gradient(145deg, rgba(249,115,22,0.4) 0%, rgba(154,27,7,0.5) 100%)',
      glowColor: 'rgba(249,115,22,0.6)',
      hue: 30,
      shineOpacity: 0.8,
    },
    cards: {
      language: { decor: 'magma-effects' },
      streak: { decor: 'magma-effects' },
      repo: { decor: 'magma-effects' },
      personality: { decor: 'magma-effects' },
      share: { decor: 'magma-effects' },
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
    id: 'abyss',
    name: 'Abyss',
    emoji: '🌊',
    tagline: 'Dive into the depths of your GitHub history',
    card: 'border border-cyan-800/30 bg-gradient-to-br from-[#020617] via-[#0c1e3a] to-[#061828]',
    tile: 'border border-cyan-800/20 bg-cyan-900/10',
    accent: 'text-cyan-200',
    value: 'text-white',
    muted: 'text-cyan-300/60',
    chip: 'border border-cyan-700/30 bg-cyan-700/10 text-cyan-300',
    decor: 'abyss-effects',
    mono: false,
    tilt: {
      innerGradient: 'linear-gradient(145deg, rgba(56,189,248,0.3) 0%, rgba(14,65,100,0.5) 100%)',
      glowColor: 'rgba(56,189,248,0.6)',
      hue: 200,
      shineOpacity: 0.7,
    },
    cards: {
      language: { decor: 'abyss-effects' },
      streak: { decor: 'abyss-effects' },
      repo: { decor: 'abyss-effects' },
      personality: { decor: 'abyss-effects' },
      share: { decor: 'abyss-effects' },
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
    id: 'sakura',
    name: 'Sakura',
    emoji: '🌸',
    tagline: 'Luxury Japanese design — matte paper, cherry blossoms',
    card: 'border border-pink-200/30 bg-gradient-to-br from-[#fdf2f8] via-[#fce7f3] to-[#f5f0e8]',
    tile: 'border border-pink-200/25 bg-white/50',
    accent: 'text-pink-600',
    value: 'text-[#1c1917]',
    muted: 'text-pink-400/80',
    chip: 'border border-pink-300/40 bg-pink-100 text-pink-700',
    decor: 'sakura-effects',
    mono: false,
    tilt: {
      innerGradient: 'linear-gradient(145deg, rgba(251,113,133,0.25) 0%, rgba(244,114,182,0.18) 100%)',
      glowColor: 'rgba(251,113,133,0.4)',
      hue: 340,
      shineOpacity: 0.5,
    },
    cards: {
      language: { decor: 'sakura-effects' },
      streak: { decor: 'sakura-effects' },
      repo: { decor: 'sakura-effects' },
      personality: { decor: 'sakura-effects' },
      share: { decor: 'sakura-effects' },
    },
  },
  {
    id: 'noir',
    name: 'Noir Gold',
    emoji: '⚜️',
    tagline: 'Matte black + satin gold — luxury, minimal, timeless',
    card: 'border border-[#d4af37]/20 bg-[#0a0a0a]',
    tile: 'border border-[#d4af37]/15 bg-[#d4af37]/5',
    accent: 'text-[#d4af37]',
    value: 'text-white',
    muted: 'text-[#d4af37]/60',
    chip: 'border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#d4af37]',
    decor: 'noir-effects',
    mono: false,
    tilt: {
      innerGradient: 'linear-gradient(145deg, rgba(212,175,55,0.2) 0%, rgba(184,154,45,0.15) 100%)',
      glowColor: 'rgba(212,175,55,0.5)',
      hue: 45,
      shineOpacity: 0.6,
    },
    cards: {
      language: { decor: 'noir-effects' },
      streak: { decor: 'noir-effects' },
      repo: { decor: 'noir-effects' },
      personality: { decor: 'noir-effects' },
      share: { decor: 'noir-effects' },
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

  // ─── Magma Core ──────────────────────────────────────────────────
  if (kind === 'magma-effects') {
    if (cardType === 'language') {
      // Lava flow — animated gradient
      return (
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: 'linear-gradient(160deg, rgba(249,115,22,0.3), rgba(180,30,10,0.25), rgba(249,115,22,0.3), rgba(180,30,10,0.25))',
              backgroundSize: '300% 300%',
              animation: 'lava 12s ease-in-out infinite',
            }}
          />
        </div>
      )
    }
    if (cardType === 'streak') {
      // Ember rise — floating orange dots
      const embers = [
        { left: '20%', delay: '0s', size: 'h-1 w-1' },
        { left: '40%', delay: '1.5s', size: 'h-1.5 w-1.5' },
        { left: '60%', delay: '0.8s', size: 'h-1 w-1' },
        { left: '75%', delay: '2.2s', size: 'h-1 w-1' },
        { left: '35%', delay: '3s', size: 'h-1.5 w-1.5' },
        { left: '55%', delay: '1s', size: 'h-0.5 w-0.5' },
      ]
      return (
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          {embers.map((e, i) => (
            <div
              key={i}
              className={`absolute bottom-0 rounded-full bg-orange-400 shadow-[0_0_6px_rgba(251,146,60,0.6)] ${e.size}`}
              style={{ left: e.left, animation: `rise 4s ${e.delay} linear infinite` }}
            />
          ))}
        </div>
      )
    }
    if (cardType === 'repo') {
      // Forge glow — centered warm radial
      return (
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          <div className="absolute left-1/2 top-1/3 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/20 blur-2xl" style={{ animation: 'pulse 4s ease-in-out infinite' }} />
          <div className="absolute left-1/2 top-1/3 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/15 blur-xl" />
        </div>
      )
    }
    if (cardType === 'personality') {
      // Cracked obsidian
      return (
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden opacity-[0.12]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'repeating-linear-gradient(135deg, rgba(249,115,22,0.6) 0px, transparent 2px, transparent 14px, rgba(249,115,22,0.4) 14px, transparent 16px, transparent 28px)',
            }}
          />
        </div>
      )
    }
    if (cardType === 'share') {
      // Full lava — deepest molten gradient
      return (
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background: 'linear-gradient(145deg, rgba(220,38,38,0.4), rgba(234,88,12,0.5), rgba(220,38,38,0.3), rgba(234,88,12,0.4))',
              backgroundSize: '300% 300%',
              animation: 'lava 8s ease-in-out infinite',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      )
    }
    return null
  }

  // ─── Abyss ────────────────────────────────────────────────────────
  if (kind === 'abyss-effects') {
    if (cardType === 'language') {
      // Caustic light beams from top
      return (
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden opacity-[0.15]">
          <div className="absolute left-[15%] top-0 h-full w-[1px] bg-gradient-to-b from-cyan-300/60 via-transparent to-transparent" style={{ transform: 'rotate(-8deg)', transformOrigin: 'top center' }} />
          <div className="absolute left-[35%] top-0 h-[70%] w-[1px] bg-gradient-to-b from-cyan-200/50 via-transparent to-transparent" style={{ transform: 'rotate(4deg)', transformOrigin: 'top center' }} />
          <div className="absolute right-[25%] top-0 h-[80%] w-[1px] bg-gradient-to-b from-cyan-300/40 via-transparent to-transparent" style={{ transform: 'rotate(-5deg)', transformOrigin: 'top center' }} />
        </div>
      )
    }
    if (cardType === 'streak') {
      // Bubble trail
      const bubbles = [
        { left: '25%', size: 'h-2 w-2', delay: '0s' },
        { left: '50%', size: 'h-3 w-3', delay: '1.2s' },
        { left: '70%', size: 'h-2 w-2', delay: '2.4s' },
        { left: '35%', size: 'h-1.5 w-1.5', delay: '0.6s' },
        { left: '60%', size: 'h-2.5 w-2.5', delay: '1.8s' },
      ]
      return (
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          {bubbles.map((b, i) => (
            <div
              key={i}
              className={`absolute bottom-0 rounded-full border border-cyan-400/30 bg-cyan-500/10 ${b.size}`}
              style={{ left: b.left, animation: `float 6s ${b.delay} ease-in-out infinite` }}
            />
          ))}
        </div>
      )
    }
    if (cardType === 'repo') {
      // Jellyfish glow — pulsing centered blue
      return (
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          <div
            className="absolute left-1/2 top-1/3 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/15 blur-2xl"
            style={{ animation: 'pulse 5s ease-in-out infinite' }}
          />
          <div className="absolute left-1/2 top-1/3 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-300/10 blur-xl" />
        </div>
      )
    }
    if (cardType === 'personality') {
      // Deep pressure — blue-tinted vignette
      return (
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(6,182,212,0.15) 70%, rgba(2,44,74,0.35) 100%)',
          }}
        />
      )
    }
    if (cardType === 'share') {
      // Abyss depths — layered deep blue
      return (
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 via-blue-900/30 to-[#020617]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute left-1/2 top-1/4 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>
      )
    }
    return null
  }

  // ─── Sakura ───────────────────────────────────────────────────────
  if (kind === 'sakura-effects') {
    if (cardType === 'language') {
      // Falling petals
      const petals = [
        { left: '15%', delay: '0s', rotate: '25deg' },
        { left: '45%', delay: '1.5s', rotate: '-35deg' },
        { left: '75%', delay: '3s', rotate: '15deg' },
        { left: '30%', delay: '2s', rotate: '40deg' },
        { left: '60%', delay: '0.5s', rotate: '-20deg' },
      ]
      return (
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden opacity-40">
          {petals.map((p, i) => (
            <div
              key={i}
              className="absolute top-0 h-2 w-2.5 rounded-full bg-pink-400/60"
              style={{ left: p.left, animation: `petalDrift 8s ${p.delay} ease-in-out infinite`, transform: `rotate(${p.rotate})` }}
            />
          ))}
        </div>
      )
    }
    if (cardType === 'streak') {
      // Ink brush stroke
      return (
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          <div className="absolute left-[5%] top-[48%] h-[3px] w-[90%] rounded-full bg-gradient-to-r from-transparent via-pink-600/25 to-transparent" />
          <div className="absolute left-[10%] top-[52%] h-[1px] w-[80%] rounded-full bg-gradient-to-r from-transparent via-pink-500/15 to-transparent" />
        </div>
      )
    }
    if (cardType === 'repo') {
      // Washi texture — subtle paper grain
      return (
        <div
          className="pointer-events-none absolute inset-0 z-[1] opacity-[0.04]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(120,113,108,0.3) 0px, transparent 1px, transparent 4px), repeating-linear-gradient(90deg, rgba(120,113,108,0.2) 0px, transparent 1px, transparent 6px)',
          }}
        />
      )
    }
    if (cardType === 'personality') {
      // Blossom crown — arc of petals
      return (
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => {
            const angle = -60 + i * 20
            const rad = (angle * Math.PI) / 180
            const x = 50 + Math.cos(rad) * 35
            const y = 18 + Math.sin(rad) * 25
            return (
              <div
                key={i}
                className="absolute h-2 w-2.5 rounded-full bg-pink-400/50"
                style={{ left: `${x}%`, top: `${y}%`, transform: `rotate(${angle}deg)` }}
              />
            )
          })}
        </div>
      )
    }
    if (cardType === 'share') {
      // Full bloom — dense petals + stronger washi
      return (
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => {
            const x = 10 + (i * 8) % 90
            const delay = (i * 0.7) % 5
            return (
              <div
                key={i}
                className="absolute top-0 h-2 w-2.5 rounded-full bg-pink-400/50"
                style={{ left: `${x}%`, animation: `petalDrift 7s ${delay}s ease-in-out infinite` }}
              />
            )
          })}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(120,113,108,0.4) 0px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgba(120,113,108,0.3) 0px, transparent 1px, transparent 5px)',
            }}
          />
        </div>
      )
    }
    return null
  }

  // ─── Noir Gold ──────────────────────────────────────────────────
  if (kind === 'noir-effects') {
    if (cardType === 'language') {
      // Gold hairline
      return (
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          <div className="absolute left-0 right-0 top-[48%] h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
        </div>
      )
    }
    if (cardType === 'streak') {
      // Gold shimmer sweep
      return (
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden opacity-[0.2]">
          <div
            className="absolute inset-[-100%] rotate-[25deg]"
            style={{
              background: 'linear-gradient(100deg, transparent 30%, rgba(212,175,55,0.4) 50%, transparent 70%)',
              backgroundSize: '400% 100%',
              animation: 'goldShimmer 6s linear infinite',
            }}
          />
        </div>
      )
    }
    if (cardType === 'repo') {
      // Spotlight — focused warm glow
      return (
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          <div className="absolute left-1/2 top-1/3 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4af37]/10 blur-3xl" />
        </div>
      )
    }
    if (cardType === 'personality') {
      // Gold frame with corner accents
      return (
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-[28px]">
          <div className="absolute inset-3 border border-[#d4af37]/20 rounded-[24px]" />
          <div className="absolute left-4 top-4 h-4 w-4 border-t border-l border-[#d4af37]/30" />
          <div className="absolute right-4 top-4 h-4 w-4 border-t border-r border-[#d4af37]/30" />
          <div className="absolute left-4 bottom-4 h-4 w-4 border-b border-l border-[#d4af37]/30" />
          <div className="absolute right-4 bottom-4 h-4 w-4 border-b border-r border-[#d4af37]/30" />
        </div>
      )
    }
    if (cardType === 'share') {
      // Full noir — gold border frame + satin shimmer
      return (
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-[28px]">
          <div className="absolute inset-2 rounded-[24px] border-2 border-[#d4af37]/30" />
          <div className="absolute left-5 top-5 h-5 w-5 border-t-2 border-l-2 border-[#d4af37]/40 rounded-tl-lg" />
          <div className="absolute right-5 top-5 h-5 w-5 border-t-2 border-r-2 border-[#d4af37]/40 rounded-tr-lg" />
          <div className="absolute left-5 bottom-5 h-5 w-5 border-b-2 border-l-2 border-[#d4af37]/40 rounded-bl-lg" />
          <div className="absolute right-5 bottom-5 h-5 w-5 border-b-2 border-r-2 border-[#d4af37]/40 rounded-br-lg" />
          <div className="absolute inset-0 opacity-[0.06]" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.3) 0%, transparent 50%, rgba(212,175,55,0.2) 100%)' }} />
        </div>
      )
    }
    return null
  }

  return null
}
