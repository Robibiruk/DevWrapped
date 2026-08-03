import { animate } from 'framer-motion'
import { useEffect, useState } from 'react'

export function useCountUp(target: number, duration = 1.4, delay = 0): number {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const controls: { current: ReturnType<typeof animate> | null } = { current: null }
    const t = setTimeout(() => {
      controls.current = animate(0, target, {
        duration,
        ease: 'easeOut',
        onUpdate: (v) => setValue(Math.round(v)),
      })
    }, delay * 1000)
    return () => {
      clearTimeout(t)
      controls.current?.stop()
    }
  }, [target, duration, delay])
  return value
}
