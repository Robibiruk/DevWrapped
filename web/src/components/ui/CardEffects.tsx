import type { CSSProperties } from 'react'
import { Decor, type Theme, type CardType } from '../../lib/themes'

interface Props {
  theme: Theme
  cardType?: CardType
  shineStyle: CSSProperties
  glareStyle: CSSProperties
}

export default function CardEffects({ theme, cardType, shineStyle, glareStyle }: Props) {
  const decorKind = (cardType && theme.cards[cardType]?.decor) || theme.decor

  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ backgroundImage: theme.tilt.innerGradient, mixBlendMode: 'color-dodge' }}
      />
      <div className="pointer-events-none absolute inset-0 z-[1]" style={shineStyle} />
      <div className="pointer-events-none absolute inset-0 z-[1]" style={glareStyle} />
      <Decor kind={decorKind} cardType={cardType} />

      <span
        className={`pointer-events-none absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 select-none font-mono text-6xl font-black leading-none opacity-[0.12] sm:text-7xl ${theme.accent}`}
        style={{ textShadow: `0 0 30px ${theme.tilt.glowColor}` }}
      >
        {'</>'}
      </span>
    </>
  )
}
