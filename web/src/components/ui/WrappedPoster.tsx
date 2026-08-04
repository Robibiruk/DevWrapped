import type { ReactNode, Ref } from 'react'
import { Braces, GitCommitHorizontal, Flame, TrendingUp, Star, Code } from 'lucide-react'
import type { Analysis } from '../../lib/analysis'
import type { Personality } from '../../lib/personality'
import type { Theme } from '../../lib/themes'
import { useTilt } from '../../lib/tilt'
import CardEffects from './CardEffects'

interface Tile {
  icon: ReactNode
  label: string
  value: string
  sub?: string
}

interface Props {
  analysis: Analysis
  personality: Personality
  username: string
  year: number
  avatarUrl: string
  theme: Theme
  ref?: Ref<HTMLDivElement>
}

export default function WrappedPoster({ analysis, personality, username, year, avatarUrl, theme, ref }: Props) {
  const { wrapRef, shellRef, vars, glowStyle, shineStyle, glareStyle } = useTilt(theme)
  const topLang = analysis.languages[0]
  const peak = analysis.peakMoment
  const peakSub = peak
    ? new Date(`${peak.date}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : undefined
  const iconCls = 'h-4 w-4'
  const valueFont = theme.mono ? 'font-mono' : 'font-display'

  const mergeWrapRef = (el: HTMLDivElement | null) => {
    wrapRef.current = el
    if (typeof ref === 'function') ref(el)
    else if (ref) (ref as { current: HTMLDivElement | null }).current = el
  }

  const setShellRef = (el: HTMLDivElement | null) => {
    shellRef.current = el
  }

  const tiles: Tile[] = [
    {
      icon: <Braces className={iconCls} />,
      label: 'top language',
      value: topLang?.name ?? '—',
      sub: topLang ? `${topLang.percent.toFixed(0)}% of code` : undefined,
    },
    {
      icon: <GitCommitHorizontal className={iconCls} />,
      label: 'total commits',
      value: analysis.totalCommits.toLocaleString(),
    },
    {
      icon: <Flame className={iconCls} />,
      label: 'longest streak',
      value: analysis.longestStreak > 0 ? `${analysis.longestStreak}d` : '—',
    },
    {
      icon: <TrendingUp className={iconCls} />,
      label: 'peak day',
      value: peak ? peak.count.toLocaleString() : '—',
      sub: peakSub,
    },
    {
      icon: <Star className={iconCls} />,
      label: 'stars earned',
      value: analysis.totalStars.toLocaleString(),
    },
    {
      icon: <Code className={iconCls} />,
      label: 'most active repo',
      value: analysis.mostActiveRepo !== '—' ? analysis.mostActiveRepo : '—',
    },
  ]

  return (
    <div
      ref={mergeWrapRef}
      className="relative w-full max-w-[380px]"
      style={{ perspective: '600px', transform: 'translate3d(0, 0, 0)', ...vars }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-200 ease-out"
        style={glowStyle}
      />
      <div
        ref={setShellRef}
        className={`relative aspect-[4/5] w-full overflow-hidden rounded-[28px] p-6 sm:p-7 ${theme.card}`}
        style={{
          transform: 'translateZ(0) rotateX(var(--rotate-y)) rotateY(var(--rotate-x))',
          boxShadow:
            'rgba(0,0,0,0.8) calc((var(--pointer-from-left) * 10px) - 3px) calc((var(--pointer-from-top) * 20px) - 6px) 20px -5px',
        }}
      >
        <CardEffects theme={theme} cardType="share" shineStyle={shineStyle} glareStyle={glareStyle} />

        <div
          className="relative z-[2] flex h-full flex-col"
          style={{
            transform:
              'translate3d(calc(var(--pointer-from-left) * -6px + 3px), calc(var(--pointer-from-top) * -6px + 3px), 0.1px)',
          }}
        >
          <div className="flex items-center gap-3">
            <img src={avatarUrl} alt="" className="h-11 w-11 rounded-full border-2 border-white/30 object-cover" />
            <div className="min-w-0 flex-1">
              <p className={`truncate font-display text-sm font-bold ${theme.value}`}>@{username}</p>
              <p className={`font-mono text-[10px] uppercase tracking-[0.25em] ${theme.muted}`}>devwrapped</p>
            </div>
            <span className={`rounded-full px-3 py-1 font-mono text-xs font-semibold ${theme.chip}`}>{year}</span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-4xl">{personality.archetype.emoji}</span>
            <div className="min-w-0">
              <p className={`truncate font-display text-2xl font-extrabold leading-tight ${valueFont} ${theme.value}`}>
                {personality.archetype.name}
              </p>
              <p className={`truncate text-xs font-medium ${theme.muted}`}>{personality.archetype.tagline}</p>
            </div>
          </div>

          <p className={`mt-4 font-mono text-[10px] uppercase tracking-[0.3em] ${theme.muted}`}>
            your year, by the numbers
          </p>
          <div className="mt-3 grid flex-1 grid-cols-2 content-start gap-2.5">
            {tiles.map((t) => (
              <div key={t.label} className={`flex min-h-0 flex-col justify-center rounded-2xl px-3 py-2.5 ${theme.tile}`}>
                <div className={`flex items-center gap-1.5 ${theme.accent}`}>
                  {t.icon}
                  <span className={`font-mono text-[9px] uppercase tracking-[0.18em] ${theme.mono ? theme.accent : theme.muted}`}>
                    {t.label}
                  </span>
                </div>
                <p className={`mt-0.5 truncate font-display text-xl font-extrabold ${valueFont} ${theme.value}`}>{t.value}</p>
                {t.sub && <p className={`truncate text-[11px] ${theme.muted}`}>{t.sub}</p>}
              </div>
            ))}
          </div>

          <div className={`mt-4 flex items-center justify-between ${theme.muted}`}>
            <span className="font-mono text-[10px] uppercase tracking-[0.32em]">your year in code</span>
            <span className={`flex h-7 w-7 items-center justify-center rounded-full ${theme.chip}`}>
              <Code className="h-4 w-4 text-current" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
