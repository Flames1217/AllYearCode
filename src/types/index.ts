export type Platform = 'gitee' | 'github'

export interface AnalysisRequest {
    username: string
    platform: Platform
    year: number
}

export interface SourceUser {
    login: string
    name: string | null
    avatar_url: string
    bio: string | null
    public_repos: number
    followers_count: number
    following_count: number
    created_at: string
    platform: Platform
    platformLabel: string
}

export interface SourceRepo {
    name: string
    language: string | null
    stargazers_count: number
    forks_count: number
    created_at: string
    updated_at: string
    fork: boolean
}

export interface UserData extends SourceUser {
    year: number
    totalStars: number
    topLang: string
    rank: string
    techImpact: string
    powerLevel: string
    totalContributions: number
    totalCommits: number
    longestStreak: number
    mostActiveMonth: string
    mostActiveDay: string
    reportId: number
    heatmapUrl: string
    starRepoName?: string
    starRepoStars?: number
    highCommitRepoName?: string
    highCommitRepoCount?: number
    highContributorRepoName?: string
    highContributorRepoCount?: number
    languageStats?: { label: string; count: number }[]
    starDistribution?: { label: string; count: number }[]
}

export interface AIResponse {
    choices: Array<{
        message: {
            content: string
        }
    }>
}
