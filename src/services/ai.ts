export const AI_SETTINGS_STORAGE_KEY = 'year-in-code-ai-settings'

export interface AIInputData {
    login: string
    stars: number
    lang: string
    topRepo: string
    platformLabel: string
    year: number
    totalContributions?: number
    longestStreak?: number
    mostActiveMonth?: string
    mostActiveDay?: string
    publicRepos?: number
    followers?: number
    topLangs?: string[]
}

export interface AISettings {
    endpoint: string
    model: string
    apiKey: string
}

export interface AIProviderTemplate {
    id: string
    name: string
    badge: string
    endpoint: string
    model: string
    note: string
}

export type AIType = 'analysis' | 'critique' | 'tags'

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

export const AI_PROVIDER_TEMPLATES: AIProviderTemplate[] = [
    {
        id: 'openai',
        name: 'OpenAI',
        badge: '官方',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-4o-mini',
        note: '稳定通用，需自行准备 OpenAI API Key。'
    },
    {
        id: 'gemini',
        name: 'Google Gemini',
        badge: '有免费层',
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
        model: 'gemini-2.0-flash',
        note: 'OpenAI-compatible 入口，Google AI Studio 通常提供免费额度。'
    },
    {
        id: 'groq',
        name: 'Groq',
        badge: '有免费层',
        endpoint: 'https://api.groq.com/openai/v1/chat/completions',
        model: 'llama-3.1-8b-instant',
        note: '速度快，GroqCloud 通常提供免费开发额度。'
    },
    {
        id: 'openrouter',
        name: 'OpenRouter',
        badge: '有免费模型',
        endpoint: 'https://openrouter.ai/api/v1/chat/completions',
        model: 'google/gemini-2.0-flash-exp:free',
        note: '聚合入口，可选择带 :free 标记的免费模型。'
    },
    {
        id: 'siliconflow',
        name: 'SiliconFlow',
        badge: '有免费模型',
        endpoint: 'https://api.siliconflow.cn/v1/chat/completions',
        model: 'Qwen/Qwen2.5-7B-Instruct',
        note: '国内访问友好，部分模型/额度以控制台为准。'
    },
    {
        id: 'deepseek',
        name: 'DeepSeek',
        badge: '高性价比',
        endpoint: 'https://api.deepseek.com/chat/completions',
        model: 'deepseek-chat',
        note: 'OpenAI-compatible 接口，适合中文锐评。'
    },
    {
        id: 'zhipu',
        name: '智谱 GLM',
        badge: '国产',
        endpoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
        model: 'glm-4-flash',
        note: 'OpenAI-compatible 接口，国内账号体系。'
    }
]

const fallbackContent = (type: AIType) => {
    if (type === 'tags') return '未配置AI,本地分析,开源探索者'
    return '未配置AI入口。你可以在首页的 AI 设置中填入自己的 OpenAI-compatible 接口、模型和 API Key，配置会只保存在当前浏览器 localStorage 中。'
}

export const readAISettings = (storage: StorageLike | null | undefined = typeof localStorage === 'undefined' ? null : localStorage): AISettings | null => {
    if (!storage) return null

    try {
        const raw = storage.getItem(AI_SETTINGS_STORAGE_KEY)
        if (!raw) return null
        const parsed = JSON.parse(raw)
        if (!parsed?.endpoint || !parsed?.model) return null
        return {
            endpoint: String(parsed.endpoint).trim(),
            model: String(parsed.model).trim(),
            apiKey: String(parsed.apiKey || '').trim()
        }
    } catch {
        return null
    }
}

export const saveAISettings = (settings: AISettings, storage: StorageLike | null | undefined = typeof localStorage === 'undefined' ? null : localStorage) => {
    if (!storage) return
    storage.setItem(
        AI_SETTINGS_STORAGE_KEY,
        JSON.stringify({
            endpoint: settings.endpoint.trim(),
            model: settings.model.trim(),
            apiKey: settings.apiKey.trim()
        })
    )
}

