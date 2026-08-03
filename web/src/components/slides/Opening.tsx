import { motion } from 'framer-motion'

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

export default function Opening({ username, year, avatarUrl }: Props) {
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center px-6 text-center">
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
        className="mt-6 text-[11px] font-medium uppercase tracking-[0.4em] text-slate-400 sm:text-xs"
      >
        {username}'s DevWrapped
      </motion.p>
      <motion.h1
        {...fadeUp(0.45)}
        className="mt-3 max-w-2xl font-display text-4xl font-extrabold leading-tight text-white sm:text-6xl"
      >
        Your {year} <span className="bg-gradient-to-r from-primary via-accent to-highlight bg-clip-text text-transparent">in code</span>
      </motion.h1>
      <motion.p {...fadeUp(0.7)} className="mt-6 font-mono text-xs text-slate-500 sm:text-sm">
        ▸ press → to begin
      </motion.p>
    </div>
  )
}
