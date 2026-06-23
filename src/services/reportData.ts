import type { Platform, SourceRepo, SourceUser, UserData } from '../types'

export const PLATFORM_TOKENS_STORAGE_KEY = 'year-in-code-platform-tokens'

export const PLATFORM_LABEL: Record<Platform, string> = {
    gitee: 'Gitee',
    github: 'GitHub'
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

export interface PlatformTokens {
    github: string
    gitee: string
}

export const readPlatformTokens = (storage: StorageLike | null | undefined = typeof localStorage === 'undefined' ? null : localStorage): PlatformTokens => {
    if (!storage) return { github: '', gitee: '' }

    try {
        const raw = storage.getItem(PLATFORM_TOKENS_STORAGE_KEY)
        if (!raw) return { github: '', gitee: '' }
        const parsed = JSON.parse(raw)
        return {
            github: String(parsed.github || '').trim(),
            gitee: String(parsed.gitee || '').trim()
        }
    } catch {
        return { github: '', gitee: '' }
    }
}

export const savePlatformTokens = (tokens: PlatformTokens, storage: StorageLike | null | undefined = typeof localStorage === 'undefined' ? null : localStorage) => {
    if (!storage) return
    storage.setItem(
        PLATFORM_TOKENS_STORAGE_KEY,
        JSON.stringify({
            github: tokens.github.trim(),
            gitee: tokens.gitee.trim()
        })
    )
}

const assertArray = async <T>(response: Response, platform: Platform): Promise<T[]> => {
    const data = await response.json()
    if (!Array.isArray(data)) {
        const message = data?.message ? `：${data.message}` : ''
        throw `${PLATFORM_LABEL[platform]} API 返回异常${message}`
    }
    return data
}

const assertUser = async (response: Response, platform: Platform): Promise<Record<string, any>> => {
    const data = await response.json()
    if (!response.ok) {
        if (response.status === 403) throw `${PLATFORM_LABEL[platform]} API 速率达到上限。请稍后再试。`
        if (response.status === 404) throw '未找到该用户'
        throw data?.message || `${PLATFORM_LABEL[platform]} API 请求失败`
    }
    return data
}

export const normalizeUsername = (raw: string, platform: Platform): string => {
    const value = raw.trim()
    if (!value) return ''

    try {
        const url = new URL(value)
        if (platform === 'gitee' && url.hostname.includes('gitee.com')) return url.pathname.split('/').filter(Boolean)[0] || ''
        if (platform === 'github' && url.hostname.includes('github.com')) return url.pathname.split('/').filter(Boolean)[0] || ''
    } catch {
        return value.replace(/^@/, '').replace(/^https?:\/\/[^/]+\//, '').split('/')[0] || ''
    }

    return value.replace(/^@/, '')
}

export const isRepoActiveInYear = (repo: Pick<SourceRepo, 'created_at' | 'updated_at'>, year: number): boolean => {
    const createdYear = new Date(repo.created_at).getFullYear()
    const updatedYear = new Date(repo.updated_at).getFullYear()
    return createdYear === year || updatedYear === year
}

const withGiteeAccessToken = (url: string, token?: string): string => {
    if (!token) return url
    const parsed = new URL(url)
    parsed.searchParams.set('access_token', token)
    return parsed.toString()
}

export const buildUserRequest = (platform: Platform, username: string, token = ''): { url: string; headers: Record<string, string> } => {
    if (platform === 'github') {
        return {
            url: `https://api.github.com/users/${username}`,
            headers: token
                ? {
                      Authorization: `Bearer ${token}`,
                      Accept: 'application/vnd.github+json',
                      'X-GitHub-Api-Version': '2022-11-28'
                  }
                : {}
        }
    }

    return {
        url: withGiteeAccessToken(`https://gitee.com/api/v5/users/${username}`, token),
        headers: {}
    }
}

export const buildRepoListRequest = (platform: Platform, username: string, page: number, token = ''): { url: string; headers: Record<string, string>; authenticated: boolean } => {
    if (platform === 'github') {
        return {
            url: token
                ? `https://api.github.com/user/repos?per_page=100&page=${page}&sort=updated&visibility=all&affiliation=owner%2Ccollaborator%2Corganization_member`
                : `https://api.github.com/users/${username}/repos?per_page=100&page=${page}&sort=updated&type=owner`,
            headers: token
                ? {
                      Authorization: `Bearer ${token}`,
                      Accept: 'application/vnd.github+json',
                      'X-GitHub-Api-Version': '2022-11-28'
                  }
                : {},
            authenticated: Boolean(token)
        }
    }

    return {
        url: token
            ? withGiteeAccessToken(`https://gitee.com/api/v5/user/repos?per_page=100&page=${page}&sort=updated&type=all`, token)
            : `https://gitee.com/api/v5/users/${username}/repos?per_page=100&page=${page}`,
        headers: {},
        authenticated: Boolean(token)
    }
}

export const fetchUser = async (platform: Platform, username: string, token = ''): Promise<SourceUser> => {
    const request = buildUserRequest(platform, username, token)
    const data = await assertUser(await fetch(request.url, { headers: request.headers }), platform)

    return {
        login: data.login,
        name: data.name,
        avatar_url: data.avatar_url,
        bio: data.bio,
        public_repos: data.public_repos || 0,
        followers_count: platform === 'github' ? data.followers || 0 : data.followers_count || 0,
        following_count: platform === 'github' ? data.following || 0 : data.following_count || 0,
        created_at: data.created_at,
        platform,
        platformLabel: PLATFORM_LABEL[platform]
    }
}

export const fetchRepos = async (platform: Platform, username: string, token = ''): Promise<SourceRepo[]> => {
    const repos: SourceRepo[] = []
    let page = 1

    while (page <= 10) {
        const request = buildRepoListRequest(platform, username, page, token)
        const response = await fetch(request.url, { headers: request.headers })

        if (response.status === 403) {
            throw `${PLATFORM_LABEL[platform]} API 速率达到上限。请稍后再试。`
        }

        const data = await assertArray<Record<string, any>>(response, platform)
        if (data.length === 0) break

        const visibleRepos = request.authenticated ? data.filter(repo => (repo.owner?.login || repo.owner?.name || repo.namespace?.path || repo.namespace?.name || username).toLowerCase() === username.toLowerCase()) : data

        repos.push(
            ...visibleRepos.map(repo => ({
                name: repo.name,
                language: repo.language || null,
                stargazers_count: repo.stargazers_count || 0,
                forks_count: repo.forks_count || 0,
                created_at: repo.created_at,
                updated_at: repo.updated_at,
                fork: Boolean(repo.fork)
            }))
        )
        page++
    }

    return repos
}

export const buildUserData = (user: SourceUser, repos: SourceRepo[], year: number): Partial<UserData> => {
    const originalRepos = repos.filter(r => !r.fork)
    const activeRepos = originalRepos.filter(r => isRepoActiveInYear(r, year))
    const totalStars = activeRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0)
    const langMap: Record<string, number> = {}

    activeRepos.forEach(repo => {
        if (repo.language) langMap[repo.language] = (langMap[repo.language] || 0) + 1
    })

    const languageStats = Object.entries(langMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([label, count]) => ({ label, count }))
    const topLang = languageStats[0]?.label || 'Unknown'
    const starDistribution = [...activeRepos]
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5)
        .map(repo => ({ label: repo.name, count: repo.stargazers_count }))
    const starRepo = [...activeRepos].sort((a, b) => b.stargazers_count - a.stargazers_count)[0] || null
    const collaborationRepo = [...activeRepos].sort((a, b) => b.forks_count - a.forks_count)[0] || null
    const followers = user.followers_count || 0
    const baseContributions = activeRepos.length * 20 + followers * 2
    const totalContributions = Math.floor(baseContributions * (0.8 + Math.random() * 0.4)) || Math.floor(50 + Math.random() * 100)
    const longestStreak = Math.floor(Math.min(365, (totalContributions / 8) * (0.5 + Math.random())))
    const monthCounts: Record<number, number> = {}

    activeRepos.map(repo => new Date(repo.updated_at).getMonth()).forEach(month => (monthCounts[month] = (monthCounts[month] || 0) + 1))

    const firstMonth = Object.entries(monthCounts).sort((a, b) => b[1] - a[1])[0]
    const mostActiveMonthIndex = firstMonth ? Number(firstMonth[0]) : Math.floor(Math.random() * 12)
    const mostActiveMonth = months[mostActiveMonthIndex]
    const mostActiveDay = days[Math.floor(Math.random() * days.length)]
    const highCommitRepo = activeRepos.length > 0 ? activeRepos[Math.floor(Math.random() * activeRepos.length)] : null
    const highCommitCount = Math.floor(totalContributions * (0.3 + Math.random() * 0.4))

    let rank = '潜行者'
    if (totalStars > 10000 && followers > 5000) rank = '开源传奇'
    else if (totalStars > 5000 && followers > 1000) rank = '年度技术领袖'
    else if (totalStars > 2000 && followers > 500) rank = '社区领袖'
    else if (totalStars > 1000) rank = '核心贡献者'
    else if (totalStars > 500 && activeRepos.length > 5) rank = '优质贡献者'
    else if (totalStars > 200) rank = '活跃贡献者'
    else if (activeRepos.length > 20) rank = '超级构建者'
    else if (activeRepos.length > 10) rank = '高产构建者'
    else if (activeRepos.length > 5) rank = '积极构建者'
    else if (totalStars > 100) rank = '技术影响者'
    else if (totalStars > 50) rank = '赛博漫步者'
    else if (totalStars > 20) rank = '代码探索者'
    else if (totalStars > 0) rank = '代码工匠'
    else if (activeRepos.length > 3) rank = '持续贡献者'
    else if (activeRepos.length > 1) rank = '热情新手'
    else if (activeRepos.length > 0) rank = '入门学徒'

    const createdDate = new Date(user.created_at)
    const diffDays = Math.ceil(Math.abs(Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
    const techImpact = diffDays > 365 ? `${(diffDays / 365).toFixed(1)} years` : `${diffDays} days`
    const score = totalStars * 10 + activeRepos.length * 5
    let powerLevel = 'D (Fighter)'
    if (score > 1000) powerLevel = 'SSS (Godly)'
    else if (score > 500) powerLevel = 'SS (Legendary)'
    else if (score > 200) powerLevel = 'S (Elite)'
    else if (score > 100) powerLevel = 'A (Professional)'
    else if (score > 50) powerLevel = 'B (Active)'
    else if (score > 20) powerLevel = 'C (Novice)'

    return {
        ...user,
        year,
        public_repos: activeRepos.length,
        totalStars,
        topLang,
        rank,
        techImpact,
        powerLevel,
        totalContributions,
        totalCommits: totalContributions,
        longestStreak,
        mostActiveMonth,
        mostActiveDay,
        reportId: Math.floor(1000 + Math.random() * 9000),
        heatmapUrl: '',
        starRepoName: starRepo?.name || 'N/A',
        starRepoStars: starRepo?.stargazers_count || 0,
        highCommitRepoName: highCommitRepo?.name || 'N/A',
        highCommitRepoCount: highCommitCount,
        highContributorRepoName: collaborationRepo?.name || 'N/A',
        highContributorRepoCount: (collaborationRepo?.forks_count || 0) + Math.floor(Math.random() * 10),
        languageStats,
        starDistribution
    }
}

export const fetchReportData = async (platform: Platform, username: string, year: number): Promise<Partial<UserData>> => {
    const token = readPlatformTokens()[platform]
    const user = await fetchUser(platform, username, token)
    const repos = await fetchRepos(platform, username, token)
    return buildUserData(user, repos, year)
}
