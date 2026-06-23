# CodeYear Pulse

CodeYear Pulse 是一个 GitHub / Gitee 年度代码回顾工具。输入用户名，选择年份，即可生成开发者年度数据报告、技术栈图表、AI 总结与分享海报。

## 特性

- 支持 GitHub / Gitee 双平台
- 支持任意年份分析
- 可选 GitHub / Gitee Token，把当前账号可见的私有仓库纳入分析
- AI 配置保存在浏览器 `localStorage`，不消耗部署者额度
- 内置 OpenAI、Gemini、Groq、OpenRouter、SiliconFlow、DeepSeek、智谱 GLM 模板
- 支持 AI 连接测试
- 支持报告海报导出

## 隐私

- 平台 Token 和 AI Key 只保存在当前浏览器。
- GitHub / Gitee 数据由浏览器直连官方 API。
- 未配置 AI 时仍可生成基础报告。

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 测试

```bash
npm test
```

## 维护者

[Flames1217](https://github.com/Flames1217)
