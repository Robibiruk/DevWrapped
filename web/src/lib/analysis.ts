import type { WrappedPayload } from '../types'
import { formatHour } from './format'

export interface LanguageShare {
  name: string
  percent: number
}

export interface CommitStats {
  count: number
  avgLength: number
  oneWordPct: number
  fixCount: number
  renameCount: number
  finalCount: number
  commonWords: string[]
}

export interface Analysis {
  totalCommits: number
  reposCreated: number
  reposMaintained: number
  abandonedRepos: number
  totalStars: number
  followers: number
  pulls: number
  issues: number
  languages: LanguageShare[]
  languageCount: number
  topLanguage: string
  mostActiveRepo: string
  nightRatio: number
  weekendRatio: number
  longestStreak: number
  currentStreak: number
  peakDay: { date: string; count: number } | null
  peakHour: number | null
  avgDailyCommits: number
  peakMoment: { date: string; count: number; repos: string[]; hoursActive: number } | null
  latestCommit: { message: string; hourLabel: string } | null
  earliestCommit: { message: string; hourLabel: string } | null
  longestSessionHours: number | null
  mostStarredRepo: { name: string; stars: number } | null
  longestRunningRepo: { name: string; days: number } | null
  fastestGrowingRepo: { name: string; stars: number; days: number } | null
  aliveRepoNames: string[]
  commitStats: CommitStats
}

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'to', 'of', 'in', 'on', 'for', 'with', 'at',
  'from', 'by', 'as', 'is', 'it', 'this', 'that', 'my', 'our', 'your', 'update',
  'updates', 'updated', 'new', 'add', 'adds', 'adding', 'added', 'remove',
  'removes', 'remove', 'wip', 'change', 'changes', 'fix', 'fixes', 'fixed',
  'readme', 'init', 'initial', 'commit', 'first', 'make', 'make', 'test',
])

const DAY_MS = 24 * 60 * 60 * 1000

export function isRepoAlive(pushedAt: string | null, now = Date.now()): boolean {
  return !!pushedAt && now - new Date(pushedAt).getTime() < 60 * DAY_MS
}

export function analyze(payload: WrappedPayload): Analysis {
  const now = Date.now()

  const reposMaintained = payload.repos.filter((r) => isRepoAlive(r.pushedAt, now)).length

  const languageShares = computeLanguages(payload.languages)
  const totalStars = payload.repos.reduce((sum, r) => sum + r.stars, 0)

  const commits = payload.commits
  const hourOf = (iso: string | null) => (iso ? new Date(iso).getUTCHours() : null)
  const dayOf = (iso: string | null) => (iso ? new Date(iso).getUTCDay() : null)

  const withHour = commits.filter((c) => hourOf(c.date) !== null)
  const nightRatio = withHour.length
    ? withHour.filter((c) => {
        const h = hourOf(c.date)!
        return h >= 22 || h < 5
      }).length / withHour.length
    : 0
  const weekendRatio = withHour.length
    ? withHour.filter((c) => {
        const d = dayOf(c.date)!
        return d === 0 || d === 6
      }).length / withHour.length
    : 0

  const repoCounts = new Map<string, number>()
  for (const c of commits) repoCounts.set(c.repo, (repoCounts.get(c.repo) ?? 0) + 1)
  let mostActiveRepo = '—'
  let maxCount = 0
  for (const [repo, count] of repoCounts) {
    if (count > maxCount) {
      maxCount = count
      mostActiveRepo = repo
    }
  }

  const hourCounts = new Map<number, number>()
  for (const c of commits) {
    const h = hourOf(c.date)
    if (h !== null) hourCounts.set(h, (hourCounts.get(h) ?? 0) + 1)
  }
  let peakHour: number | null = null
  let peakHourCount = 0
  for (const [h, count] of hourCounts) {
    if (count > peakHourCount) {
      peakHourCount = count
      peakHour = h
    }
  }

  const days = [...payload.contributions.days].sort((a, b) => a.date.localeCompare(b.date))
  const { longestStreak, currentStreak } = streaks(days)
  let peakDay: Analysis['peakDay'] = null
  for (const d of days) {
    if (!peakDay || d.count > peakDay.count) peakDay = d
  }
  if (peakDay && peakDay.count === 0) peakDay = null

  const avgDailyCommits = payload.contributions.total / Math.max(1, days.length)

  let peakMoment: Analysis['peakMoment'] = null
  if (peakDay && peakDay.count > 0) {
    const dayCommits = commits.filter((c) => c.date?.slice(0, 10) === peakDay.date)
    const hourSet = new Set<number>()
    const repoSet = new Set<string>()
    for (const c of dayCommits) {
      if (c.date) hourSet.add(new Date(c.date).getUTCHours())
      repoSet.add(c.repo)
    }
    peakMoment = {
      date: peakDay.date,
      count: peakDay.count,
      repos: [...repoSet],
      hoursActive: hourSet.size,
    }
  }

  let latestCommit: Analysis['latestCommit'] = null
  let earliestCommit: Analysis['earliestCommit'] = null
  const dated = commits.filter((c) => c.date)
  if (dated.length) {
    const sorted = [...dated].sort((a, b) => (a.date! < b.date! ? -1 : 1))
    earliestCommit = {
      message: sorted[0].message,
      hourLabel: formatHour(new Date(sorted[0].date!).getUTCHours()),
    }
    latestCommit = {
      message: sorted[sorted.length - 1].message,
      hourLabel: formatHour(new Date(sorted[sorted.length - 1].date!).getUTCHours()),
    }
  }

  let longestSessionHours: number | null = null
  {
    const byDay = new Map<string, number[]>()
    for (const c of dated) {
      const day = c.date!.slice(0, 10)
      const h = new Date(c.date!).getUTCHours()
      const list = byDay.get(day)
      if (list) list.push(h)
      else byDay.set(day, [h])
    }
    let best = 0
    for (const hs of byDay.values()) {
      if (hs.length < 2) continue
      const span = Math.max(...hs) - Math.min(...hs)
      if (span > best) best = span
    }
    longestSessionHours = best > 0 ? best : null
  }

  let mostStarredRepo: Analysis['mostStarredRepo'] = null
  let longestRunningRepo: Analysis['longestRunningRepo'] = null
  let fastestGrowingRepo: Analysis['fastestGrowingRepo'] = null
  const repoList = payload.repos
  if (repoList.length) {
    const withStars = repoList.filter((r) => r.stars > 0).sort((a, b) => b.stars - a.stars)
    if (withStars.length) mostStarredRepo = { name: withStars[0].name, stars: withStars[0].stars }

    const byAge = repoList.filter((r) => r.createdAt).sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    if (byAge.length) {
      longestRunningRepo = {
        name: byAge[0].name,
        days: Math.max(1, Math.floor((now - new Date(byAge[0].createdAt).getTime()) / DAY_MS)),
      }
    }

    const fastest = repoList
      .filter((r) => r.stars > 0 && r.createdAt)
      .map((r) => ({
        name: r.name,
        stars: r.stars,
        days: Math.max(1, Math.floor((now - new Date(r.createdAt).getTime()) / DAY_MS)),
      }))
      .sort((a, b) => b.stars / b.days - a.stars / a.days)
    if (fastest.length) fastestGrowingRepo = fastest[0]
  }

  const aliveRepoNames = repoList.filter((r) => isRepoAlive(r.pushedAt, now)).map((r) => r.name)

  return {
    totalCommits: payload.contributions.total,
    reposCreated: payload.repos.length,
    reposMaintained,
    abandonedRepos: Math.max(0, payload.repos.length - reposMaintained),
    totalStars,
    followers: payload.profile.followers,
    pulls: payload.events.pulls,
    issues: payload.events.issues,
    languages: languageShares,
    languageCount: languageShares.length,
    topLanguage: languageShares[0]?.name ?? '—',
    mostActiveRepo,
    nightRatio,
    weekendRatio,
    longestStreak,
    currentStreak,
    peakDay,
    peakHour,
    avgDailyCommits,
    peakMoment,
    latestCommit,
    earliestCommit,
    longestSessionHours,
    mostStarredRepo,
    longestRunningRepo,
    fastestGrowingRepo,
    aliveRepoNames,
    commitStats: commitStats(commits),
  }
}

