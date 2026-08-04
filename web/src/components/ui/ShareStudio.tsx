import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { toPng } from 'html-to-image'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Copy,
  Check,
  Sparkles,
  Star,
  Braces,
  GitCommitHorizontal,
  Flame,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'
import type { Analysis } from '../../lib/analysis'
import type { Personality } from '../../lib/personality'
import { getTheme, ARCHETYPE_THEME } from '../../lib/themes'
import ShareCard, { type StatCardDef } from './ShareCard'
import WrappedPoster from './WrappedPoster'
import ThemePicker from './ThemePicker'

interface Props {
  analysis: Analysis
  personality: Personality
  username: string
  year: number
  avatarUrl: string
}

function buildStatCards(analysis: Analysis, personality: Personality, username: string, year: number): StatCardDef[] {
  const topLang = analysis.languages[0]
  const peak = analysis.peakMoment
  const defs: StatCardDef[] = []

  if (topLang) {
    defs.push({
      cardType: 'language',
      icon: <Braces className="h-5 w-5" />,
      label: 'top language',
      value: topLang.name,
      sub: `${topLang.percent.toFixed(0)}% of everything you wrote`,
      username,
      year,
    })
  }
  defs.push({
    cardType: 'numbers',
    icon: <GitCommitHorizontal className="h-5 w-5" />,
    label: 'total commits',
    value: analysis.totalCommits.toLocaleString(),
    sub: `commits shipped in ${year}`,
    username,
    year,
  })
  if (analysis.longestStreak > 0) {
    defs.push({
      cardType: 'streak',
      icon: <Flame className="h-5 w-5" />,
      label: 'longest streak',
      value: `${analysis.longestStreak}`,
      sub: `${analysis.longestStreak === 1 ? 'day' : 'days'} in a row — no breaks`,
      username,
      year,
    })
  }
  if (peak) {
    defs.push({
      cardType: 'peak',
      icon: <TrendingUp className="h-5 w-5" />,
      label: 'peak day',
      value: peak.count.toLocaleString(),
      sub: `commits on ${new Date(`${peak.date}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      username,
      year,
    })
  }
  if (analysis.mostActiveRepo !== '—') {
    defs.push({
      cardType: 'repo',
      icon: <Star className="h-5 w-5" />,
      label: 'most active repo',
      value: analysis.mostActiveRepo,
      sub: 'where you did most of your work',
      username,
      year,
    })
  }
  defs.push({
    cardType: 'personality',
    icon: <span className="text-lg leading-none">{personality.archetype.emoji}</span>,
    label: 'developer archetype',
    value: personality.archetype.name,
    sub: personality.archetype.tagline,
    username,
    year,
  })

  return defs
}

