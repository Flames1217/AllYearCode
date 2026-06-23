<template>
    <div>
        <!-- 动态背景 -->
        <div class="grid-bg"></div>
        <div class="blob" style="top: 10%; right: 10%"></div>
        <div class="blob" style="bottom: 10%; left: 10%; background: var(--teal)"></div>

        <!-- 首页 -->
        <div v-if="currentPage === 'landing'" id="landingPage" class="min-h-screen flex flex-col items-center px-4 py-12 md:py-24">
            <LandingPage :is-loading="isLoading" @start-analysis="startAnalysis" @show-error="msg => showToast(msg, 'error')" @show-about="currentPage = 'about'" />

            <footer class="text-center pt-12 text-slate-500 text-xs space-y-2">
                <p>© GitHub / Gitee Year in Code. Built with ❤️ for Developers.</p>
                <p class="opacity-50 font-mono tracking-wider flex items-center justify-center gap-2">
                    <span>Powered by <span class="text-teal-400/80">Local AI Settings</span></span>
                    <span class="w-1 h-1 bg-slate-700 rounded-full"></span>
                    <a href="https://github.com/Flames1217" target="_blank" rel="noreferrer" class="hover:text-teal-400 transition-colors">github.com/Flames1217</a>
                </p>
            </footer>
        </div>

        <!-- 关于页 -->
        <div v-if="currentPage === 'about'" class="animate__animated animate__fadeIn">
            <AboutPage @back="currentPage = 'landing'" />
        </div>

        <!-- 报告页 -->
        <div v-if="currentPage === 'report'" id="reportPage" class="animate__animated animate__fadeIn px-2 md:px-4 py-4 md:py-8">
            <ReportPage :user-data="userData" :ai-content="aiContent" :is-loading="isLoading" @back-to-home="backToHome" @download-poster="downloadPoster" />
        </div>

        <!-- 弹窗通知 -->
        <Toast :visible="toast.visible" :message="toast.message" :type="toast.type" @close="toast.visible = false" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LandingPage from './components/LandingPage.vue'
import ReportPage from './components/ReportPage.vue'
import AboutPage from './components/AboutPage.vue'
import Toast from './components/Toast.vue'
import * as htmlToImage from 'html-to-image'
import type { AnalysisRequest, UserData } from './types'
import { callMimoAI } from './services/ai'
import { fetchReportData, normalizeUsername } from './services/reportData'

// 响应式数据
const currentPage = ref<'landing' | 'report' | 'about'>('landing')
const userData = ref<Partial<UserData>>({})
const aiContent = ref<{ analysis: string; critique: string; tags: string[] }>({
    analysis: '',
    critique: '',
    tags: []
})
const isLoading = ref(false)

// Toast 状态
const toast = ref({
    visible: false,
    message: '',
    type: 'error' as 'error' | 'success'
})

const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    toast.value = { visible: true, message, type }
    setTimeout(() => {
        toast.value.visible = false
    }, 4000)
}

// 开始分析
const startAnalysis = async ({ username, platform, year }: AnalysisRequest) => {
    if (isLoading.value) return
    const normalizedUsername = normalizeUsername(username, platform)

    if (!normalizedUsername) {
        showToast('请输入有效的用户 ID', 'error')
        return
    }

    isLoading.value = true

    try {
        const reportData = await fetchReportData(platform, normalizedUsername, year)
        userData.value = reportData
        showToast(`成功获取 ${normalizedUsername} 的数据`, 'success')
        currentPage.value = 'report'

        const aiInputData = {
            login: reportData.login || normalizedUsername,
            stars: reportData.totalStars || 0,
            lang: reportData.topLang || 'Unknown',
            topRepo: reportData.starRepoName || 'N/A',
            platformLabel: reportData.platformLabel || (platform === 'github' ? 'GitHub' : 'Gitee'),
            year,
            totalContributions: reportData.totalContributions,
            longestStreak: reportData.longestStreak,
            mostActiveMonth: reportData.mostActiveMonth,
            mostActiveDay: reportData.mostActiveDay,
            publicRepos: reportData.public_repos,
            followers: reportData.followers_count,
            topLangs: (reportData.languageStats || []).map(l => l.label)
        }

        const [analysis, critique, tagsStr] = await Promise.all([callMimoAI('analysis', aiInputData), callMimoAI('critique', aiInputData), callMimoAI('tags', aiInputData)])

        const tags = tagsStr
            .replace(/[\[\]"]/g, '')
            .split(/[,，\s]+/)
            .filter((t: string) => t.trim())
            .slice(0, 10)

        // 打字机效果
        typeWriter(analysis, critique, tags)
    } catch (err) {
        showToast('数据溯源失败：' + err, 'error')
        backToHome()
    } finally {
        isLoading.value = false
    }
}

// 打字机效果
const typeWriter = (analysis: string, critique: string, tags: string[]) => {
    aiContent.value = { analysis: '', critique: '', tags: tags }

    let i = 0
    const analysisTimer = setInterval(() => {
        if (i < analysis.length) {
            aiContent.value.analysis += analysis.charAt(i)
            i++
        } else {
            clearInterval(analysisTimer)

            let j = 0
            const critiqueTimer = setInterval(() => {
                if (j < critique.length) {
                    aiContent.value.critique += critique.charAt(j)
                    j++
                } else {
                    clearInterval(critiqueTimer)
                }
            }, 30)
        }
    }, 30)
}

// 返回首页
const backToHome = () => {
    currentPage.value = 'landing'
    userData.value = {}
    aiContent.value = { analysis: '', critique: '', tags: [] }
}

// 下载海报
const downloadPoster = async () => {
    const captureArea = document.getElementById('captureArea')
    if (!captureArea) return

    try {
        // 1. 预处理：确保所有图片都已加载
        const images = captureArea.querySelectorAll('img')
        await Promise.all(
            Array.from(images).map(img => {
                if (img.complete) return Promise.resolve()
                return new Promise(resolve => {
                    img.onload = resolve
                    img.onerror = resolve
                })
            })
        )

        // 2. 使用 html-to-image 捕获
        // html-to-image 会保留 backdrop-blur 和大部分现代 CSS
        const dataUrl = await htmlToImage.toPng(captureArea, {
            backgroundColor: '#030712',
            pixelRatio: 2,
            skipAutoScale: true,
            cacheBust: true,
            style: {
                borderRadius: '0',
                margin: '0',
                transform: 'none',
                left: '0',
                top: '0',
                position: 'relative'
            }
        })

        // 3. 执行下载
        const link = document.createElement('a')
        link.download = `${userData.value.platformLabel || 'Code'}-Trace-${userData.value.year || 'Year'}-${userData.value.login || 'user'}.png`
        link.href = dataUrl
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    } catch (error) {
        console.error('截图失败:', error)
        showToast('海报生成失败，请尝试在电脑端操作或直接截图分享。', 'error')
    }
}

// 加载外部CSS
onMounted(() => {
    // 加载 animate.css
    const animateLink = document.createElement('link')
    animateLink.rel = 'stylesheet'
    animateLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css'
    document.head.appendChild(animateLink)
})
</script>
