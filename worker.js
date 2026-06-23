// github-ai-proxy 的完整代码
export default {
  async fetch(request, env) {
    // 设置 CORS 头
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*', // 或指定域名如 'http://localhost:5173'
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400',
    };

    // 处理 OPTIONS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
        status: 204
      });
    }

    // 只允许 POST 请求到 AI 接口
    const url = new URL(request.url);
    
    // 这里可以添加路由逻辑，如果你想支持多个端点
    if (url.pathname === '/' || url.pathname === '/v1/chat/completions') {
      // 处理 AI 请求
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
          status: 405,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      try {
        // 获取请求体
        let requestBody;
        try {
          requestBody = await request.text();
          const bodyObj = JSON.parse(requestBody);
          
          // 主要配置 - 小米接口
          const primaryConfig = {
            url: 'https://api.xiaomimimo.com/v1/chat/completions',
            apiKey: 'Bearer xxxx',
            model: 'mimo-v2-flash', // 小米指定模型
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer xxxx',
              'User-Agent': 'Gitee-Trace-App/1.0'
            }
          };
          
          // 备用配置 - 智谱接口
          const backupConfig = {
            url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
            apiKey: 'Bearer xxxx', // 请替换为你的智谱API密钥
            model: 'glm-4v-flash', // 智谱指定模型
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer xxxx', // 请替换为你的智谱API密钥
              'User-Agent': 'Gitee-Trace-App/1.0'
            }
          };
          
          // 尝试主接口，如果429错误则切换备用接口
          let response;
          let usedBackup = false;
          
          // 首先尝试小米接口
          console.log('Trying primary API (Xiaomi) with model:', primaryConfig.model);
          
          // 修改请求体，使用小米指定模型，忽略前端传入的model
          const modifiedBodyForPrimary = {
            ...bodyObj,
            model: primaryConfig.model // 强制使用指定模型
          };
          
          // 删除前端可能传入的model字段，确保使用我们的模型
          delete modifiedBodyForPrimary.model;
          modifiedBodyForPrimary.model = primaryConfig.model;
          
          response = await fetch(primaryConfig.url, {
            method: 'POST',
            headers: primaryConfig.headers,
            body: JSON.stringify(modifiedBodyForPrimary)
          });
          
          // 如果小米接口返回429错误，切换到智谱接口
          if (response.status === 429) {
            console.log('Primary API rate limited (429), switching to backup API...');
            usedBackup = true;
            
            // 修改请求体，使用智谱指定模型
            const modifiedBodyForBackup = {
              ...bodyObj,
              model: backupConfig.model // 强制使用智谱模型
            };
            
            // 删除前端可能传入的model字段，确保使用我们的模型
            delete modifiedBodyForBackup.model;
            modifiedBodyForBackup.model = backupConfig.model;
            
            response = await fetch(backupConfig.url, {
              method: 'POST',
              headers: backupConfig.headers,
              body: JSON.stringify(modifiedBodyForBackup)
            });
          }
          
          // 获取响应
          const responseBody = await response.text();
          
          console.log('Response status:', response.status);
          console.log('Used backup API:', usedBackup);
          console.log('Used model:', usedBackup ? backupConfig.model : primaryConfig.model);
          console.log('Response body (first 500 chars):', responseBody.substring(0, 500));
          
          // 添加调试信息到响应头
          const responseHeaders = {
            'Content-Type': 'application/json',
            ...corsHeaders,
            'X-Proxy-Info': usedBackup ? 'used-backup-api' : 'used-primary-api',
            'X-API-Provider': usedBackup ? 'zhipu-ai' : 'xiaomi-mimo',
            'X-Model-Used': usedBackup ? backupConfig.model : primaryConfig.model
          };
          
          // 返回响应
          return new Response(responseBody, {
            status: response.status,
            headers: responseHeaders
          });
          
        } catch (parseError) {
          return new Response(JSON.stringify({ 
            error: 'Invalid JSON in request body',
            details: parseError.message 
          }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }
        
      } catch (error) {
        console.error('Proxy error:', error);
        return new Response(JSON.stringify({ 
          error: 'Proxy service error',
          details: error.message 
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
    }
    
    // 其他路由处理 (GET 请求返回 HTML 介绍页)
    const html = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GitHub Trace AI Proxy</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
            body { font-family: 'Inter', sans-serif; background-color: #020617; color: #f1f5f9; }
            .glass { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(51, 65, 85, 0.5); }
            .gradient-text { background: linear-gradient(to right, #2dd4bf, #3b82f6); -webkit-background-clip: text; color: transparent; }
        </style>
    </head>
    <body class="min-h-screen flex items-center justify-center p-6">
        <div class="max-w-2xl w-full space-y-8 animate__animated animate__fadeInUp">
            <div class="text-center space-y-4">
                <h1 class="text-5xl font-black gradient-text">GitHub Trace Soul</h1>
                <p class="text-slate-400 text-lg">AI 驱动的 GitHub 年度代码溯源代理服务</p>
            </div>

            <div class="glass p-8 rounded-3xl space-y-6 shadow-2xl">
                <section>
                    <h2 class="text-xl font-bold text-teal-400 mb-2 flex items-center gap-2">
                        <span>🚀</span> 项目介绍
                    </h2>
                    <p class="text-slate-300 leading-relaxed">
                        本项目通过深度解析 GitHub Commit 数据，利用大模型生成个性化的技术画像与灵魂锐评。
                        此 Worker 节点负责处理 AI 接口的跨域中转与智能调度。
                    </p>
                </section>

                <section class="grid md:grid-cols-2 gap-4">
                    <div class="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                        <h3 class="font-bold text-blue-400 mb-1">智能调度机制</h3>
                        <p class="text-xs text-slate-400 leading-normal">
                            默认请求 <b>Xiaomi Mimo-v2</b> 接口，若遇到频率限制 (429)，将自动秒级切换至 <b>智谱 GLM-4v</b>，确保服务 99.9% 可用。
                        </p>
                    </div>
                    <div class="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                        <h3 class="font-bold text-purple-400 mb-1">隐私与安全</h3>
                        <p class="text-xs text-slate-400 leading-normal">
                            本服务仅作为透明代理，不存储任何 GitHub 令牌或私密代码。所有数据仅用于 AI 生成报告。
                        </p>
                    </div>
                </section>

                <div class="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div class="flex items-center gap-4">
                        <a href="https://github.com/Flames1217" class="text-sm text-slate-400 hover:text-white transition-colors">作者: Flames1217</a>
                        <span class="text-slate-700">|</span>
                        <span class="text-xs px-2 py-1 rounded bg-teal-500/10 text-teal-500 border border-teal-500/20">Status: Running</span>
                    </div>
                    <div class="flex gap-2">
                        <div class="text-[10px] text-slate-500 text-right">
                            Endpoints:<br/>
                            POST /v1/chat/completions
                        </div>
                    </div>
                </div>
            </div>
            
            <p class="text-center text-slate-600 text-xs">
                © 2025 GitHub Trace Soul. Powered by Cloudflare Workers.
            </p>
        </div>
    </body>
    </html>
    `;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        ...corsHeaders
      }
    });
  }
}
