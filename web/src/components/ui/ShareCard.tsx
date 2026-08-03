import type { ReactNode, Ref } from 'react'
import { Code } from 'lucide-react'
import type { Theme } from '../../lib/themes'
import { useTilt } from '../../lib/tilt'
import CardEffects from './CardEffects'

export interface ShareCardProps {
  theme: Theme
  icon: ReactNode
  label: string
  value: string
  sub?: string
  username: string
  year: number
  ref?: Ref<HTMLDivElement>
}

export type StatCardDef = Omit<ShareCardProps, 'theme' | 'ref'>

export default function ShareCard({ theme, icon, label, value, sub, username, year, ref }: ShareCardProps) {
  const { wrapRef, shellRef, vars, glowStyle, shineStyle, glareStyle } = useTilt(theme)
  const valueFont = theme.mono ? 'font-mono' : 'font-display'

  const mergeWrapRef = (el: HTMLDivElement | null) => {
    wrapRef.current = el
    if (typeof ref === 'function') ref(el)
    else if (ref) (ref as { current: HTMLDivElement | null }).current = el
  }

  const setShellRef = (el: HTMLDivElement | null) => {
    shellRef.current = el
  }

  return (
    <div
      ref={mergeWrapRef}
      className="relative w-full max-w-[380px]"
      style={{ perspective: '600px', transform: 'translate3d(0, 0, 0)', ...vars }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-200 ease-out"
        style={glowStyle}
      />
      <div
        ref={setShellRef}
        className={`relative aspect-[4/5] w-full overflow-hidden rounded-[28px] p-7 ${theme.card}`}
        style={{
          transform: 'translateZ(0) rotateX(var(--rotate-y)) rotateY(var(--rotate-x))',
          boxShadow:
            'rgba(0,0,0,0.8) calc((var(--pointer-from-left) * 10px) - 3px) calc((var(--pointer-from-top) * 20px) - 6px) 20px -5px',
        }}
      >
        <CardEffects theme={theme} shineStyle={shineStyle} glareStyle={glareStyle} />

        <div
          className="relative z-[2] flex h-full flex-col justify-between"
          style={{
            transform:
              'translate3d(calc(var(--pointer-from-left) * -6px + 3px), calc(var(--pointer-from-top) * -6px + 3px), 0.1px)',
          }}
        >
          <div className="flex items-center justify-between">
            <span className={`font-mono text-xs font-medium ${theme.muted}`}>@{username}</span>
            <span className={`rounded-full px-2.5 py-0.5 font-mono text-xs font-semibold ${theme.chip}`}>{year}</span>
          </div>

          <div>
            <div className={`flex items-center gap-2 ${theme.accent}`}>
              {icon}
              <span
                className={`font-mono text-[11px] uppercase tracking-[0.28em] ${theme.mono ? theme.accent : theme.muted}`}
              >
                {label}
              </span>
            </div>
            <p className={`mt-3 break-words text-5xl font-extrabold leading-none drop-shadow-sm ${valueFont} ${theme.value}`}>
              {value}
            </p>
            {sub && <p className={`mt-3 text-sm font-medium ${theme.muted}`}>{sub}</p>}
          </div>

          <div className={`flex items-center justify-between ${theme.muted}`}>
            <span className="font-mono text-[10px] uppercase tracking-[0.32em]">devwrapped</span>
            <span className={`flex h-7 w-7 items-center justify-center rounded-full ${theme.chip}`}>
              <Code className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
