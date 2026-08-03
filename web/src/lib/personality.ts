import type { Analysis } from './analysis'
import { formatHour } from './format'

export type Tone = 'friendly' | 'honest' | 'brutal'

export interface Archetype {
  id: string
  name: string
  emoji: string
  tagline: string
}

export interface Personality {
  archetype: Archetype
  headline: string
  description: string
  highlights: string[]
}

type ToneCopy = Record<Tone, { headline: string; description: string }>

const ARCHETYPES: Record<string, Archetype> = {
  explorer: {
    id: 'explorer',
    name: 'The Explorer',
    emoji: '🧭',
    tagline: 'Many stacks. Many repos. Always learning.',
  },
  specialist: {
    id: 'specialist',
    name: 'The Specialist',
    emoji: '🎯',
    tagline: 'One stack. Endless depth.',
  },
  finisher: {
    id: 'finisher',
    name: 'The Finisher',
    emoji: '🏁',
    tagline: 'You ship. Consistently.',
  },
  'night-owl': {
    id: 'night-owl',
    name: 'The Midnight Architect',
    emoji: '🦉',
    tagline: 'Your best code is written while the world sleeps.',
  },
  'weekend-warrior': {
    id: 'weekend-warrior',
    name: 'The Weekend Warrior',
    emoji: '🏄',
    tagline: 'Weekends are for shipping.',
  },
  fixer: {
    id: 'fixer',
    name: 'The Fixer',
    emoji: '🛠️',
    tagline: 'You live in the bug queue.',
  },
  starter: {
    id: 'starter',
    name: 'The Starter',
    emoji: '🌱',
    tagline: 'Every idea gets its shot.',
  },
}

const COPY: Record<string, ToneCopy> = {
  explorer: {
    friendly: {
      headline: 'You’re the Explorer.',
      description: 'You taste-tested more technologies this year than most people do in a decade. Curiosity is your real stack.',
    },
    honest: {
      headline: 'You’re the Explorer.',
      description: 'You shipped a lot of experiments this year. Some of them even work.',
    },
    brutal: {
      headline: 'You’re the Explorer.',
      description: 'You started enough projects to fill a museum. Future-you will handle the tours.',
    },
  },
  specialist: {
    friendly: {
      headline: 'You’re the Specialist.',
      description: 'You know your stack so well you could build it in your sleep. Depth over breadth, every time.',
    },
    honest: {
      headline: 'You’re the Specialist.',
      description: 'Deeply focused. Change scares you a little, and honestly, that’s working out.',
    },
    brutal: {
      headline: 'You’re the Specialist.',
      description: 'You’re so loyal to one language it’s practically a personality trait.',
    },
  },
  finisher: {
    friendly: {
      headline: 'You’re the Finisher.',
      description: 'You don’t just start things — you finish them. Rare, and beautiful.',
    },
    honest: {
      headline: 'You’re the Finisher.',
      description: 'Projects under your name tend to survive you. Genuinely impressive.',
    },
    brutal: {
      headline: 'You’re the Finisher.',
      description: 'You’re the exception to the “side projects die” rule. Show-off.',
    },
  },
  'night-owl': {
    friendly: {
      headline: 'You’re the Midnight Architect.',
      description: 'Most of your building happened between midnight and sunrise. The night is your co-founder.',
    },
    honest: {
      headline: 'You’re the Midnight Architect.',
      description: 'Your commit history looks like a sleep study gone wrong.',
    },
    brutal: {
      headline: 'You’re the Midnight Architect.',
      description: 'Your IDE works harder at 3AM than most people do at 3PM.',
    },
  },
  'weekend-warrior': {
    friendly: {
      headline: 'You’re the Weekend Warrior.',
      description: 'Your weekdays rest. Your weekends do the heavy lifting.',
    },
    honest: {
      headline: 'You’re the Weekend Warrior.',
      description: 'You outsourced your productive weekdays to … you, on weekends.',
    },
    brutal: {
      headline: 'You’re the Weekend Warrior.',
      description: 'You’re so productive on weekends your Monday self should be jealous.',
    },
  },
  fixer: {
    friendly: {
      headline: 'You’re the Fixer.',
      description: 'You didn’t just write code this year — you kept it alive.',
    },
    honest: {
      headline: 'You’re the Fixer.',
      description: 'You wrote the bug, then charged yourself double to fix it.',
    },
    brutal: {
      headline: 'You’re the Fixer.',
      description: 'You typed “fix” more times than a washing machine repairman.',
    },
  },
  starter: {
    friendly: {
      headline: 'You’re the Starter.',
      description: 'You have a gift for beginnings. Every idea gets its shot under your name.',
    },
    honest: {
      headline: 'You’re the Starter.',
      description: 'You start ideas faster than you finish them. There’s a method in there, probably.',
    },
    brutal: {
      headline: 'You’re the Starter.',
      description: 'You created a lot of projects and finished a few. The rest are enjoying retirement.',
    },
  },
}

