import { motion } from 'framer-motion'
import type { Analysis, LanguageShare } from '../../lib/analysis'
import { useCountUp } from '../ui/useCountUp'

const BAR_COLORS = [
  'from-indigo-500 to-violet-500',
  'from-violet-500 to-fuchsia-500',
  'from-amber-500 to-orange-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-red-500',
  'from-sky-500 to-blue-500',
  'from-pink-500 to-rose-500',
  'from-teal-500 to-cyan-500',
]

function Bar({ lang, index }: { lang: LanguageShare; index: number }) {
  const pct = useCountUp(lang.percent, 1.4, 0.35 + index * 0.15)
  return (
    <motion.div
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.1, ease: 'easeOut' }}
    >
      <div className="flex items-baseline justify-between font-mono text-xs text-slate-300 sm:text-sm">
        <span className="truncate pr-3">{lang.name}</span>
        <span className="tabular-nums text-slate-400">{pct.toFixed(0)}%</span>
      </div>
      <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${BAR_COLORS[index % BAR_COLORS.length]}`}
          initial={{ width: 0 }}
          animate={{ width: `${lang.percent}%` }}
          transition={{ duration: 1.1, delay: 0.4 + index * 0.12, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  )
}

export default function TechDna({ analysis }: { analysis: Analysis }) {
  const langs = analysis.languages
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-8 px-6">
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[11px] uppercase tracking-[0.35em] text-slate-400"
        >
          your coding dna
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-2 font-display text-3xl font-extrabold text-white sm:text-5xl"
        >
          Your <span className="text-primary">Tech DNA</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-2 text-xs text-slate-400 sm:text-sm"
        >
          Dominant trait: <span className="font-semibold text-highlight">{analysis.topLanguage}</span>
        </motion.p>
      </div>
      <div className="w-full max-w-xl space-y-4">
        {langs.length > 0 ? (
          langs.map((l, i) => <Bar key={l.name} lang={l} index={i} />)
        ) : (
          <p className="text-center text-sm text-slate-500">No language data detected.</p>
        )}
      </div>
    </div>
  )
}
