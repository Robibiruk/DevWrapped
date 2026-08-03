export interface WrappedPayload {
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
    days: ContributionDay[]
  }
  commits: CommitSample[]
  events: { pulls: number; issues: number }
  generatedAt: string
}

export interface RepoInfo {
  name: string
  stars: number
  primaryLanguage: string | null
  pushedAt: string | null
  createdAt: string
  archived: boolean
  size: number
}

export interface ContributionDay {
  date: string
  count: number
}

export interface CommitSample {
  repo: string
  message: string
  date: string | null
}
