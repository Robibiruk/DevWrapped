import { useCallback, useEffect, useMemo, useRef } from 'react'
import type { CSSProperties, RefObject } from 'react'
import type { Theme } from './themes'

const ANIMATION_CONFIG = {
  INITIAL_DURATION: 1200,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20,
  ENTER_TRANSITION_MS: 180,
} as const

const MOBILE_TILT_SENSITIVITY = 5

const clamp = (v: number, min = 0, max = 100): number => Math.min(Math.max(v, min), max)
const round = (v: number, precision = 3): number => parseFloat(v.toFixed(precision))
const adjust = (v: number, fMin: number, fMax: number, tMin: number, tMax: number): number =>
  round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin))

const KEYFRAMES_ID = 'pc-keyframes'
if (typeof document !== 'undefined' && !document.getElementById(KEYFRAMES_ID)) {
  const style = document.createElement('style')
  style.id = KEYFRAMES_ID
  style.textContent = `
    @keyframes pc-holo-bg {
      0% { background-position: 0 var(--background-y), 0 0, center; }
      100% { background-position: 0 var(--background-y), 90% 90%, center; }
    }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes iridescent { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
    @keyframes rise { 0% { transform: translateY(0) scale(1); opacity: 0.8; } 100% { transform: translateY(-120%) scale(0.4); opacity: 0; } }
    @keyframes float { 0% { transform: translateY(0) translateX(0); opacity: 0.7; } 50% { transform: translateY(-60%) translateX(5px); opacity: 0.5; } 100% { transform: translateY(-120%) translateX(-3px); opacity: 0; } }
    @keyframes lava { 0% { background-position: 0% 0%; } 50% { background-position: 100% 100%; } 100% { background-position: 0% 0%; } }
    @keyframes goldShimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    @keyframes petalDrift { 0% { transform: translateY(-10%) translateX(0) rotate(0deg); opacity: 0; } 10% { opacity: 0.8; } 100% { transform: translateY(110%) translateX(30px) rotate(180deg); opacity: 0; } }
    @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.15); opacity: 0.9; } }
  `
  document.head.appendChild(style)
}

export function sunpillarColors(hue: number, spread = 55): string[] {
  return [0, 1, 2, 3, 4, 5].map((i) => `hsl(${hue + (i - 2.5) * spread}, 100%, 72%)`)
}

interface TiltEngine {
  setImmediate: (x: number, y: number) => void
  setTarget: (x: number, y: number) => void
  toCenter: () => void
  beginInitial: (ms: number) => void
  getCurrent: () => { x: number; y: number; tx: number; ty: number }
  cancel: () => void
}

export interface TiltRefs {
  wrapRef: RefObject<HTMLDivElement | null>
  shellRef: RefObject<HTMLDivElement | null>
}

