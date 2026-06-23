<template>
    <div class="min-h-[80vh] flex flex-col items-center justify-center text-center max-w-6xl mx-auto px-4 animate__animated animate__fadeIn">
        <!-- 顶部徽章 -->
        <div
            class="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-[10px] md:text-xs font-bold mb-8 tracking-[0.2em] uppercase backdrop-blur-sm"
        >
            <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            GitHub / Gitee 年度总结生成
        </div>

        <!-- 主标题区 -->
        <div class="relative mb-8">
            <h1 class="hero-title text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-6">
                <span class="inline-block text-white/90">Code {{ year }} </span>
                <span class="inline-block md:ml-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-teal-400">Year in Code</span>
            </h1>
            <p class="text-gray-400 text-xs md:text-base max-w-xl mx-auto font-medium leading-relaxed opacity-60">
                深度解析你的 GitHub / Gitee 仓库与技术栈 <br class="hidden md:block" />
                接入 <span class="text-white font-bold">自定义 AI</span> 模型，生成专属开发者数字名片
            </p>
        </div>

        <!-- 搜索交互区 -->
        <div class="w-full max-w-2xl mb-8 scale-110 md:scale-125 transition-transform duration-500">
            <div class="relative group">
                <div
                    class="absolute -inset-1.5 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-teal-600 rounded-[2rem] blur-xl opacity-30 group-focus-within:opacity-100 transition duration-500 animate-pulse"
                ></div>
                <div
                    class="relative flex flex-col md:flex-row gap-3 bg-slate-950/80 p-2.5 rounded-[2rem] border-2 border-white/20 backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(168,85,247,0.4)]"
                >
                    <div class="flex-1 flex items-center px-6 py-2">
                        <span class="text-gray-500 mr-3 text-xl">@</span>
                        <input
                            type="text"
                            v-model="username"
                            @keyup.enter="handleAnalysis"
                            :placeholder="`输入你的 ${platform === 'github' ? 'GitHub' : 'Gitee'} ID`"
                            class="w-full bg-transparent border-none outline-none text-white text-lg placeholder:text-gray-600 font-medium"
                        />
                    </div>
                    <button
                        @click="handleAnalysis"
                        :disabled="isLoading"
                        class="group relative overflow-hidden bg-white text-black font-black px-12 py-4 rounded-[1.5rem] transition-all active:scale-95 disabled:opacity-50"
                    >
                        <div class="relative z-10 flex items-center gap-2">
                            <span>{{ isLoading ? '溯源中...' : '立即分析' }}</span>
                            <span v-if="!isLoading" class="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                        <div class="absolute inset-0 bg-gradient-to-r from-teal-400 to-purple-400 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    </button>
                </div>
            </div>

            <!-- 关于项目入口 -->
            <div class="mt-8 grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 text-left">
                <div class="flex rounded-full border border-white/10 bg-white/5 p-1">
                    <button
                        v-for="item in platformOptions"
                        :key="item.value"
                        type="button"
                        @click="platform = item.value"
                        class="flex-1 rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] transition"
                        :class="platform === item.value ? 'bg-white text-slate-950' : 'text-slate-500 hover:text-white'"
                    >
                        {{ item.label }}
                    </button>
                </div>
                <div class="flex items-center rounded-full border border-white/10 bg-white/5 p-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    <select
                        v-model.number="year"
                        aria-label="选择分析年份"
                        class="year-select h-8 rounded-full bg-transparent px-3 text-slate-400 outline-none"
                    >
                        <option v-for="option in yearOptions" :key="option" :value="option">{{ option }}</option>
                    </select>
                    <div class="mx-1 h-5 w-px bg-white/10"></div>
                    <button
                        type="button"
                        @click="stepYear(-1)"
                        :disabled="year <= minYear"
                        aria-label="年份减一"
                        class="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        −
                    </button>
                    <input
                        v-model.number="year"
                        type="number"
                        :min="minYear"
                        :max="nextYear"
                        inputmode="numeric"
                        aria-label="输入分析年份"
                        @blur="clampYear"
                        @keyup.enter="clampYear"
                        class="no-number-spin h-8 w-16 bg-transparent text-center font-black tracking-[0.12em] text-white outline-none"
                    />
                    <button
                        type="button"
                        @click="stepYear(1)"
                        :disabled="year >= nextYear"
                        aria-label="年份加一"
                        class="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        +
                    </button>
                </div>
                <button
                    type="button"
                    @click="openAISettings"
                    class="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 transition hover:border-teal-500/30 hover:text-teal-400"
                >
                    AI 设置
                </button>
            </div>

            <div class="mt-5 flex flex-col items-center">
                <button
                    @click="$emit('showAbout')"
                    class="text-[11px] text-gray-500 hover:text-teal-400 transition-all flex items-center gap-2 uppercase tracking-[0.2em] font-bold group bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:border-teal-500/30"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    了解项目背景 & AI 机制
                </button>
            </div>

            <p class="mt-4 text-[10px] text-gray-500 font-mono tracking-widest uppercase opacity-50">PRESS ENTER TO REVEAL YOUR GENE</p>
        </div>

        <Teleport to="body">
            <div v-if="showAISettings" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-md" @click="showAISettings = false"></div>
                <div class="relative z-10 max-h-[88vh] w-full max-w-2xl overflow-y-auto glass bg-slate-950/95 p-6 text-left shadow-2xl">
                    <div class="mb-5 flex items-start justify-between gap-4">
                        <div>
                            <h2 class="text-xl font-black text-white">AI 设置</h2>
                            <p class="mt-1 text-xs leading-relaxed text-slate-500">AI Key 与平台 Token 只保存在当前浏览器 localStorage，不会写入服务端。</p>
                        </div>
                        <button type="button" @click="showAISettings = false" class="text-slate-500 hover:text-white">✕</button>
                    </div>

                    <div class="space-y-4">
                        <section>
                            <div class="mb-2 flex items-center justify-between gap-3">
                                <p class="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Provider Template</p>
                                <span class="text-[10px] text-slate-600">点击模板会填入 Endpoint 和 Model</span>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <button
                                    v-for="template in AI_PROVIDER_TEMPLATES"
                                    :key="template.id"
                                    type="button"
                                    @click="applyTemplate(template)"
                                    class="rounded-2xl border border-white/10 bg-slate-900/60 p-3 text-left transition hover:border-teal-500/40 hover:bg-slate-900"
                                >
                                    <div class="flex items-center justify-between gap-3">
                                        <span class="text-sm font-black text-white">{{ template.name }}</span>
                                        <span class="rounded-full border border-teal-400/20 bg-teal-400/10 px-2 py-0.5 text-[9px] font-bold text-teal-300">{{ template.badge }}</span>
                                    </div>
                                    <p class="mt-1 text-[10px] leading-relaxed text-slate-500">{{ template.note }}</p>
                                    <p class="mt-2 truncate text-[10px] font-mono text-slate-600">{{ template.model }}</p>
                                </button>
                            </div>
                        </section>

                        <label class="block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                            Endpoint
                            <input v-model="aiForm.endpoint" type="url" placeholder="https://api.openai.com/v1/chat/completions" class="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-teal-500/50" />
                        </label>
                        <label class="block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                            Model
                            <input v-model="aiForm.model" type="text" placeholder="gpt-4o-mini / glm-4-flash / ..." class="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-teal-500/50" />
                        </label>
                        <label class="block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                            API Key
                            <input v-model="aiForm.apiKey" type="password" autocomplete="off" placeholder="只存在本机浏览器" class="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-teal-500/50" />
                        </label>

                        <div
                            v-if="aiTestStatus.message"
                            class="rounded-2xl border px-4 py-3 text-xs leading-relaxed"
                            :class="aiTestStatus.ok ? 'border-teal-400/25 bg-teal-400/10 text-teal-200' : 'border-red-400/25 bg-red-400/10 text-red-200'"
                            role="status"
                        >
                            {{ aiTestStatus.message }}
                        </div>

                        <section class="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                            <div class="mb-3">
                                <h3 class="text-sm font-black text-white">平台 Token（可选）</h3>
                                <p class="mt-1 text-[11px] leading-relaxed text-slate-500">
                                    用于把当前账号可见的私有仓库纳入分析。Token 只保存在浏览器本地，请按最小权限生成。
                                </p>
                            </div>
                            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <label class="block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                                    GitHub Token
                                    <input v-model="platformTokens.github" type="password" autocomplete="off" placeholder="repo / fine-grained metadata" class="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-teal-500/50" />
                                </label>
                                <label class="block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                                    Gitee Token
                                    <input v-model="platformTokens.gitee" type="password" autocomplete="off" placeholder="Gitee 私人令牌" class="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-teal-500/50" />
                                </label>
                            </div>
                        </section>
                    </div>

                    <div class="mt-6 flex justify-end gap-3">
                        <button type="button" @click="showAISettings = false" class="rounded-full border border-white/10 px-5 py-2 text-xs font-bold text-slate-400 hover:text-white">取消</button>
                        <button
                            type="button"
                            @click="testCurrentAISettings"
                            :disabled="isTestingAI"
                            class="rounded-full border border-teal-400/20 bg-teal-400/10 px-5 py-2 text-xs font-bold text-teal-300 transition hover:border-teal-400/40 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {{ isTestingAI ? '测试中...' : '测试连接' }}
                        </button>
                        <button type="button" @click="saveSettings" class="rounded-full bg-white px-5 py-2 text-xs font-black text-slate-950">保存</button>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- 功能特性展示 - 重新设计的卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
            <!-- 技术基因 -->
            <div class="group relative glass p-8 border border-white/5 hover:border-indigo-500/30 transition-all duration-500">
                <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                    <span class="text-4xl font-black">01</span>
                </div>
                <div class="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/20">
                    <span class="text-xl">🧬</span>
                </div>
                <h3 class="text-white font-black text-lg mb-3 tracking-tight">技术基因</h3>
                <p class="text-sm text-gray-500 leading-relaxed">
                    深度解码你的技术序列，分析核心语言栈与工程能力，<br />
                    预测 {{ year }} 年你将深耕的赛博领地。
                </p>
            </div>

            <!-- 灵魂暴击 -->
            <div class="group relative glass p-8 border border-white/5 hover:border-red-500/30 transition-all duration-500">
                <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                    <span class="text-4xl font-black">02</span>
                </div>
                <div class="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center mb-6 border border-red-500/20">
                    <span class="text-xl">💀</span>
                </div>
                <h3 class="text-white font-black text-lg mb-3 tracking-tight">灵魂暴击</h3>
                <p class="text-sm text-gray-500 leading-relaxed">
                    接入自定义 AI 毒舌引擎，精准捕捉你的代码槽点，<br />
                    生成让你无法反驳的赛博灵魂拷问。
                </p>
            </div>

            <!-- 赛博标签 -->
            <div class="group relative glass p-8 border border-white/5 hover:border-teal-500/30 transition-all duration-500">
                <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                    <span class="text-4xl font-black">03</span>
                </div>
                <div class="w-10 h-10 bg-teal-500/10 rounded-xl flex items-center justify-center mb-6 border border-teal-500/20">
                    <span class="text-xl">🏷️</span>
                </div>
                <h3 class="text-white font-black text-lg mb-3 tracking-tight">年度热词</h3>
                <p class="text-sm text-gray-500 leading-relaxed">
                    基于所选年度数据建模，提取极具幽默感的身份标签，<br />
                    一键生成高保真数字名片与社交海报。
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { AnalysisRequest, Platform } from '../types'
import { AI_PROVIDER_TEMPLATES, readAISettings, saveAISettings, testAISettings, type AIProviderTemplate, type AISettings } from '../services/ai'
import { readPlatformTokens, savePlatformTokens, type PlatformTokens } from '../services/reportData'

