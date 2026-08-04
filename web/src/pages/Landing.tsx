import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Search, Sparkles } from 'lucide-react'

const USERNAME_RE = /^[a-zA-Z0-9-]{1,39}$/

export default function Landing() {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const u = value.trim()
    if (!USERNAME_RE.test(u)) {
      setError('Enter a valid GitHub username — letters, numbers, and dashes.')
      return
    }
    setError(null)
    navigate(`/wrapped/${u}`)
  }

  return (
    <div className="fixed inset-0 overflow-y-auto overflow-x-hidden bg-night text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-highlight/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-slate-400">
            devwrapped · {new Date().getFullYear()}
          </p>
          <h1 className="mt-4 font-display text-5xl font-extrabold leading-tight sm:text-7xl">
            Your{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-highlight bg-clip-text text-transparent">
              Year in Code.
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-slate-400 sm:text-base">
            Turn your GitHub profile into a cinematic, shareable story — commit psychology, tech DNA, and your
            developer archetype.
          </p>
        </motion.div>

        <motion.form
          onSubmit={submit}
          className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="github username"
              className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-12 pr-4 font-mono text-sm text-white outline-none placeholder:text-slate-500 focus:border-primary/60"
            />
          </div>
          <button
            type="submit"
            className="group flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(99,102,241,0.4)] transition hover:shadow-[0_0_40px_rgba(99,102,241,0.6)]"
          >
            Wrap me
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </button>
        </motion.form>

        {error && <p className="mt-3 text-sm text-alert">{error}</p>}

        <motion.p
          className="mt-8 flex items-center gap-1.5 text-xs text-slate-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <Sparkles className="h-3.5 w-3.5 text-highlight" />
          Built on public GitHub data. Nothing is stored.
        </motion.p>
      </div>
    </div>
  )
}