const getPrompt = (type: AIType, data: AIInputData): string => {
    const source = `${data.year} 年的 ${data.platformLabel}`

    if (type === 'analysis') {
        return `你是 ${data.platformLabel} 数据深度分析师。基于以下 ${source} 统计数据，为用户生成一份充满文学感、洞察力且富有情感的年度技术总结报告。

数据：
- 用户名：${data.login}
- ${data.year} 年总贡献：${data.totalContributions || '未知'}
- 最长连续贡献：${data.longestStreak || '未知'} 天
- 最活跃月份：${data.mostActiveMonth || '未知'}
- 最活跃的一天：${data.mostActiveDay || '未知'}
- 主要语言：${data.lang} (及其它：${(data.topLangs || []).join(', ')})
- 旗舰项目：${data.topRepo}
- 公开仓库数：${data.publicRepos || '未知'}
- 总 Star 数：${data.stars}
- 关注者：${data.followers || '未知'}

要求：
1. 文风避免陈词滥调，像给老友写信，也像评价一场精彩演出。
2. 不要只是罗列数据，要从数据中解读开发节奏、性格特点、技术追求和创作偏好。
3. 直接使用“你”，不要使用“用户”“该用户”等称呼，也不要用“好的，即将为你生成”这类开场白。
4. 字数控制在 400 字左右，语言为中文。`
    }

    if (type === 'critique') {
        return `你是 ${data.platformLabel} 灵魂毒舌分析官，风格参考 Reddit 上的硬核技术吐槽。
你的任务是根据以下 ${source} 数据，写一段极其毒舌、刻薄但又精准得让人无法反驳的锐评。

数据：
- 用户名：${data.login}
- ${data.year} 年总贡献：${data.totalContributions || '未知'}
- 最长连续贡献：${data.longestStreak || '未知'} 天
- 最活跃月份：${data.mostActiveMonth || '未知'}
- 最活跃的一天：${data.mostActiveDay || '未知'}
- 主要语言：${data.lang} (及其它：${(data.topLangs || []).join(', ')})
- 旗舰项目：${data.topRepo}
- 总 Star 数：${data.stars}
- 关注者：${data.followers || '未知'}
- 公开仓库：${data.publicRepos || '未知'}

要求：
1. 如果贡献很多但 Star 极少，嘲讽其为“勤奋的打字机”或“Git 历史记录污染者”。
2. 必须使用技术梗，例如 O(n^2) 的脑回路、内存泄漏式的逻辑、被 deprecated 的职业生涯。
3. 严禁使用“总的来说”“从数据看”“你的表现”等废话。直接开骂，不用打招呼。
4. 字数 200-400 字，中文，禁止任何礼貌性词汇。`
    }

    return `你是 ${data.platformLabel} 标签生成器。基于 ${data.year} 年数据：用户名 ${data.login}，Star 总计 ${data.stars}，主修语言 ${data.lang}，代表作 ${data.topRepo}。
生成 5-10 个总结性、富有洞察力的中文身份标签。标签需幽默风趣、生动贴切，反映其技术栈、项目特点或开发风格。请直接输出以逗号分隔的标签，无需其他说明。`
}

export const callMimoAI = async (type: AIType, data: AIInputData, settings: AISettings | null | undefined = readAISettings()): Promise<string> => {
    if (!settings?.endpoint || !settings?.model) return fallbackContent(type)

    const prompt = getPrompt(type, data)
    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    }
    if (settings.apiKey) headers.Authorization = `Bearer ${settings.apiKey}`

    try {
        const response = await fetch(settings.endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                model: settings.model,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.8
            })
        })

        if (!response.ok) throw new Error(`AI 接口返回 ${response.status}`)
        const resData = await response.json()
        return resData?.choices?.[0]?.message?.content || fallbackContent(type)
    } catch (e) {
        console.error('AI调用失败:', e)
        return fallbackContent(type)
    }
}

export const testAISettings = async (settings: AISettings, fetcher: typeof fetch = fetch): Promise<{ ok: boolean; message: string }> => {
    if (!settings.endpoint.trim() || !settings.model.trim()) {
        return { ok: false, message: '请先填写 Endpoint 和 Model。' }
    }

    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    }
    if (settings.apiKey.trim()) headers.Authorization = `Bearer ${settings.apiKey.trim()}`

    try {
        const response = await fetcher(settings.endpoint.trim(), {
            method: 'POST',
            headers,
            body: JSON.stringify({
                model: settings.model.trim(),
                messages: [{ role: 'user', content: '请只回复 OK，用于测试 API 连接。' }],
                temperature: 0,
                max_tokens: 8
            })
        })

        if (!response.ok) {
            return { ok: false, message: `连接失败：AI 接口返回 ${response.status}。` }
        }

        const data = await response.json()
        const content = data?.choices?.[0]?.message?.content
        if (!content) return { ok: false, message: '连接失败：接口返回格式不是 OpenAI-compatible chat completions。' }

        return { ok: true, message: '连接成功，模型已返回响应。' }
    } catch (error) {
        const message = error instanceof Error ? error.message : '未知错误'
        return { ok: false, message: `连接失败：${message}` }
    }
}
