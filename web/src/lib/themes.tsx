export type DecorKind = 'none' | 'stars' | 'scanlines' | 'grid' | 'pixels' | 'mesh'

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

export function Decor({ kind }: { kind: DecorKind }) {
  if (kind === 'stars') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {STARS.map((s, i) => (
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
  return null
}
