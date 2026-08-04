/**
 * DevWrapped API — thin Cloudflare Worker that holds a single GitHub token,
 * proxies REST + GraphQL, and caches the assembled payload per-username.
 */

interface Env {
  GITHUB_TOKEN: string
}

interface RepoInfo {
  name: string
  stars: number
  primaryLanguage: string | null
  pushedAt: string | null
  createdAt: string
  archived: boolean
  size: number
}

interface WrappedPayload {
  username: string
  year: number
  profile: {
    name: string | null
    login: string
    avatarUrl: string
    followers: number
    publicRepos: number
    createdAt: string
  }
  repos: RepoInfo[]
  languages: Record<string, number>
  contributions: {
    total: number
    days: Array<{ date: string; count: number }>
  }
  commits: Array<{ repo: string; message: string; date: string | null }>
  events: { pulls: number; issues: number }
  generatedAt: string
}

const USERNAME_RE = /^[a-zA-Z0-9-]{1,39}$/

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)
    const cors = corsHeaders()

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors })
    }
    // Health/root — makes the worker's base URL return 200 for uptime monitors and browsers.
    if (url.pathname === '/' || url.pathname === '/health') {
      return json({ ok: true, service: 'devwrapped-api' }, 200, cors)
    }
    if (url.pathname !== '/api/wrapped') {
      return json({ error: 'not_found', message: 'Not found.' }, 404, cors)
    }

    const username = url.searchParams.get('username') ?? ''
    if (!USERNAME_RE.test(username)) {
      return json(
        { error: 'invalid_username', message: 'Enter a valid GitHub username (letters, numbers, dashes).' },
        400,
        cors,
      )
    }
    if (!env.GITHUB_TOKEN) {
      return json(
        { error: 'no_token', message: 'GITHUB_TOKEN is not configured on the worker. Copy .dev.vars.example to .dev.vars.' },
        500,
        cors,
      )
    }

    const cache = caches.default
    const cacheKey = new Request(request.url, { method: 'GET' })
    const cached = await cache.match(cacheKey)
    if (cached) return cached

    try {
      const payload = await buildWrapped(username, env.GITHUB_TOKEN)
      const response = json(payload, 200, cors)
      response.headers.set('Cache-Control', 'public, max-age=3600')
      ctx.waitUntil(cache.put(cacheKey, response.clone()))
      return response
    } catch (err) {
      const e = err as { status?: number; message?: string }
      const status = e.status && e.status >= 400 && e.status < 600 ? e.status : 502
      return json(
        { error: 'github_error', status, message: e.message ?? 'Failed to load GitHub data.' },
        status,
        cors,
      )
    }
  },
} satisfies ExportedHandler<Env>

async function buildWrapped(username: string, token: string): Promise<WrappedPayload> {
  const gh = githubClient(token)
  const now = new Date()
  const year = now.getUTCFullYear()

  const [profileRaw, reposRaw] = await Promise.all([
    gh.get(`/users/${username}`),
    gh.get(`/users/${username}/repos?sort=pushed&per_page=100`),
  ])

  const repos: RepoInfo[] = (reposRaw as any[] ?? []).map((r) => ({
    name: r.name,
    stars: r.stargazers_count ?? 0,
    primaryLanguage: r.language ?? null,
    pushedAt: r.pushed_at ?? null,
    createdAt: r.created_at ?? '',
    archived: r.archived ?? false,
    size: r.size ?? 0,
  }))

  // Languages: REST gives per-repo breakdown, so aggregate the most recently active repos.
  const languages: Record<string, number> = {}
  const languageRepos = repos.slice(0, 30)
  const languageResults = await Promise.allSettled(
    languageRepos.map((r) => gh.get(`/repos/${username}/${r.name}/languages`)),
  )
  for (const res of languageResults) {
    if (res.status !== 'fulfilled') continue
    for (const [lang, bytes] of Object.entries(res.value as Record<string, number>)) {
      languages[lang] = (languages[lang] ?? 0) + bytes
    }
  }

  // Commit messages: sample the first page of the most recently pushed repos.
  const commits: Array<{ repo: string; message: string; date: string | null }> = []
  const commitRepos = repos.slice(0, 10)
  const commitResults = await Promise.allSettled(
    commitRepos.map((r) => gh.get(`/repos/${username}/${r.name}/commits?per_page=100`)),
  )
  commitResults.forEach((res, i) => {
    if (res.status !== 'fulfilled') return
    const repoName = commitRepos[i].name
    for (const c of (res.value as any[] ?? [])) {
      const message: string | undefined = c?.commit?.message
      if (!message || message.startsWith('Merge ')) continue
      commits.push({
        repo: repoName,
        message: message.split('\n')[0].slice(0, 200),
        date: c.commit.committer?.date ?? c.commit.author?.date ?? null,
      })
    }
  })

  // Rough PR / issue activity from recent public events (best-effort).
  let pulls = 0
  let issues = 0
  try {
    const events = await gh.get(`/users/${username}/events/public?per_page=100`) as any[]
    for (const e of events ?? []) {
      if (e.type === 'PullRequestEvent') pulls++
      else if (e.type === 'IssuesEvent') issues++
    }
  } catch {
    /* non-fatal */
  }

  const [contributions, profile] = await Promise.all([
    fetchContributions(username, token, year),
    finishProfile(profileRaw),
  ])

  return {
    username,
    year,
    profile,
    repos,
    languages,
    contributions,
    commits,
    events: { pulls, issues },
    generatedAt: new Date().toISOString(),
  }
}

async function finishProfile(profileRaw: unknown) {
  const p = profileRaw as any
  return {
    name: p.name ?? null,
    login: p.login ?? '',
    avatarUrl: p.avatar_url ?? `https://github.com/identicons/${p.login ?? ''}.png`,
    followers: p.followers ?? 0,
    publicRepos: p.public_repos ?? 0,
    createdAt: p.created_at ?? '',
  }
}

async function fetchContributions(username: string, token: string, year: number) {
  const query = `
    query($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }`
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'devwrapped-worker',
    },
    body: JSON.stringify({
      query,
      variables: {
        login: username,
        from: `${year}-01-01T00:00:00Z`,
        to: `${year + 1}-01-01T00:00:00Z`,
      },
    }),
  })
  const body = (await res.json()) as any
  if (body.errors) {
    throw new Error(body.errors.map((e: any) => e.message).join('; '))
  }
  const calendar = body?.data?.user?.contributionsCollection?.contributionCalendar
  const days: Array<{ date: string; count: number }> = []
  for (const week of calendar?.weeks ?? []) {
    for (const d of week.contributionDays ?? []) {
      days.push({ date: d.date, count: d.contributionCount })
    }
  }
  return { total: calendar?.totalContributions ?? 0, days }
}

function githubClient(token: string) {
  const base = 'https://api.github.com'
  return {
    async get(path: string): Promise<unknown> {
      const res = await fetch(`${base}${path}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'devwrapped-worker',
        },
      })
      if (!res.ok) {
        const remaining = res.headers.get('x-ratelimit-remaining')
        const detail = remaining === '0' ? ' GitHub rate limit reached for this token.' : ''
        const err = new Error(`GitHub ${res.status} for ${path}.${detail}`) as Error & { status?: number }
        err.status = res.status
        throw err
      }
      return res.json()
    },
  }
}

// Public read-only API — no browser auth headers, so * is safe and avoids
// Cloudflare Cache API storing origin-tied responses that break across deployments.
function corsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

function json(data: unknown, status: number, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  })
}