const props = defineProps<{
    isLoading: boolean
}>()

const emit = defineEmits<{
    startAnalysis: [request: AnalysisRequest]
    showError: [message: string]
    showAbout: []
}>()

const username = ref('')
const platform = ref<Platform>('github')
const year = ref(new Date().getFullYear())
const minYear = 2008
const nextYear = new Date().getFullYear() + 1
const yearOptions = Array.from({ length: nextYear - minYear + 1 }, (_, index) => nextYear - index)
const showAISettings = ref(false)
const aiForm = ref<AISettings>({
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: '',
    apiKey: ''
})
const platformTokens = ref<PlatformTokens>({
    github: '',
    gitee: ''
})
const isTestingAI = ref(false)
const aiTestStatus = ref<{ ok: boolean; message: string }>({
    ok: false,
    message: ''
})
const platformOptions: Array<{ label: string; value: Platform }> = [
    { label: 'GitHub', value: 'github' },
    { label: 'Gitee', value: 'gitee' }
]

const openAISettings = () => {
    aiForm.value = readAISettings() || aiForm.value
    platformTokens.value = readPlatformTokens()
    aiTestStatus.value = { ok: false, message: '' }
    showAISettings.value = true
}

const applyTemplate = (template: AIProviderTemplate) => {
    aiForm.value = {
        ...aiForm.value,
        endpoint: template.endpoint,
        model: template.model
    }
}

const saveSettings = () => {
    saveAISettings(aiForm.value)
    savePlatformTokens(platformTokens.value)
    showAISettings.value = false
}

const testCurrentAISettings = async () => {
    if (isTestingAI.value) return
    isTestingAI.value = true
    aiTestStatus.value = { ok: false, message: '' }

    try {
        aiTestStatus.value = await testAISettings(aiForm.value)
    } finally {
        isTestingAI.value = false
    }
}

const clampYear = () => {
    if (!Number.isFinite(year.value)) {
        year.value = new Date().getFullYear()
        return
    }

    year.value = Math.min(nextYear, Math.max(minYear, Math.trunc(year.value)))
}

const stepYear = (delta: number) => {
    clampYear()
    year.value = Math.min(nextYear, Math.max(minYear, year.value + delta))
}

const handleAnalysis = () => {
    if (props.isLoading) return

    if (!username.value.trim()) {
        emit('showError', '请输入有效的用户 ID')
        return
    }

    clampYear()

    if (!Number.isInteger(year.value) || year.value < minYear || year.value > nextYear) {
        emit('showError', '请输入有效的年份')
        return
    }

    emit('startAnalysis', {
        username: username.value.trim(),
        platform: platform.value,
        year: year.value
    })
}
</script>
