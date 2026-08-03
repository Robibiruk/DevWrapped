import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Wrench, MessageSquare, RefreshCw, Flag } from 'lucide-react'
import type { Analysis } from '../../lib/analysis'

function Callout({
  icon,
  big,
  label,
  delay,
}: {
  icon: ReactNode
  big: string
  label: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 backdrop-blur-sm"
    >
      <span className="shrink-0 text-accent">{icon}</span>
      <div className="min-w-0">
        <p className="truncate font-mono text-lg font-bold text-white sm:text-xl">{big}</p>
        <p className="truncate text-xs text-slate-400">{label}</p>
      </div>
    </motion.div>
  )
}

export default function CommitPsychology({ analysis }: { analysis: Analysis }) {
  const s = analysis.commitStats
  const oneWord = `${Math.round(s.oneWordPct * 100)}%`
  const summary =
    s.fixCount >= 20
      ? 'Your repositories survived despite your commit messages.'
      : s.avgLength < 20
        ? 'Your commit messages are a lifestyle, not a style.'
        : 'Surprisingly disciplined.'

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-8 px-6">
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[11px] uppercase tracking-[0.35em] text-slate-400"
        >
          commit psychology
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-2 font-display text-3xl font-extrabold text-white sm:text-5xl"
        >
          What your <span className="text-accent">commits</span> say about you
        </motion.h2>
      </div>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        <Callout icon={<Wrench className="h-5 w-5" />} big={`${s.fixCount}× “fix”`} label="times you typed fix" delay={0.2} />
        <Callout icon={<MessageSquare className="h-5 w-5" />} big={oneWord} label="of commits were one word" delay={0.3} />
        <Callout icon={<RefreshCw className="h-5 w-5" />} big={`${s.renameCount}× rename`} label="times you renamed something" delay={0.4} />
        <Callout icon={<Flag className="h-5 w-5" />} big={`${s.finalCount}× “final”`} label="times you called it final" delay={0.5} />
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="max-w-md text-center text-sm text-slate-300 sm:text-base"
      >
        {summary}
      </motion.p>
    </div>
  )
}
