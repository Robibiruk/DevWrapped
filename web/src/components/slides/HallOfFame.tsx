import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Star, GitCommitHorizontal, CalendarClock, TrendingUp } from 'lucide-react'
import type { Analysis } from '../../lib/analysis'

interface Props {
  analysis: Analysis
}

export default function HallOfFame({ analysis }: Props) {
  const cards: Array<{ icon: ReactNode; title: string; line: string; sub: string }> = []
  if (analysis.mostStarredRepo) {
    cards.push({
      icon: <Star className="h-5 w-5" />,
      title: 'Most starred',
      line: analysis.mostStarredRepo.name,
      sub: `★ ${analysis.mostStarredRepo.stars}`,
    })
  }
  if (analysis.mostActiveRepo !== '—') {
    cards.push({ icon: <GitCommitHorizontal className="h-5 w-5" />, title: 'Most active', line: analysis.mostActiveRepo, sub: 'your daily driver' })
  }
  if (analysis.longestRunningRepo) {
    cards.push({
      icon: <CalendarClock className="h-5 w-5" />,
      title: 'Longest running',
      line: analysis.longestRunningRepo.name,
      sub: `${analysis.longestRunningRepo.days} days and counting`,
    })
  }
  if (analysis.fastestGrowingRepo) {
    cards.push({
      icon: <TrendingUp className="h-5 w-5" />,
      title: 'Fastest growing',
      line: analysis.fastestGrowingRepo.name,
      sub: `★ ${analysis.fastestGrowingRepo.stars}`,
    })
  }

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-8 px-6">
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[11px] uppercase tracking-[0.35em] text-slate-400"
        >
          hall of fame
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-2 flex items-center justify-center gap-2 font-display text-3xl font-extrabold text-white sm:text-5xl"
        >
          <Trophy className="h-7 w-7 text-highlight sm:h-9 sm:w-9" />
          The <span className="text-highlight">Hall of Fame</span>
        </motion.h2>
      </div>

      <div className="grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
        {cards.length > 0 ? (
          cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.12, ease: 'easeOut' }}
              className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-4"
            >
              <span className="text-highlight">{c.icon}</span>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{c.title}</p>
                <p className="truncate font-semibold text-white">{c.line}</p>
                <p className="truncate text-xs text-slate-400">{c.sub}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="col-span-2 text-center text-sm text-slate-500">Not enough repo data for a hall of fame.</p>
        )}
      </div>
    </div>
  )
}
