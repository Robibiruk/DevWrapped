import { motion } from 'framer-motion'
import { FolderGit2, Clock } from 'lucide-react'
import type { Analysis } from '../../lib/analysis'
import { formatDate } from '../../lib/format'
import { useCountUp } from '../ui/useCountUp'
import StatChip from '../ui/StatChip'

export default function PeakMoment({ analysis }: { analysis: Analysis }) {
  const peak = analysis.peakMoment
  const count = useCountUp(peak?.count ?? 0, 1.8, 0.25)
  if (!peak) {
    return (
      <div className="flex min-h-full w-full items-center justify-center px-6 text-center text-slate-400">
        No standout peak day in the data yet.
      </div>
    )
  }

  const multiplier = analysis.avgDailyCommits > 0 ? Math.round(peak.count / analysis.avgDailyCommits) : null

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-5 px-6 text-center">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-[11px] uppercase tracking-[0.35em] text-slate-400"
      >
        your peak moment
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-xs uppercase tracking-[0.3em] text-slate-400"
      >
        {formatDate(peak.date)}
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        className="font-display text-7xl font-extrabold sm:text-8xl"
      >
        <span className="bg-gradient-to-r from-highlight to-alert bg-clip-text text-transparent tabular-nums">
          {count.toLocaleString()}
        </span>
      </motion.h2>
      <p className="-mt-2 text-sm text-slate-400">commits in a single day</p>
      {multiplier && multiplier > 1 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-slate-300"
        >
          {multiplier}× your daily average
        </motion.p>
      )}

      <div className="mt-2 flex gap-3">
        <StatChip icon={<FolderGit2 className="h-5 w-5" />} label="repos touched" value={`${peak.repos.length}`} delay={0.7} />
        <StatChip icon={<Clock className="h-5 w-5" />} label="hours in flow" value={`${peak.hoursActive}`} delay={0.8} />
      </div>
    </div>
  )
}
