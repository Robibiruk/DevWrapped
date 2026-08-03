import type { WrappedPayload } from '../types'

// Deterministic fixture so the deck can be developed and demoed without a network call.
const REPOS = [
  { name: 'devwrapped-web', lang: 'TypeScript', stars: 412, size: 3800 },
  { name: 'api-gateway', lang: 'Go', stars: 196, size: 2400 },
  { name: 'neural-experiments', lang: 'Python', stars: 88, size: 5600 },
  { name: 'cli-toolkit', lang: 'TypeScript', stars: 154, size: 1200 },
  { name: 'bot-framework', lang: 'TypeScript', stars: 267, size: 3100 },
  { name: 'rust-utils', lang: 'Rust', stars: 43, size: 900 },
  { name: 'data-viz', lang: 'TypeScript', stars: 71, size: 1500 },
  { name: 'scraper-service', lang: 'Python', stars: 22, size: 700 },
  { name: 'tauri-app', lang: 'Rust', stars: 95, size: 4400 },
  { name: 'go-microservice', lang: 'Go', stars: 58, size: 1800 },
  { name: 'chrome-extension', lang: 'TypeScript', stars: 33, size: 600 },
  { name: 'game-jam-2026', lang: 'C++', stars: 11, size: 2200 },
  { name: 'ai-pipelines', lang: 'Python', stars: 49, size: 3800 },
  { name: 'portfolio', lang: 'TypeScript', stars: 19, size: 800 },
  { name: 'dotfiles', lang: 'Shell', stars: 305, size: 100 },
  { name: 'prototype-x', lang: 'TypeScript', stars: 4, size: 500 },
  { name: 'learning-cpp', lang: 'C++', stars: 7, size: 1400 },
  { name: 'home-automation', lang: 'Python', stars: 61, size: 1200 },
  { name: 'workshop-notes', lang: 'Markdown', stars: 2, size: 300 },
  { name: 'abandoned-idea', lang: 'JavaScript', stars: 9, size: 900 },
  { name: 'website-redesign', lang: 'JavaScript', stars: 26, size: 2100 },
  { name: 'legacy-app', lang: 'JavaScript', stars: 13, size: 4700 },
]

const MESSAGES = [
  'fix: handle edge case in pagination',
  'wip',
  'please work',
  'add auth flow',
  'fix: typo in readme',
  'refactor service layer',
  'final-final-v2',
  'it works',
  'rename parser to lexer',
  'fix: null pointer on empty state',
  'add dark mode',
  'trying something',
  'fix',
  'fix: broken tests',
  'initial commit',
  'rename variables',
  'finish websocket handler',
  'fix: rate limit retry',
  'aaa',
  'migrate to v4',
  'fix: css on mobile',
  'add tests',
  'rename config to settings',
  'fix: memory leak',
  'update deps',
  'build: bump version',
  'fix: use correct timezone',
  'one more try',
  'rename endpoint',
  'fix: error boundary',
  'add analytics',
  'still broken',
  'remove dead code',
  'final',
  'fix: merge conflict',
  'quick patch',
  'improve perf',
  'rename module',
  'fix: import order',
  'good enough',
  'fix: flaky test',
  'shipping anyway',
  'redo layout',
  'fix: hydration error',
  'works now',
  'rename folder',
  'fix: log spam',
  'MVP ready?',
  'fix: image paths',
  'push and pray',
]

const NIGHT_HOURS = [1, 2, 3, 4, 23]

function hash(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}

function contributionFor(username: string, iso: string): number {
  const [, m, d] = iso.split('-').map(Number)
  const date = new Date(`${iso}T12:00:00Z`)
  const dow = date.getUTCDay()
  let c = hash(`${username}${iso}`) % 9
  if (m === 3 && d >= 3 && d <= 22) c = Math.max(c, 3 + ((hash(`${username}${iso}boost`) >> 3) % 7))
  if (m === 9 && d >= 5 && d <= 21) c = Math.max(c, 2 + ((hash(`${username}${iso}boost2`) >> 4) % 6))
  if (m === 9 && d === 14) c = 47
  if (dow === 0 || dow === 6) c += 2
  if (m === 7 && d >= 10 && d <= 17) c = 0
  return Math.max(0, Math.min(c, 60))
}

export function mockWrapped(username: string): WrappedPayload {
  const year = new Date().getUTCFullYear()
  const days = []
  for (let doy = 1; doy <= 366; doy++) {
    const date = new Date(Date.UTC(year, 0, 1))
    date.setUTCDate(date.getUTCDate() + doy - 1)
    if (date.getUTCFullYear() !== year) break
    const iso = date.toISOString().slice(0, 10)
    days.push({ date: iso, count: contributionFor(username, iso) })
  }

  const languages: Record<string, number> = {
    TypeScript: 428000,
    JavaScript: 214000,
    Rust: 143000,
    Go: 92000,
    Python: 84000,
    'C++': 41000,
    Shell: 22000,
    Markdown: 9000,
  }

  const commits: Array<{ repo: string; message: string; date: string | null }> = []
  const repos = [...REPOS].sort((a, b) => b.stars - a.stars).slice(0, 12)
  for (let i = 0; i < 150; i++) {
    const repo = repos[i % repos.length]
    const message = MESSAGES[i % MESSAGES.length]
    // Spread across the year, tilting toward night + weekends for personality flavor.
    const hour = i % 3 === 0 ? NIGHT_HOURS[i % NIGHT_HOURS.length] : 9 + (i % 12)
    const month = 1 + ((i * 7) % 12)
    const day = 1 + ((i * 13) % 28)
    const date = new Date(Date.UTC(year, month - 1, day, hour, 0, 0)).toISOString()
    commits.push({ repo: repo.name, message, date })
  }
  // Make sure the peak day (Sep 14) has sampled commits so Peak Moment shows repos + hours.
  const peakRepos = ['devwrapped-web', 'cli-toolkit', 'bot-framework']
  const peakHours = [1, 3, 5, 9, 12, 15, 18, 20, 23]
  peakHours.forEach((h, idx) => {
    commits.push({
      repo: peakRepos[idx % peakRepos.length],
      message: MESSAGES[(idx * 3) % MESSAGES.length],
      date: new Date(Date.UTC(year, 8, 14, h, 0, 0)).toISOString(),
    })
  })

  commits.sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''))

  const repoInfos = REPOS.map((r, i) => {
    const maintained = i % 4 !== 0 // roughly 3/4 still alive
    return {
      name: r.name,
      stars: r.stars,
      primaryLanguage: r.lang,
      pushedAt: maintained ? new Date(Date.UTC(year, 7, 1, 12, 0, 0)).toISOString() : new Date(Date.UTC(year, 0, 3, 12, 0, 0)).toISOString(),
      createdAt: new Date(Date.UTC(i % 4 === 3 ? 2026 : 2023 + (i % 3), 1 + (i % 6), 1 + (i % 20))).toISOString(),
      archived: !maintained,
      size: r.size,
    }
  })

  return {
    username,
    year,
    profile: {
      name: 'Robel',
      login: username,
      avatarUrl: `https://github.com/identicons/${username}.png`,
      followers: 1284,
      publicRepos: 26,
      createdAt: '2020-04-11T08:00:00Z',
    },
    repos: repoInfos,
    languages,
    contributions: { total: days.reduce((s, d) => s + d.count, 0), days },
    commits,
    events: { pulls: 87, issues: 43 },
    generatedAt: new Date().toISOString(),
  }
}