export default function ShareStudio({ analysis, personality, username, year, avatarUrl }: Props) {
  const recommendedThemeId = personality ? (ARCHETYPE_THEME[personality.archetype.id] ?? 'neon') : 'neon'
  const [themeId, setThemeId] = useState(recommendedThemeId)
  const [idx, setIdx] = useState(0)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)
  const refs = useRef<Array<HTMLDivElement | null>>([])
  const touchX = useRef<number | null>(null)

  const theme = getTheme(themeId)
  const defs = useMemo(
    () => buildStatCards(analysis, personality, username, year),
    [analysis, personality, username, year],
  )
  const itemCount = defs.length + 1 // stat cards + the all-in-one poster
  const cardIndex = Math.min(idx, itemCount - 1)
  const isPoster = cardIndex === defs.length

  const next = () => setIdx((i) => Math.min(i + 1, itemCount - 1))
  const prev = () => setIdx((i) => Math.max(i - 1, 0))

  const capture = async (i: number): Promise<Blob> => {
    const node = refs.current[i]
    if (!node) throw new Error('card not rendered')
    const dataUrl = await toPng(node, { pixelRatio: 1080 / node.offsetWidth })
    return (await fetch(dataUrl)).blob()
  }

  const filename = (i: number) =>
    `devwrapped-${i < defs.length ? defs[i].label.replace(/\s+/g, '-').toLowerCase() : 'all-in-one'}-${username}.png`

  const download = async () => {
    if (busy) return
    setBusy(true)
    try {
      const node = refs.current[cardIndex]
      if (!node) return
      const dataUrl = await toPng(node, { pixelRatio: 1080 / node.offsetWidth })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = filename(cardIndex)
      a.click()
    } finally {
      setBusy(false)
    }
  }

  const copyImage = async () => {
    try {
      const blob = await capture(cardIndex)
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setCopied(true)
    } catch {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
    }
    setTimeout(() => setCopied(false), 2000)
  }

  const share = async () => {
    try {
      const blob = await capture(cardIndex)
      const file = new File([blob], filename(cardIndex), { type: 'image/png' })
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `${username}'s DevWrapped ${year}` })
        return
      }
    } catch (e) {
      if ((e as Error)?.name === 'AbortError') return
    }
    await copyImage()
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (dx < -48) next()
    else if (dx > 48) prev()
    touchX.current = null
  }

  return (
    <div
      className="flex w-full flex-col items-center gap-5 lg:flex-row lg:items-start lg:justify-center lg:gap-8"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex w-full flex-col items-center gap-4">
      <AnimatePresence mode="wait">
        {isPoster ? (
          <motion.div
            key="poster-badge"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 rounded-full border border-highlight/50 bg-highlight/10 px-4 py-1.5 text-xs font-semibold text-highlight"
          >
            <Sparkles className="h-3.5 w-3.5" />
            the all-in-one · your whole year in one image
          </motion.div>
        ) : (
          <motion.p
            key="swipe-hint"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-1.5 text-xs text-slate-500"
          >
            swipe or use arrows — the all-in-one poster is at the end
            <ArrowRight className="h-3 w-3" />
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex w-full items-center justify-center gap-2 sm:gap-5">
        <button
          onClick={prev}
          disabled={cardIndex === 0}
          aria-label="Previous card"
          className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:text-white disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="w-full max-w-[380px]" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <AnimatePresence mode="wait">
            <motion.div
              key={cardIndex}
              initial={{ opacity: 0, x: 42, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -42, scale: 0.98 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="flex justify-center"
            >
              {isPoster ? (
                <div className="relative">
                  <motion.div
                    className="pointer-events-none absolute -inset-1.5 rounded-[28px] bg-gradient-to-r from-primary via-accent to-highlight opacity-40 blur-md"
                    animate={{ opacity: [0.25, 0.6, 0.25] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                  />
                  <WrappedPoster
                    ref={(el) => {
                      refs.current[cardIndex] = el
                    }}
                    analysis={analysis}
                    personality={personality}
                    username={username}
                    year={year}
                    avatarUrl={avatarUrl}
                    theme={theme}
                  />
                </div>
              ) : (
                <ShareCard
                  ref={(el) => {
                    refs.current[cardIndex] = el
                  }}
                  theme={theme}
                  {...defs[cardIndex]}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={next}
          disabled={cardIndex === itemCount - 1}
          aria-label="Next card"
          className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:text-white disabled:opacity-30"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        {Array.from({ length: itemCount }).map((_, i) => {
          const isLast = i === itemCount - 1
          const active = i === cardIndex
          if (isLast) {
            return (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label="Show the all-in-one poster"
                className={`flex h-5 w-5 items-center justify-center rounded-full transition ${
                  active ? 'bg-highlight text-night' : 'bg-highlight/40 text-highlight hover:bg-highlight/70'
                }`}
              >
                <Sparkles className="h-3 w-3" />
              </button>
            )
          }
          return (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Show card ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                active ? 'w-6 bg-primary' : 'w-1.5 bg-white/20 hover:bg-white/40'
              }`}
            />
          )
        })}
      </div>

      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
        {String(cardIndex + 1).padStart(2, '0')} / {String(itemCount).padStart(2, '0')}
        {isPoster ? ' · the finale' : ''}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={download}
          disabled={busy}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(99,102,241,0.4)] transition hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] disabled:opacity-60"
        >
          <Download className="h-4 w-4" />
          {busy ? 'Rendering…' : 'Download'}
        </button>
        <button
          onClick={copyImage}
          className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10"
        >
          {copied ? <Check className="h-4 w-4 text-mint" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied' : 'Copy image'}
        </button>
        <button
          onClick={share}
          className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </div>
      </div>

      <aside className="w-full max-w-[420px] lg:w-auto lg:max-w-none lg:pt-6">
        <ThemePicker themeId={themeId} onSelect={setThemeId} />
        {personality && (
          <div className="mt-3 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-center text-[10px] text-slate-500 lg:text-left">
            <span className="font-medium text-slate-400">{getTheme(recommendedThemeId).emoji} Recommended</span> for your archetype —{' '}
            <span className="text-slate-300">{personality.archetype.name}</span>
          </div>
        )}
      </aside>
    </div>
  )
}
