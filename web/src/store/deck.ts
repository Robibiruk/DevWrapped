import { create } from 'zustand'
import type { Tone } from '../lib/personality'

interface DeckState {
  slideIndex: number
  tone: Tone
  next: () => void
  prev: () => void
  goTo: (index: number) => void
  setTone: (tone: Tone) => void
  reset: () => void
}

export const useDeck = create<DeckState>((set) => ({
  slideIndex: 0,
  tone: 'friendly',
  next: () => set((s) => ({ slideIndex: s.slideIndex + 1 })),
  prev: () => set((s) => ({ slideIndex: Math.max(0, s.slideIndex - 1) })),
  goTo: (index) => set({ slideIndex: index }),
  setTone: (tone) => set({ tone }),
  reset: () => set({ slideIndex: 0 }),
}))
