import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, Pause, MoveHorizontal, Smartphone } from 'lucide-react'

interface Props {
  username: string
  year: number
  avatarUrl: string
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
})

function Gesture({ icon, text, delay }: { icon: ReactNode; text: string; delay: number }) {
  return (
    <motion.div
      {...fadeUp(delay)}
      className="flex items-center gap-2 text-[11px] text-slate-500 sm:text-xs"
    >
      <span className="text-slate-400">{icon}</span>
      <span>{text}</span>
    </motion.div>
  )
}

export default function Opening({ username, year, avatarUrl }: Props) {
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-6 px-6 text-center">
      <motion.img
        src={avatarUrl}
        alt=""
        className="h-20 w-20 rounded-full border border-white/10 object-cover shadow-[0_0_40px_rgba(99,102,241,0.45)] sm:h-28 sm:w-28"
        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      />
      <motion.p
        {...fadeUp(0.3)}
        className="text-[11px] font-medium uppercase tracking-[0.4em] text-slate-400 sm:text-xs"
      >
        {username}'s DevWrapped
      </motion.p>
      <motion.h1
        {...fadeUp(0.45)}
        className="w-full font-display text-3xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl"
      >
        Your {year} <span className="bg-gradient-to-r from-primary via-accent to-highlight bg-clip-text text-transparent">in code</span>
      </motion.h1>

      {/* CTA */}
      <motion.p {...fadeUp(0.7)} className="mt-1 font-mono text-sm text-primary sm:text-base">
        ▸ tap to begin
      </motion.p>

      {/* Gesture hints */}
      <motion.div {...fadeUp(0.9)} className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <Gesture icon={<ArrowRight className="h-3.5 w-3.5" />} text="Tap right → next" delay={0} />
        <Gesture icon={<ArrowLeft className="h-3.5 w-3.5" />} text="Tap left → back" delay={0.05} />
        <Gesture icon={<Pause className="h-3.5 w-3.5" />} text="Hold → pause" delay={0.1} />
        <Gesture icon={<MoveHorizontal className="h-3.5 w-3.5" />} text="Swipe → navigate" delay={0.15} />
        <Gesture icon={<Smartphone className="h-3.5 w-3.5" />} text="Tilt → move cards" delay={0.2} />
      </motion.div>
    </div>
  )
}
