import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { GitCommitHorizontal, FolderGit2, Star, Users, GitPullRequest, CircleDot } from 'lucide-react'
import type { Analysis } from '../../lib/analysis'
import { useCountUp } from '../ui/useCountUp'

interface Props {
  analysis: Analysis
  year: number
}

function Stat({
  icon,
  label,
  target,
  format,
  delay,
}: {
  icon: ReactNode
  label: string
  target: number
  format: (n: number) => string
  delay: number
}) {
  const value = useCountUp(target, 1.6, delay)
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className="flex flex-col items-center gap-1 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-5 backdrop-blur-sm sm:px-6"
    >
      <span className="text-primary">{icon}</span>
      <span className="font-mono text-3xl font-bold text-white tabular-nums sm:text-4xl">{format(value)}</span>
      <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{label}</span>
    </motion.div>
  )
}

export default function Numbers({ analysis, year }: Props) {
  const stats = [
    { icon: <GitCommitHorizontal className="h-5 w-5" />, label: 'commits', target: analysis.totalCommits },
    { icon: <FolderGit2 className="h-5 w-5" />, label: 'repos', target: analysis.reposCreated },
    { icon: <Star className="h-5 w-5" />, label: 'stars', target: analysis.totalStars },
    { icon: <Users className="h-5 w-5" />, label: 'followers', target: analysis.followers },
    { icon: <GitPullRequest className="h-5 w-5" />, label: 'pull requests', target: analysis.pulls },
    { icon: <CircleDot className="h-5 w-5" />, label: 'issues', target: analysis.issues },
  ]
  const fmt = (n: number) => n.toLocaleString()

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-8 px-6">
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[11px] uppercase tracking-[0.35em] text-slate-400"
        >
          {year} — by the numbers
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-2 font-display text-3xl font-extrabold text-white sm:text-5xl"
        >
          Your Year in <span className="text-accent">Numbers</span>
        </motion.h2>
      </div>
      <div className="grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {stats.map((s, i) => (
          <Stat key={s.label} icon={s.icon} label={s.label} target={s.target} format={fmt} delay={0.2 + i * 0.12} />
        ))}
      </div>
    </div>
  )
}
