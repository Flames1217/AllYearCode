# AllYearCode

> GitHub / Gitee 年度代码回顾生成器。选择平台、输入用户名和年份，生成属于开发者自己的年度报告、AI 总结与分享海报。

AllYearCode 基于公开仓库数据和可选的个人 Token，分析开发者在指定年份里的仓库活跃度、语言偏好、项目影响力与技术轨迹。AI 配置完全保存在浏览器本地，适合个人使用，也适合自己部署后分享给别人使用。

## 特性

- **双平台分析**：支持 GitHub 和 Gitee，并默认优先 GitHub。
- **任意年份**：不锁死 2025，可选择、输入或加减年份。
- **私有仓库支持**：可配置 GitHub / Gitee Token，把当前账号可见的私有仓库纳入分析。
- **本地 AI 配置**：Endpoint、Model、API Key 只保存在当前浏览器 `localStorage`，不会写入服务端。
- **主流 AI 模板**：内置 OpenAI、Gemini、Groq、OpenRouter、SiliconFlow、DeepSeek、智谱 GLM 等模板，包含部分免费层友好的选择。
- **AI 连接测试**：保存前可直接测试当前模型配置是否可用。
- **报告与海报**：生成年度数据报告、技术栈图表、AI 叙事总结和分享海报。

## 隐私与费用

AllYearCode 不内置作者的 AI Key，也不会把用户填写的 Key 或平台 Token 上传到项目服务端。

- AI Key 和平台 Token 仅存储在当前浏览器。
- GitHub / Gitee 数据由浏览器直接请求官方 API。
- 不配置 AI 时，也可以生成基础数据报告。
- 自行部署后，访问者需要使用自己的 AI 配置，避免消耗部署者额度。

## 快速开始

```bash
npm install
npm run dev
```

默认开发地址：

```text
http://localhost:5173
```

## 常用命令

```bash
npm test
npm run build
npm run preview
```

## 使用建议

公开仓库分析无需 Token。若希望统计私有仓库，请在首页的 **AI 设置** 中填入对应平台 Token。

GitHub 推荐使用 fine-grained token，并只授予读取仓库元数据与代码统计所需的最小权限。Gitee 同理，按最小权限创建私人令牌即可。

## 技术栈

- Vue 3
- Vite
- TypeScript
- Tailwind CSS
- Chart.js
- Vitest

## 维护者

[Flames1217](https://github.com/Flames1217)