export function useTilt(theme: Theme): TiltRefs & {
  vars: CSSProperties
  glowStyle: CSSProperties
  shineStyle: CSSProperties
  glareStyle: CSSProperties
} {
  const wrapRef = useRef<HTMLDivElement>(null)
  const shellRef = useRef<HTMLDivElement>(null)
  const enterTimerRef = useRef<number | null>(null)
  const leaveRafRef = useRef<number | null>(null)
  const orientationAdded = useRef(false)

  const tiltEngine = useMemo<TiltEngine | null>(() => {
    let rafId: number | null = null
    let running = false
    let lastTs = 0
    let currentX = 0
    let currentY = 0
    let targetX = 0
    let targetY = 0
    const DEFAULT_TAU = 0.14
    const INITIAL_TAU = 0.6
    let initialUntil = 0

    const setVarsFromXY = (x: number, y: number): void => {
      const shell = shellRef.current
      const wrap = wrapRef.current
      if (!shell || !wrap) return
      const width = shell.clientWidth || 1
      const height = shell.clientHeight || 1
      const percentX = clamp((100 / width) * x)
      const percentY = clamp((100 / height) * y)
      const centerX = percentX - 50
      const centerY = percentY - 50
      const props: Record<string, string> = {
        '--pointer-x': `${percentX}%`,
        '--pointer-y': `${percentY}%`,
        '--background-x': `${adjust(percentX, 0, 100, 35, 65)}%`,
        '--background-y': `${adjust(percentY, 0, 100, 35, 65)}%`,
        '--pointer-from-center': `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
        '--pointer-from-top': `${percentY / 100}`,
        '--pointer-from-left': `${percentX / 100}`,
        '--rotate-x': `${round(-(centerX / 5))}deg`,
        '--rotate-y': `${round(centerY / 4)}deg`,
      }
      for (const [k, v] of Object.entries(props)) wrap.style.setProperty(k, v)
    }

    const step = (ts: number): void => {
      if (!running) return
      if (lastTs === 0) lastTs = ts
      const dt = (ts - lastTs) / 1000
      lastTs = ts
      const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU
      const k = 1 - Math.exp(-dt / tau)
      currentX += (targetX - currentX) * k
      currentY += (targetY - currentY) * k
      setVarsFromXY(currentX, currentY)
      const stillFar = Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05
      if (stillFar || document.hasFocus()) {
        rafId = requestAnimationFrame(step)
      } else {
        running = false
        lastTs = 0
        if (rafId) {
          cancelAnimationFrame(rafId)
          rafId = null
        }
      }
    }

    const start = (): void => {
      if (running) return
      running = true
      lastTs = 0
      rafId = requestAnimationFrame(step)
    }

    return {
      setImmediate(x: number, y: number): void {
        currentX = x
        currentY = y
        setVarsFromXY(currentX, currentY)
      },
      setTarget(x: number, y: number): void {
        targetX = x
        targetY = y
        start()
      },
      toCenter(): void {
        const shell = shellRef.current
        if (shell) this.setTarget(shell.clientWidth / 2, shell.clientHeight / 2)
      },
      beginInitial(ms: number): void {
        initialUntil = performance.now() + ms
        start()
      },
      getCurrent(): { x: number; y: number; tx: number; ty: number } {
        return { x: currentX, y: currentY, tx: targetX, ty: targetY }
      },
      cancel(): void {
        if (rafId) cancelAnimationFrame(rafId)
        rafId = null
        running = false
        lastTs = 0
      },
    }
  }, [])

  const getOffsets = (evt: PointerEvent, el: HTMLElement): { x: number; y: number } => {
    const rect = el.getBoundingClientRect()
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top }
  }

  const handlePointerMove = useCallback(
    (event: PointerEvent): void => {
      const shell = shellRef.current
      if (!shell || !tiltEngine) return
      const { x, y } = getOffsets(event, shell)
      tiltEngine.setTarget(x, y)
    },
    [tiltEngine],
  )

  const handlePointerEnter = useCallback(
    (event: PointerEvent): void => {
      if (event.pointerType !== 'mouse') return
      const shell = shellRef.current
      if (!shell || !tiltEngine) return
      shell.classList.add('active')
      shell.classList.add('entering')
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current)
      enterTimerRef.current = window.setTimeout(
        () => shell.classList.remove('entering'),
        ANIMATION_CONFIG.ENTER_TRANSITION_MS,
      )
      const { x, y } = getOffsets(event, shell)
      tiltEngine.setTarget(x, y)
    },
    [tiltEngine],
  )

  const handlePointerLeave = useCallback((): void => {
    const shell = shellRef.current
    if (!shell || !tiltEngine) return
    tiltEngine.toCenter()
    const checkSettle = (): void => {
      const { x, y, tx, ty } = tiltEngine.getCurrent()
      if (Math.hypot(tx - x, ty - y) < 0.6) {
        shell.classList.remove('active')
        leaveRafRef.current = null
      } else {
        leaveRafRef.current = requestAnimationFrame(checkSettle)
      }
    }
    if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current)
    leaveRafRef.current = requestAnimationFrame(checkSettle)
  }, [tiltEngine])

  const handleDeviceOrientation = useCallback(
    (event: DeviceOrientationEvent): void => {
      const shell = shellRef.current
      if (!shell || !tiltEngine) return
      const { beta, gamma } = event
      if (beta == null || gamma == null) return
      const centerX = shell.clientWidth / 2
      const centerY = shell.clientHeight / 2
      const x = clamp(centerX + gamma * MOBILE_TILT_SENSITIVITY, 0, shell.clientWidth)
      const y = clamp(
        centerY + (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * MOBILE_TILT_SENSITIVITY,
        0,
        shell.clientHeight,
      )
      tiltEngine.setTarget(x, y)
    },
    [tiltEngine],
  )

  useEffect(() => {
    if (!tiltEngine) return
    const shell = shellRef.current
    if (!shell) return
    const move = handlePointerMove as EventListener
    const enter = handlePointerEnter as EventListener
    const leave = handlePointerLeave as EventListener
    const orient = handleDeviceOrientation as EventListener
    shell.addEventListener('pointerenter', enter)
    shell.addEventListener('pointermove', move)
    shell.addEventListener('pointerleave', leave)

    // Mobile/small-device tilt via device orientation.
    // On Android / desktop secure contexts: listener works immediately, no user gesture needed.
    // On iOS Safari: requestPermission() requires a user gesture — calling it on mount
    // will likely fail silently; the click fallback retries in a proper gesture context.
    const enableOrientation = (): void => {
      if (!window.isSecureContext || orientationAdded.current) return
      const anyOri = window.DeviceOrientationEvent as typeof DeviceOrientationEvent & {
        requestPermission?: () => Promise<string>
      }
      if (anyOri && typeof anyOri.requestPermission === 'function') {
        anyOri
          .requestPermission()
          .then((state: string) => {
            if (state === 'granted') {
              window.addEventListener('deviceorientation', orient)
              orientationAdded.current = true
            }
          })
          .catch(() => {})
      } else {
        window.addEventListener('deviceorientation', orient)
        orientationAdded.current = true
      }
    }
    enableOrientation()
    shell.addEventListener('click', enableOrientation)

    const initialX = (shell.clientWidth || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET
    tiltEngine.setImmediate(initialX, ANIMATION_CONFIG.INITIAL_Y_OFFSET)
    tiltEngine.toCenter()
    tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION)

    return () => {
      shell.removeEventListener('pointerenter', enter)
      shell.removeEventListener('pointermove', move)
      shell.removeEventListener('pointerleave', leave)
      shell.removeEventListener('click', enableOrientation)
      window.removeEventListener('deviceorientation', orient)
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current)
      if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current)
      tiltEngine.cancel()
      shell.classList.remove('entering')
    }
  }, [tiltEngine, handlePointerMove, handlePointerEnter, handlePointerLeave, handleDeviceOrientation])

  const radius = '28px'
  const [s1, s2, s3, s4, s5, s6] = sunpillarColors(theme.tilt.hue)

  const vars = useMemo<CSSProperties>(
    () =>
      ({
        '--pointer-x': '50%',
        '--pointer-y': '50%',
        '--pointer-from-center': '0',
        '--pointer-from-top': '0.5',
        '--pointer-from-left': '0.5',
        '--rotate-x': '0deg',
        '--rotate-y': '0deg',
        '--background-x': '50%',
        '--background-y': '50%',
        '--card-radius': radius,
        '--sunpillar-1': s1,
        '--sunpillar-2': s2,
        '--sunpillar-3': s3,
        '--sunpillar-4': s4,
        '--sunpillar-5': s5,
        '--sunpillar-6': s6,
      }) as CSSProperties,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme],
  )

  const glowStyle: CSSProperties = {
    background: `radial-gradient(circle at var(--pointer-x) var(--pointer-y), ${theme.tilt.glowColor} 0%, transparent 55%)`,
    filter: 'blur(40px) saturate(1.1)',
    opacity: 'calc(0.3 + 0.7 * var(--pointer-from-center))',
  }

  const shineStyle: CSSProperties = {
    backgroundImage: `
      repeating-linear-gradient(0deg, var(--sunpillar-1) 5%, var(--sunpillar-2) 10%, var(--sunpillar-3) 15%, var(--sunpillar-4) 20%, var(--sunpillar-5) 25%, var(--sunpillar-6) 30%, var(--sunpillar-1) 35%),
      repeating-linear-gradient(-45deg, #0e152e 0%, hsl(180,10%,60%) 3.8%, hsl(180,29%,66%) 4.5%, hsl(180,10%,60%) 5.2%, #0e152e 10%, #0e152e 12%),
      radial-gradient(farthest-corner circle at var(--pointer-x) var(--pointer-y), hsla(0,0%,0%,0.1) 12%, hsla(0,0%,0%,0.15) 20%, hsla(0,0%,0%,0.25) 120%)
    `.replace(/\s+/g, ' '),
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    animation: 'pc-holo-bg 18s linear infinite',
    mixBlendMode: 'color-dodge',
    filter: 'brightness(0.66) contrast(1.33) saturate(0.33)',
    opacity: theme.tilt.shineOpacity,
    borderRadius: radius,
    pointerEvents: 'none',
  }

  const glareStyle: CSSProperties = {
    backgroundImage:
      'radial-gradient(farthest-corner circle at var(--pointer-x) var(--pointer-y), hsl(248,25%,80%) 12%, hsla(207,40%,30%,0.8) 90%)',
    mixBlendMode: 'overlay',
    filter: 'brightness(0.8) contrast(1.2)',
    borderRadius: radius,
    pointerEvents: 'none',
  }

  return {
    wrapRef,
    shellRef,
    vars,
    glowStyle,
    shineStyle,
    glareStyle,
  }
}
