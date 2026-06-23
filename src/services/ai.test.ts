import { describe, expect, it, vi } from 'vitest'
import { AI_PROVIDER_TEMPLATES, AI_SETTINGS_STORAGE_KEY, callMimoAI, readAISettings, testAISettings } from './ai'

class MemoryStorage {
    private values = new Map<string, string>()

    getItem(key: string) {
        return this.values.get(key) ?? null
    }

    setItem(key: string, value: string) {
        this.values.set(key, value)
    }
}

describe('ai settings', () => {
    it('offers mainstream OpenAI-compatible provider templates', () => {
        expect(AI_PROVIDER_TEMPLATES.map(template => template.id)).toEqual(['openai', 'gemini', 'groq', 'openrouter', 'siliconflow', 'deepseek', 'zhipu'])
        expect(AI_PROVIDER_TEMPLATES.filter(template => template.badge.includes('免费')).map(template => template.id)).toEqual(['gemini', 'groq', 'openrouter', 'siliconflow'])
    })

    it('reads AI settings from browser storage', () => {
        const storage = new MemoryStorage()
        storage.setItem(
            AI_SETTINGS_STORAGE_KEY,
            JSON.stringify({
                endpoint: 'https://api.example.com/v1/chat/completions',
                model: 'demo-model',
                apiKey: 'secret'
            })
        )

        expect(readAISettings(storage)).toEqual({
            endpoint: 'https://api.example.com/v1/chat/completions',
            model: 'demo-model',
            apiKey: 'secret'
        })
    })

    it('falls back without calling AI when no local settings exist', async () => {
        const result = await callMimoAI(
            'tags',
            {
                login: 'octo',
                stars: 1,
                lang: 'TypeScript',
                topRepo: 'demo',
                platformLabel: 'GitHub',
                year: 2025
            },
            null
        )

        expect(result).toContain('未配置AI')
    })

    it('tests AI settings with a minimal chat completion request', async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                choices: [{ message: { content: 'OK' } }]
            })
        })

        const result = await testAISettings(
            {
                endpoint: 'https://api.example.com/v1/chat/completions',
                model: 'demo-model',
                apiKey: 'secret'
            },
            fetchMock as unknown as typeof fetch
        )

        expect(result).toEqual({ ok: true, message: '连接成功，模型已返回响应。' })
        expect(fetchMock).toHaveBeenCalledWith(
            'https://api.example.com/v1/chat/completions',
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    Authorization: 'Bearer secret'
                })
            })
        )
    })

    it('returns a readable failure when AI test settings are incomplete', async () => {
        const result = await testAISettings({
            endpoint: '',
            model: '',
            apiKey: ''
        })

        expect(result).toEqual({ ok: false, message: '请先填写 Endpoint 和 Model。' })
    })
})
