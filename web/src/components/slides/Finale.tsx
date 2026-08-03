import { motion } from 'framer-motion'
import { Palette, RotateCcw } from 'lucide-react'
import type { Analysis } from '../../lib/analysis'
import type { Personality } from '../../lib/personality'
import { useDeck } from '../../store/deck'
import ShareStudio from '../ui/ShareStudio'

interface Props {
  analysis: Analysis
  personality: Personality
  username: string
  year: number
  avatarUrl: string
}

export default function Finale({ analysis, personality, username, year, avatarUrl }: Props) {
  const reset = useDeck((s) => s.reset)

  return (
    <div
      className="flex min-h-full w-full flex-col items-center justify-center gap-4 px-6 pb-16"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[11px] uppercase tracking-[0.35em] text-slate-400"
        >
          your year, made shareable
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl"
        >
          The share <span className="text-accent">studio</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="mx-auto mt-2 flex max-w-md flex-wrap items-center justify-center gap-1.5 text-sm text-slate-400"
        >
          <Palette className="h-3.5 w-3.5 text-slate-500" />
          6 stat cards, then a big all-in-one finale — pick a theme, download, share.
        </motion.p>
      </div>

      <ShareStudio
        analysis={analysis}
        personality={personality}
        username={username}
        year={year}
        avatarUrl={avatarUrl}
      />

      <div className="flex items-center gap-4">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="font-mono text-xs text-slate-500"
        >
          thanks for coding with github in {year} · @{username}
        </motion.p>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-white/10"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Replay
        </button>
      </div>
    </div>
  )
}
