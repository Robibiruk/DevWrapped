import { THEMES } from '../../lib/themes'

interface Props {
  themeId: string
  onSelect: (id: string) => void
}

export default function ThemePicker({ themeId, onSelect }: Props) {
  return (
    <div className="w-full">
      <p className="mb-2 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500 md:text-left">
        choose a theme
      </p>
      <div className="flex flex-wrap items-center justify-center gap-1.5 md:flex-col md:items-start">
        {THEMES.map((t) => {
          const active = t.id === themeId
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              title={t.name}
              aria-label={t.name}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-medium transition sm:px-3 ${
                active
                  ? 'border-primary/60 bg-primary/20 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-sm">{t.emoji}</span>
              <span className="hidden sm:inline">{t.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
