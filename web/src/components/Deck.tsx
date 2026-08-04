import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useDeck } from '../store/deck'
import { requestDeviceOrientationPermission } from '../lib/tilt'
import type { useStory } from '../hooks/useWrapped'
import Opening from './slides/Opening'
import Numbers from './slides/Numbers'
import TechDna from './slides/TechDna'
import CommitPsychology from './slides/CommitPsychology'
import ProjectGraveyard from './slides/ProjectGraveyard'
import PeakMoment from './slides/PeakMoment'
import NightOwl from './slides/NightOwl'
import HallOfFame from './slides/HallOfFame'
import Archetype from './slides/Archetype'
import Finale from './slides/Finale'

type Story = ReturnType<typeof useStory>

const variants = {
  enter: { opacity: 0, scale: 1.03 },
  center: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.97 },
}

// Auto-advance durations per slide index (ms). null = no auto-advance.
const SLIDE_DURATIONS: (number | null)[] = [
  null, // Opening — waits for user to press →
  5000, // Numbers
  5000, // TechDNA
  5000, // CommitPsychology
  5000, // ProjectGraveyard
  5000, // PeakMoment
  5000, // NightOwl
  5000, // HallOfFame
  6000, // Archetype
  null, // Finale — user-driven
]

export default function Deck({ story, username }: { story: Story; username: string }) {
  const slideIndex = useDeck((s) => s.slideIndex)
  const goTo = useDeck((s) => s.goTo)
  const year = story.data?.year ?? new Date().getFullYear()

  // ── Slide definitions ──────────────────────────────────────────────
  const slides = [
    <Opening key="opening" username={username} year={year} avatarUrl={story.data?.profile.avatarUrl ?? `https://github.com/identicons/${username}.png`} />,
    <Numbers key="numbers" analysis={story.analysis!} year={year} />,
    <TechDna key="techdna" analysis={story.analysis!} />,
    <CommitPsychology key="psychology" analysis={story.analysis!} />,
    <ProjectGraveyard key="graveyard" analysis={story.analysis!} repos={story.data?.repos ?? []} />,
    <PeakMoment key="peak" analysis={story.analysis!} />,
    <NightOwl key="nightowl" analysis={story.analysis!} />,
    <HallOfFame key="hall" analysis={story.analysis!} />,
    <Archetype key="archetype" personality={story.personality!} />,
    <Finale
      key="finale"
      analysis={story.analysis!}
      personality={story.personality!}
      username={username}
      year={year}
      avatarUrl={story.data?.profile.avatarUrl ?? `https://github.com/identicons/${username}.png`}
    />,
  ]

  const count = slides.length
  const safeIndex = Math.min(slideIndex, count - 1)

  const advance = useCallback(() => {
    if (safeIndex < count - 1) goTo(safeIndex + 1)
    // First advance is a user gesture — pre-grant orientation permission
    // so the ShareStudio cards have tilt ready when they mount.
    requestDeviceOrientationPermission()
  }, [safeIndex, count, goTo])

  const retreat = useCallback(() => {
    if (safeIndex > 0) goTo(safeIndex - 1)
  }, [safeIndex, goTo])

  // ── Auto-advance + progress ──────────────────────────────────────
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const [uiHidden, setUiHidden] = useState(false)
  const remainingRef = useRef<number>(0)
  const prevSlideRef = useRef(safeIndex)
  const timerRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  // Hold detection for hide-UI
  const holdTimerRef = useRef<number | null>(null)
  // Touch swipe tracking
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  const handlePointerDown = useCallback(() => {
    holdTimerRef.current = window.setTimeout(() => setUiHidden(true), 500)
  }, [])

  const handlePointerUp = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }
    setPaused(false)
    setUiHidden(false)
  }, [])

  useEffect(() => {
    // Reset remaining on slide change
    if (prevSlideRef.current !== safeIndex) {
      remainingRef.current = 0
      prevSlideRef.current = safeIndex
    }

    // Cancel previous timers
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }

    // Don't auto-advance while paused, UI hidden, or on last slide
    if (paused || uiHidden || safeIndex >= count - 1) return

    const duration = SLIDE_DURATIONS[safeIndex]
    if (!duration) return

    const remaining = remainingRef.current || duration
    const startTime = performance.now()

    // Schedule advance (extra 300ms for transition settle)
    timerRef.current = window.setTimeout(advance, remaining + 300)

    // Progress animation
    const tick = (now: number) => {
      const elapsed = now - startTime
      const p = Math.min(elapsed / remaining, 1)
      setProgress(p)
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
      const elapsed = performance.now() - startTime
      remainingRef.current = Math.max(0, remaining - elapsed)
    }
  }, [safeIndex, paused, uiHidden, count, advance])

  // Reset remaining when the slide changes manually (via goTo)
  useEffect(() => {
    if (prevSlideRef.current !== safeIndex) {
      remainingRef.current = 0
      prevSlideRef.current = safeIndex
    }
  }, [safeIndex])

  // ── Keyboard controls ────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); advance() }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); retreat() }
      else if (e.key === ' ') { e.preventDefault(); setPaused((p) => !p) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [advance, retreat])

  // ── Touch swipe (horizontal = navigate, vertical = let scroll) ────
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0]
    touchStartRef.current = { x: t.clientX, y: t.clientY }
  }, [])

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current) return
      const t = e.changedTouches[0]
      const dx = t.clientX - touchStartRef.current.x
      const dy = t.clientY - touchStartRef.current.y
      touchStartRef.current = null
      // Only count as a swipe if horizontal movement dominates
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx < 0) advance()
        else retreat()
      }
    },
    [advance, retreat],
  )

  // ── Tap zones (right = advance, left = retreat) ──────────────────
  const onCanvasTap = useCallback(
    (e: React.MouseEvent) => {
      if (uiHidden) { setUiHidden(false); return }
      if (e.clientX > window.innerWidth / 2) advance()
      else retreat()
    },
    [advance, retreat, uiHidden],
  )

  if (story.isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 bg-night">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-primary" />
        <p className="font-mono text-sm text-slate-400">
          crunching <span className="text-primary">{username}</span>'s year…
        </p>
      </div>
    )
  }

  if (story.isError || !story.analysis) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-night px-6 text-center">
        <p className="font-display text-2xl text-white">Couldn't load that profile.</p>
        <p className="max-w-md text-sm text-slate-400">
          {story.error?.message ?? 'Something went wrong. Check the username and try again.'}
        </p>
        <Link
          to="/"
          className="rounded-full bg-gradient-to-r from-primary to-accent px-6 py-2.5 text-sm font-semibold text-white"
        >
          Try again
        </Link>
      </div>
    )
  }

  const uiOpacity = uiHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'

  return (
    <div
      className="fixed inset-0 overflow-y-auto overflow-x-hidden bg-night text-slate-100"
      onClick={onCanvasTap}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
      </div>

      {/* Header + Progress Bar (sticky, fades out when UI hidden) */}
      <div
        className={`sticky top-0 z-20 border-b border-white/5 bg-night/85 backdrop-blur transition-opacity duration-300 ${uiOpacity}`}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Progress segments */}
        <div className="flex gap-[2px] px-4 pt-2.5">
          {slides.map((_, i) => {
            const completed = i < safeIndex
            const active = i === safeIndex
            return (
              <div key={i} className="relative flex-1 h-[3px] rounded-full bg-white/10">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-primary"
                  style={{
                    width: completed ? '100%' : active ? `${progress * 100}%` : '0%',
                    transition: active ? 'none' : 'width 0.2s ease',
                  }}
                />
              </div>
            )
          })}
        </div>

        {/* Header row */}
        <div className="flex items-center justify-between gap-3 px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-3">
            <Link to="/" className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:text-white">
              <Home className="h-4 w-4" />
            </Link>
            <span className="truncate font-mono text-xs text-slate-500">devwrapped.</span>
          </div>
          <span className="shrink-0 font-mono text-xs text-slate-500">
            {String(safeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Slide content */}
      <div className="relative z-10 min-h-full w-full pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={safeIndex}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="min-h-full w-full"
          >
            {slides[safeIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows (desktop) */}
      <div className={`transition-opacity duration-300 ${uiOpacity}`}>
        {safeIndex > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); retreat() }}
            className="fixed left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:text-white"
            aria-label="Previous slide"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        {safeIndex < count - 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); advance() }}
            className="fixed right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:text-white"
            aria-label="Next slide"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