function computeLanguages(raw: Record<string, number>): LanguageShare[] {
  const total = Object.values(raw).reduce((a, b) => a + b, 0)
  if (total === 0) return []
  return Object.entries(raw)
    .map(([name, bytes]) => ({ name, percent: (bytes / total) * 100 }))
    .filter((l) => l.percent >= 1)
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 8)
}

function streaks(days: Array<{ date: string; count: number }>) {
  if (days.length === 0) return { longestStreak: 0, currentStreak: 0 }

  let longest = 0
  let run = 0
  let prev: Date | null = null
  for (const d of days) {
    const date = new Date(`${d.date}T12:00:00Z`)
    if (d.count > 0) {
      if (prev && (date.getTime() - prev.getTime()) / 86400000 === 1) {
        run += 1
      } else {
        run = 1
      }
      if (run > longest) longest = run
    } else {
      run = 0
    }
    prev = date
  }

  let current = 0
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) current += 1
    else break
  }

  return { longestStreak: longest, currentStreak: current }
}

function commitStats(commits: Array<{ message: string }>): CommitStats {
  const messages = commits.map((c) => c.message.trim())
  const count = messages.length
  const totalLen = messages.reduce((sum, m) => sum + m.length, 0)
  const oneWord = messages.filter((m) => !m.includes(' ')).length

  let fixCount = 0
  let renameCount = 0
  let finalCount = 0
  const wordCounts = new Map<string, number>()
  for (const m of messages) {
    fixCount += (m.match(/\bfix(?:es|ed|ing)?\b/gi) ?? []).length
    renameCount += (m.match(/\brenam(?:e|ed|ing)\b/gi) ?? []).length
    finalCount += (m.match(/\bfinal\b/gi) ?? []).length
    for (const w of m.toLowerCase().split(/[^a-z0-9]+/)) {
      if (w && !STOPWORDS.has(w)) wordCounts.set(w, (wordCounts.get(w) ?? 0) + 1)
    }
  }

  return {
    count,
    avgLength: count ? Math.round(totalLen / count) : 0,
    oneWordPct: count ? oneWord / count : 0,
    fixCount,
    renameCount,
    finalCount,
    commonWords: [...wordCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([w]) => w),
  }
}
