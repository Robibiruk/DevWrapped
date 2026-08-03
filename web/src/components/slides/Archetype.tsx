import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import type { Personality, Tone } from '../../lib/personality'
import { useDeck } from '../../store/deck'

const TONES: Array<{ id: Tone; label: string }> = [
  { id: 'friendly', label: 'Friendly' },
  { id: 'honest', label: 'Honest' },
  { id: 'brutal', label: 'Brutal' },
]

export default function Archetype({ personality }: { personality: Personality }) {
  const tone = useDeck((s) => s.tone)
  const setTone = useDeck((s) => s.setTone)
  const { archetype, headline, description, highlights } = personality

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-6 px-6 pb-16">
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[11px] uppercase tracking-[0.35em] text-slate-400"
        >
          your developer profile
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-2 font-display text-2xl font-extrabold text-white sm:text-4xl"
        >
          This year, you were…
        </motion.h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md sm:p-8"
      >
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.35 }}
            className="text-5xl"
          >
            {archetype.emoji}
          </motion.div>
          <div>
            <h3 className="font-display text-2xl font-extrabold text-white sm:text-3xl">{headline}</h3>
            <p className="text-sm font-medium text-highlight">{archetype.tagline}</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">{description}</p>
        {highlights.length > 0 && (
          <ul className="mt-5 space-y-2.5 border-t border-white/10 pt-5">
            {highlights.map((h, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.15 }}
                className="flex items-start gap-2 text-sm text-slate-300"
              >
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-highlight" />
                <span>{h}</span>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>

      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        {TONES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTone(t.id)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
              tone === t.id
                ? 'border-primary/60 bg-primary/20 text-white'
                : 'border-white/10 bg-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}
