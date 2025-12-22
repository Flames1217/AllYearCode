<script setup lang="ts">
import { ref } from 'vue'
import dsImage from '../assets/ds.png'

defineEmits<{
    back: []
}>()

const showDonation = ref(false)
</script>

<template>
    <div class="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12 font-sans selection:bg-teal-500/30">
        <div class="max-w-4xl mx-auto space-y-12 animate__animated animate__fadeIn">
            <!-- Header -->
            <header class="flex items-center justify-between border-b border-slate-800 pb-8">
                <div>
                    <h1 class="text-4xl font-black bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">About</h1>
                    <p class="mt-2 text-slate-400">Gitee Trace Soul</p>
                </div>
                <button @click="$emit('back')" class="px-4 py-2 rounded-full border border-slate-700 hover:bg-slate-800 transition-colors flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    返回首页
                </button>
            </header>

            <!-- Intro Section -->
            <section class="space-y-6">
                <div class="glass p-8 rounded-3xl border border-slate-800 bg-slate-900/50">
                    <h2 class="text-2xl font-bold mb-4 flex items-center gap-3"><span class="text-teal-400">🚀</span> 项目初衷</h2>
                    <p class="leading-relaxed text-slate-300">
                        Gitee 2025 Year in Code 是一个专注于开发者行为建模的年度回顾工具。不同于传统的数据罗列，我们通过 AI
                        深度扫描你的公开仓库<strong>资产配置、技术栈演进及开源影响力</strong>，解码出隐藏在项目列表背后的“开发者数字人格”。
                        它不仅是一份数据报告，更是一张融合了技术深度与社交属性的“赛博灵魂名片”。
                    </p>
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                    <!-- AI Model & Edge Proxy Section -->
                    <div class="glass p-8 rounded-3xl border border-slate-800 bg-slate-900/50">
                        <h2 class="text-2xl font-bold mb-4 flex items-center gap-3"><span class="text-purple-400">🧠</span> AI 模型与调度网关</h2>
                        <ul class="space-y-4 text-sm">
                            <li class="flex items-start gap-3">
                                <div class="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5"></div>
                                <div>
                                    <strong class="text-slate-100">主模型: Xiaomi Mimo-v2-flash</strong>
                                    <p class="text-slate-400 mt-1">提供极速且精准的语义分析，擅长捕捉技术栈的细微变化。</p>
                                </div>
                            </li>
                            <li class="flex items-start gap-3">
                                <div class="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                                <div>
                                    <strong class="text-slate-100">备用模型: Zhipu GLM-4v-flash</strong>
                                    <p class="text-slate-400 mt-1">作为高可靠性的备份方案，确保在高并发期间服务依然稳定。</p>
                                </div>
                            </li>
                            <li class="flex items-start gap-3">
                                <div class="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5"></div>
                                <div>
                                    <strong class="text-slate-100">AI 调度网关 (Edge Proxy)</strong>
                                    <p class="text-slate-400 mt-1">基于 Cloudflare Workers 部署的边缘调度层，实时监控模型可用性并进行智能流量分发与 Fallback。</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <!-- How to get Gitee ID Section -->
                    <div class="glass p-8 rounded-3xl border border-slate-800 bg-slate-900/50">
                        <h2 class="text-2xl font-bold mb-4 flex items-center gap-3"><span class="text-amber-400">🔍</span> 如何获取 Gitee ID？</h2>
                        <div class="space-y-4">
                            <p class="text-sm text-slate-300">在首页搜索框中，您需要输入的是您的 Gitee 用户名（ID），而不是完整的个人主页链接。</p>
                            <div class="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                                <p class="text-xs text-slate-500 mb-2 font-mono">例如您的个人主页是：</p>
                                <div class="text-sm font-mono break-all">
                                    <span class="text-slate-400">https://gitee.com/</span
                                    ><span class="text-amber-400 font-bold underline decoration-amber-500/50 underline-offset-4">liuziting</span
                                    ><span class="text-slate-400">/</span>
                                </div>
                                <div class="mt-4 flex items-center gap-2 text-[10px] text-amber-500/80 font-bold tracking-wider">
                                    <span class="flex h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                    输入内容即为：liuziting
                                </div>
                            </div>
                            <p class="text-[10px] text-slate-500 italic leading-relaxed">* 提示：用户名通常显示在 Gitee 个人主页头像下方，或出现在主页 URL 的末尾。</p>
                        </div>
                    </div>
                </div>

                <!-- Request Mechanism Section (Full Width) -->
                <div class="glass p-8 rounded-3xl border border-slate-800 bg-slate-900/50">
                    <h2 class="text-2xl font-bold mb-4 flex items-center gap-3"><span class="text-blue-400">🛡️</span> 请求与频率限制</h2>
                    <p class="text-sm leading-relaxed text-slate-300 mb-4">为保护隐私，所有 GitHub 公开数据的抓取均在您的浏览器端直接完成。</p>
                    <div class="grid md:grid-cols-2 gap-6">
                        <div class="bg-slate-950/30 p-4 rounded-xl border border-slate-800/50">
                            <h3 class="text-sm font-bold text-slate-100 mb-2 flex items-center gap-2">
                                <span class="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                速率限制 (Rate Limit)
                            </h3>
                            <p class="text-xs leading-relaxed text-slate-400">
                                由于 GitHub 对匿名 API 请求有严格的速率限制（通常为 <code class="text-amber-400/80">60次/小时/IP</code>），若短时间内查询频繁，可能会触发 403 错误。
                            </p>
                        </div>
                        <div class="bg-slate-950/30 p-4 rounded-xl border border-slate-800/50">
                            <h3 class="text-sm font-bold text-slate-100 mb-2 flex items-center gap-2">
                                <span class="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                                解决方案
                            </h3>
                            <p class="text-xs leading-relaxed text-slate-400">
                                如果您遇到速率限制错误，建议切换 VPN 节点（更改出口 IP）或等待一段时间后再试。本工具绝不存储您的任何个人 Token。
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Connect & Support -->
            <section v-if="false" class="glass p-8 md:p-12 rounded-[2.5rem] border border-slate-800 bg-slate-900/40 relative overflow-hidden">
                <div class="absolute -top-24 -right-24 w-64 h-64 bg-teal-500/5 blur-[100px] rounded-full"></div>
                <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/5 blur-[100px] rounded-full"></div>

                <div class="relative z-10 flex flex-col items-center gap-10">
                    <div class="text-center space-y-2">
                        <h2 class="text-2xl font-black bg-gradient-to-r from-teal-400 via-white to-purple-400 bg-clip-text text-transparent">交流与支持</h2>
                        <p class="text-xs text-slate-500 uppercase tracking-[0.2em] font-bold">Connect & Support</p>
                    </div>

                    <div class="flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-3xl">
                        <!-- Support Button -->
                        <button
                            @click="showDonation = true"
                            class="flex-1 w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-slate-800/40 hover:bg-slate-700/60 transition-all border border-slate-700 hover:border-pink-500/30 group"
                        >
                            <span class="text-xl group-hover:rotate-12 transition-transform">☕</span>
                            <span class="font-bold text-slate-200">请作者喝杯咖啡</span>
                        </button>

                        <!-- GitHub Follow -->
                        <a
                            href="https://github.com/liu-ziting"
                            target="_blank"
                            class="flex-1 w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-slate-800/40 hover:bg-slate-700/60 transition-all border border-slate-700 hover:border-teal-500/30 group"
                        >
                            <svg class="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                                />
                            </svg>
                            <span class="font-bold text-slate-200">GitHub Follow</span>
                        </a>
                    </div>

                    <div class="flex flex-col items-center gap-2">
                        <p class="text-[10px] text-slate-600 font-mono tracking-widest uppercase">Contact: lztziting0629 (WeChat)</p>
                        <div class="h-px w-12 bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
                    </div>
                </div>
            </section>

            <!-- Donation Modal -->
            <Teleport to="body">
                <div v-if="showDonation" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <!-- Backdrop -->
                    <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate__animated animate__fadeIn" @click="showDonation = false"></div>

                    <!-- Modal Content -->
                    <div
                        class="relative z-10 w-full max-w-sm glass bg-slate-900/90 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl animate__animated animate__zoomIn animate__faster"
                    >
                        <button @click="showDonation = false" class="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div class="text-center space-y-6">
                            <div class="space-y-2">
                                <h3 class="text-xl font-bold text-white">支持作者</h3>
                                <p class="text-xs text-slate-400">扫码请作者喝杯热咖啡吧 ☕</p>
                            </div>

                            <div class="relative group">
                                <div
                                    class="absolute -inset-4 bg-gradient-to-tr from-pink-500/20 to-amber-500/20 blur-2xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity"
                                ></div>
                                <div class="relative bg-white p-4 rounded-3xl shadow-inner">
                                    <img :src="dsImage" alt="Donation" class="w-full h-auto rounded-xl" />
                                    <!-- Scan Effect -->
                                    <div
                                        class="absolute inset-x-4 top-4 h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50 blur-[1px] [animation:scan_modal_2s_linear_infinite]"
                                    ></div>
                                </div>
                            </div>

                            <p class="text-[10px] text-slate-500 font-mono italic">感谢您的每一分支持，这将帮助项目持续运行</p>
                        </div>
                    </div>
                </div>
            </Teleport>

            <footer class="text-center pt-12 border-t border-slate-800 text-slate-500 text-xs space-y-2">
                <p>© 2025 GitHub Trace Soul. Built with ❤️ for Developers.</p>
                <p class="opacity-50 font-mono tracking-wider italic">
                    Crafted with <span class="text-teal-400/80">Gemini-3-Flash</span> via <span class="text-purple-400/80">VibeCoding</span>
                </p>
            </footer>
        </div>
    </div>
</template>

<style scoped>
.glass {
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
}

@keyframes scan {
    0% {
        transform: translateY(0);
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
    100% {
        transform: translateY(272px);
        opacity: 0;
    }
}

@media (min-width: 768px) {
    @keyframes scan {
        0% {
            transform: translateY(0);
            opacity: 0;
        }
        50% {
            opacity: 1;
        }
        100% {
            transform: translateY(352px);
            opacity: 0;
        }
    }
}

@keyframes scan_modal {
    0% {
        transform: translateY(0);
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
    100% {
        transform: translateY(280px);
        opacity: 0;
    }
}
</style>
