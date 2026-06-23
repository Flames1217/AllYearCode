import { describe, expect, it } from 'vitest'
import { buildRepoListRequest, buildUserData, buildUserRequest, isRepoActiveInYear, normalizeUsername, PLATFORM_TOKENS_STORAGE_KEY, readPlatformTokens } from './reportData'
import type { SourceRepo, SourceUser } from '../types'

class MemoryStorage {
    private values = new Map<string, string>()

    getItem(key: string) {
        return this.values.get(key) ?? null
    }

    setItem(key: string, value: string) {
        this.values.set(key, value)
    }
}

const user: SourceUser = {
    login: 'octo',
    name: 'Octo',
    avatar_url: 'https://example.com/avatar.png',
    bio: null,
    public_repos: 3,
    followers_count: 2,
    following_count: 1,
    created_at: '2020-01-01T00:00:00Z',
    platform: 'github',
    platformLabel: 'GitHub'
}

const repo = (name: string, created_at: string, updated_at: string, stars = 0): SourceRepo => ({
    name,
    created_at,
    updated_at,
    stargazers_count: stars,
    forks_count: 0,
    fork: false,
    language: 'TypeScript'
})

describe('reportData', () => {
    it('filters repositories by the selected year', () => {
        expect(isRepoActiveInYear(repo('new', '2024-01-01T00:00:00Z', '2025-01-02T00:00:00Z'), 2025)).toBe(true)
        expect(isRepoActiveInYear(repo('old', '2023-01-01T00:00:00Z', '2024-01-02T00:00:00Z'), 2025)).toBe(false)
    })

    it('builds report data for the requested year only', () => {
        const data = buildUserData(
            user,
            [repo('active', '2025-03-01T00:00:00Z', '2025-04-01T00:00:00Z', 10), repo('old', '2024-01-01T00:00:00Z', '2024-03-01T00:00:00Z', 20)],
            2025
        )

        expect(data.year).toBe(2025)
        expect(data.platformLabel).toBe('GitHub')
        expect(data.public_repos).toBe(1)
        expect(data.totalStars).toBe(10)
        expect(data.starRepoName).toBe('active')
    })

    it('accepts plain usernames, handles, and profile urls', () => {
        expect(normalizeUsername('@Flames1217', 'gitee')).toBe('Flames1217')
        expect(normalizeUsername('https://gitee.com/Flames1217/', 'gitee')).toBe('Flames1217')
        expect(normalizeUsername('https://github.com/octocat/repos', 'github')).toBe('octocat')
    })

    it('reads platform tokens from browser storage', () => {
        const storage = new MemoryStorage()
        storage.setItem(
            PLATFORM_TOKENS_STORAGE_KEY,
            JSON.stringify({
                github: 'github_demo_token',
                gitee: 'gitee_demo'
            })
        )

        expect(readPlatformTokens(storage)).toEqual({
            github: 'github_demo_token',
            gitee: 'gitee_demo'
        })
    })

    it('uses authenticated GitHub repository listing when a token is present', () => {
        const request = buildRepoListRequest('github', 'octocat', 1, 'github_demo_token')

        expect(request.url).toBe('https://api.github.com/user/repos?per_page=100&page=1&sort=updated&visibility=all&affiliation=owner%2Ccollaborator%2Corganization_member')
        expect(request.headers.Authorization).toBe('Bearer github_demo_token')
    })

    it('passes Gitee token without exposing it in headers', () => {
        const request = buildUserRequest('gitee', 'Flames1217', 'gitee_demo')

        expect(request.url).toBe('https://gitee.com/api/v5/users/Flames1217?access_token=gitee_demo')
        expect(request.headers.Authorization).toBeUndefined()
    })
})
