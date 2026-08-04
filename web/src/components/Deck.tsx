import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useDeck } from '../store/deck'
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

export default function Deck({ story, username }: { story: Story; username: string }) {
  const slideIndex = useDeck((s) => s.slideIndex)
  const goTo = useDeck((s) => s.goTo)
  const year = story.data?.year ?? new Date().getFullYear()

  const slides = [
    <Opening
      key="opening"
      username={username}
      year={year}
      avatarUrl={story.data?.profile.avatarUrl ?? `https://github.com/identicons/${username}.png`}
    />,
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
  const advance = () => {
    if (safeIndex < count - 1) goTo(safeIndex + 1)
  }
  const retreat = () => {
    if (safeIndex > 0) goTo(safeIndex - 1)
  }
  // Tap anywhere: right half advances, left half goes back. Scroll gestures
  // never fire click, so vertical touch scroll is unaffected.
  const onCanvasTap = (e: React.MouseEvent) => {
    if (e.clientX > window.innerWidth / 2) advance()
    else retreat()
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        advance()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        retreat()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeIndex, count])

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
        <p className="font-display text-2xl text-white">Couldn’t load that profile.</p>
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

  return (
    <div className="fixed inset-0 overflow-y-auto overflow-x-hidden bg-night text-slate-100" onClick={onCanvasTap}>
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div
        className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-white/5 bg-night/85 px-4 py-3 backdrop-blur"
        onClick={(e) => e.stopPropagation()}
      >
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

      {safeIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            retreat()
          }}
          className="fixed left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:text-white"
          aria-label="Previous slide"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      )}
      {safeIndex < count - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            advance()
          }}
          className="fixed right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:text-white"
          aria-label="Next slide"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      )}

      <div
        className="fixed bottom-0 left-0 right-0 z-20 flex justify-center gap-2 bg-gradient-to-t from-night via-night/90 to-transparent px-4 pb-4 pt-6"
        onClick={(e) => e.stopPropagation()}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === safeIndex ? 'w-6 bg-primary' : 'w-1.5 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
