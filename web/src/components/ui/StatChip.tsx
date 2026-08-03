import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface Props {
  icon: ReactNode
  label: string
  value: string
  delay?: number
}

export default function StatChip({ icon, label, value, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className="flex flex-col items-center gap-1 rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-3"
    >
      <span className="text-primary">{icon}</span>
      <span className="font-mono text-xl font-bold text-white tabular-nums sm:text-2xl">{value}</span>
      <span className="text-[10px] uppercase tracking-[0.15em] text-slate-400">{label}</span>
    </motion.div>
  )
}
