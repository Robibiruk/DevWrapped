import { motion } from 'framer-motion'
import { Archive } from 'lucide-react'
import { isRepoAlive } from '../../lib/analysis'
import type { Analysis } from '../../lib/analysis'
import type { RepoInfo } from '../../types'

interface Props {
  analysis: Analysis
  repos: RepoInfo[]
}

export default function ProjectGraveyard({ analysis, repos }: Props) {
  const { reposCreated, reposMaintained, abandonedRepos } = analysis
  const epitaph =
    reposCreated > 0 && abandonedRepos / reposCreated >= 0.5
      ? 'You start ideas faster than you finish them.'
      : 'You actually finish what you start.'
  const shown = repos.slice(0, 16)

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-6 px-6">
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[11px] uppercase tracking-[0.35em] text-slate-400"
        >
          project graveyard
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-2 flex flex-wrap items-center justify-center gap-x-2 font-display text-2xl font-extrabold text-white sm:text-4xl"
        >
          <span>Created</span>
          <span className="text-primary">{reposCreated}</span>
          <span className="text-slate-500">·</span>
          <span>alive</span>
          <span className="text-mint">{reposMaintained}</span>
          <span className="text-slate-500">·</span>
          <span>resting</span>
          <span className="text-slate-500">{abandonedRepos}</span>
        </motion.h2>
      </div>

      <div className="flex max-w-2xl flex-wrap items-end justify-center gap-2.5 sm:gap-3">
        {shown.map((r, i) => {
          const alive = isRepoAlive(r.pushedAt)
          return (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 14, rotate: alive ? 0 : i % 2 ? 8 : -8 }}
              animate={{ opacity: alive ? 1 : 0.55, y: 0, rotate: alive ? 0 : i % 2 ? 5 : -5 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.05, ease: 'easeOut' }}
              className={`flex h-16 w-20 flex-col items-center justify-end rounded-t-xl border-t-4 sm:h-20 sm:w-24 ${
                alive
                  ? 'border-mint/40 bg-mint/10 shadow-[0_0_20px_rgba(34,197,94,0.12)]'
                  : 'border-white/15 bg-white/[0.03]'
              }`}
            >
              <span className="px-1 text-center font-mono text-[9px] leading-tight text-slate-400">
                {r.name.slice(0, 14)}
              </span>
              <span className={`mb-1.5 mt-1 text-sm ${alive ? 'text-mint' : 'text-slate-600'}`}>◆</span>
            </motion.div>
          )
        })}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="flex max-w-md items-center gap-2 text-center text-sm text-slate-300 sm:text-base"
      >
        <Archive className="h-4 w-4 shrink-0 text-slate-500" />
        {epitaph}
      </motion.p>
    </div>
  )
}
