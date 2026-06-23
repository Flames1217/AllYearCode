# 🌌 AllYearCode - 社区维护版年度技术溯源

> **Trace Your Code Soul.** 深度解析 GitHub / Gitee 开发者行为与资产配置，接入自定义 AI 大模型，生成专属开发者的赛博灵魂名片。

[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite)](https://vitejs.dev/)
[![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Chart.js](https://img.shields.io/badge/Charts-Chart.js-FF6384?logo=chart.js)](https://www.chartjs.org/)
[![AI](https://img.shields.io/badge/AI-Local_Settings-22c55e?logo=openai)](https://github.com/Flames1217/AllYearCode)

---

## 🧭 社区维护说明

AllYearCode 基于原 `github-year-in-code` / `gitee-year-in-code` 项目继续维护。原作者仓库已不可访问，本仓库将作为社区维护版延续其设计语言、数据建模思路与年度报告体验。

在尊重原项目风格的基础上，本维护版补齐了 GitHub / Gitee 双平台、任意年份、自定义 AI、私有仓库 Token 与本地隐私配置等能力。

## ✨ 项目特性

- 🧬 **多维数据建模**：不仅是 Star 统计。通过对仓库元数据、活跃周期、协作频率及关注度分布的深度挖掘，构建完整的开发者数字画像。
- 🌗 **GitHub / Gitee 双平台**：首页默认 GitHub，可一键切换到 Gitee，适配不同开发者的真实代码阵地。
- 📅 **任意年份回顾**：不再锁定 2025。支持下拉选择、手动输入、上下加减，按指定年份生成年度技术报告。
- 🔐 **私有仓库分析**：可选填写 GitHub / Gitee Token，将当前账号可见的私有仓库纳入统计。
- 📊 **可视化数据引擎**：集成 `Chart.js`，动态渲染技术栈占比环形图与项目影响力阶梯图，让技术沉淀一目了然。
- 💀 **AI 灵魂锐评**：支持 OpenAI、Gemini、Groq、OpenRouter、SiliconFlow、DeepSeek、智谱 GLM 等 OpenAI 兼容接口，生成犀利且幽默的深度点评。
- 🧪 **AI 连接测试**：在前台设置里直接测试 Endpoint、Model 和 API Key 是否可用，避免生成报告时才发现配置错误。
- 👑 **影响力排名**：基于 Stars 与 Followers 的多权重复合算法，给出更具参考价值的 Universal Rank 排名。
- 🖼️ **高清海报导出**：基于 `html-to-image` 方案，还原 Backdrop-blur 毛玻璃质感，一键生成赛博风格分享海报。

## 🛠️ 技术架构

- **核心框架**: Vue 3 (Composition API)
- **构建工具**: Vite 7
- **开发语言**: TypeScript
- **可视化**: Chart.js (高性能 HTML5 Canvas 图表库)
- **样式方案**: Tailwind CSS (移动端优先响应式设计)
- **截图引擎**: `html-to-image` (现代 SVG 渲染方案，支持 CSS 高级特性)
- **AI 接入**: 浏览器本地配置 OpenAI 兼容 Chat Completions 接口
- **测试框架**: Vitest

## 🛡️ 安全与隐私

### 1. AI 配置本地化

为了避免社区部署后被消耗额度，本项目不内置维护者的 AI Key，也不把用户配置写入服务端：

- **本地保存**：Endpoint、Model、API Key 仅保存到当前浏览器 `localStorage`。
- **用户自备**：访问者需要使用自己的 AI 供应商配置。
- **模板预设**：内置多个主流供应商模板，方便快速填入 Endpoint 与 Model。
- **可不用 AI**：未配置 AI 时，仍可生成基础数据报告。

### 2. 平台 Token 安全

- **本地保存**：GitHub / Gitee Token 仅保存到当前浏览器。
- **直连平台**：GitHub / Gitee 数据请求由浏览器直连官方 API，不经过第三方中转。
- **最小权限**：如需统计私有仓库，建议创建只读、最小权限 Token。

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/Flames1217/AllYearCode.git
cd AllYearCode
```

### 2. 安装依赖

```bash
npm install
```

### 3. 本地开发

```bash
npm run dev
```

### 4. 生产构建

```bash
npm run build
```

### 5. 运行测试

```bash
npm test
```

## 📦 项目结构

```text
src/
├── components/          # 核心 UI 组件
│   ├── LandingPage.vue  # 沉浸式首页、平台/年份/AI 设置入口
│   ├── ReportPage.vue   # 溯源报告页、可视化图表、AI 解析与海报导出
│   ├── AboutPage.vue    # 项目背景与维护说明
│   ├── Toast.vue        # 统一状态反馈通知
│   └── MarkdownText.vue # AI 内容渲染
├── services/            # GitHub / Gitee 数据分析与 AI 调用
├── types/               # TypeScript 类型定义
├── App.vue              # 核心业务逻辑、API 调度与状态管理
└── main.ts              # 应用入口
```

## 📸 技术细节与优化

- **毛玻璃适配**：使用 `html-to-image` 生成分享图，尽量保持导出效果与 UI 视觉一致。
- **双平台抽象**：将 GitHub / Gitee 数据读取、仓库归一化、年份过滤和 Token 读取收敛到统一服务层。
- **年份过滤**：按仓库创建时间与更新时间判断指定年份活跃状态，不再只面向单一年份。
- **AI 可替换**：通过前台配置 OpenAI 兼容接口，降低供应商绑定，方便接入免费层或自建模型。
- **隐私优先**：所有敏感配置留在访问者自己的浏览器，适合公开部署。

---

**Original idea by [liu-ziting](https://github.com/liu-ziting/).**<br>
**Community maintained by [Flames1217](https://github.com/Flames1217/).**<br>
_If you like this project, give it a ⭐!_
