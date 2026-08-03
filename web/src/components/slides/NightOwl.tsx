import { motion } from 'framer-motion'
import { Moon, Sun, Clock, CalendarDays } from 'lucide-react'
import type { Analysis } from '../../lib/analysis'
import StatChip from '../ui/StatChip'

export default function NightOwl({ analysis }: { analysis: Analysis }) {
  const latest = analysis.latestCommit
  const earliest = analysis.earliestCommit
  const weekendPct = `${Math.round(analysis.weekendRatio * 100)}%`

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-6 px-6 text-center">
      <div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[11px] uppercase tracking-[0.35em] text-slate-400"
        >
          when you code
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-2 font-display text-3xl font-extrabold text-white sm:text-5xl"
        >
          The <span className="text-accent">Night Owl</span>
        </motion.h2>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md"
      >
        {latest ? (
          <>
            <div className="flex items-center justify-center gap-2">
              <Moon className="h-5 w-5 text-highlight" />
              <span className="font-mono text-3xl font-bold text-white">{latest.hourLabel}</span>
            </div>
            <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-slate-500">your latest commit</p>
            <p className="mt-2 font-mono text-sm text-slate-300">“{latest.message}”</p>
          </>
        ) : (
          <p className="text-sm text-slate-500">No commit data to analyze.</p>
        )}
      </motion.div>

      <div className="grid w-full max-w-xl grid-cols-3 gap-3">
        <StatChip icon={<Sun className="h-5 w-5" />} label="first commit" value={earliest?.hourLabel ?? '—'} delay={0.35} />
        <StatChip
          icon={<Clock className="h-5 w-5" />}
          label="longest session"
          value={analysis.longestSessionHours !== null ? `${analysis.longestSessionHours}h` : '—'}
          delay={0.45}
        />
        <StatChip icon={<CalendarDays className="h-5 w-5" />} label="weekend coding" value={weekendPct} delay={0.55} />
      </div>
    </div>
  )
}