const PRIORITY = ['explorer', 'specialist', 'finisher', 'night-owl', 'weekend-warrior', 'fixer', 'starter']

export function computePersonality(analysis: Analysis, tone: Tone): Personality {
  const scores = score(analysis)
  let bestId = PRIORITY[PRIORITY.length - 1]
  let best = -1
  for (const id of PRIORITY) {
    if (scores[id] > best) {
      best = scores[id]
      bestId = id
    }
  }

  const archetype = ARCHETYPES[bestId]
  const copy = COPY[bestId][tone]
  return {
    archetype,
    headline: copy.headline,
    description: copy.description,
    highlights: highlights(analysis, tone),
  }
}

function score(analysis: Analysis): Record<string, number> {
  const { languages, reposCreated, reposMaintained, nightRatio, weekendRatio, commitStats, abandonedRepos } = analysis
  const maintainedRatio = reposCreated ? reposMaintained / reposCreated : 0
  const topPct = languages[0]?.percent ?? 0
  const diversity = languages.filter((l) => l.percent >= 5).length

  return {
    explorer: diversity >= 3 ? diversity + Math.min(reposCreated, 20) / 10 : 0,
    specialist: topPct >= 60 ? 2 + topPct / 100 : 0,
    finisher: maintainedRatio >= 0.5 ? 2 + maintainedRatio : 0,
    'night-owl': nightRatio >= 0.22 ? 1 + nightRatio * 3 : 0,
    'weekend-warrior': weekendRatio >= 0.3 && nightRatio < 0.22 ? 1 + weekendRatio * 3 : 0,
    fixer: commitStats.fixCount >= 8 || commitStats.renameCount >= 4 ? 1 + Math.min(commitStats.fixCount, 50) / 50 : 0,
    starter: abandonedRepos >= 6 && maintainedRatio < 0.3 ? 2 + abandonedRepos / 20 : 0,
  }
}

function highlights(analysis: Analysis, tone: Tone): string[] {
  const s = analysis.commitStats
  const brutal = tone === 'brutal'
  const pct = (x: number) => `${Math.round(x)}%`

  const candidates: Array<{ weight: number; text: string }> = []

  if (s.fixCount >= 5) {
    candidates.push({
      weight: s.fixCount / 50,
      text: `You typed “fix” ${s.fixCount} times.${brutal ? ' Whatever was broken clearly stayed broken.' : ''}`,
    })
  }
  if (analysis.nightRatio >= 0.15) {
    candidates.push({
      weight: analysis.nightRatio,
      text: `${pct(analysis.nightRatio * 100)} of your commits happened after midnight.`,
    })
  }
  if (analysis.weekendRatio >= 0.25) {
    candidates.push({
      weight: analysis.weekendRatio,
      text: `${pct(analysis.weekendRatio * 100)} of your commits happened on weekends.`,
    })
  }
  if (s.oneWordPct >= 0.15) {
    candidates.push({
      weight: s.oneWordPct,
      text: `${pct(s.oneWordPct * 100)} of your commits were literally one word.`,
    })
  }
  if (s.renameCount >= 3) {
    candidates.push({
      weight: s.renameCount / 20,
      text: `You renamed something ${s.renameCount} times.${brutal ? ' Still couldn’t name it.' : ''}`,
    })
  }
  if (analysis.abandonedRepos >= 4) {
    candidates.push({
      weight: analysis.abandonedRepos / 25,
      text: `You created ${analysis.reposCreated} repos. ${analysis.reposMaintained} are still alive.${brutal ? ' The rest are enjoying retirement.' : ''}`,
    })
  }
  if (analysis.peakHour !== null) {
    candidates.push({
      weight: 0.3,
      text: `Your golden hour is ${formatHour(analysis.peakHour)}.`,
    })
  }

  return candidates
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map((c) => c.text)
}

