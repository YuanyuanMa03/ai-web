# AI Web

[中文](./README.md) ｜ English

**Paste one free API key and deploy your own AI chat website in one click.** No server, no coding required.

![readme.png](https://github.com/user-attachments/assets/e1c4e604-568d-4778-8780-29473619744f)

## Features

- 🆓 Uses free models on [SiliconFlow](https://cloud.siliconflow.cn) by default (Qwen, GLM, DeepSeek…)
- 🔌 Works with any OpenAI-compatible API: OpenRouter, DeepSeek, ModelScope, Ollama… switch with two environment variables
- 🧠 Shows reasoning for thinking models; image upload for vision models
- 💾 Chat history stays in your browser
- 🔒 Optional access password so nobody burns your quota
- 🚀 One-click Vercel deploy, Docker supported

## Go live in three steps

1. **Get a free API key** from [SiliconFlow](https://cloud.siliconflow.cn/account/ak) (or any provider below).
2. **Click the button**, sign in to Vercel with GitHub, paste the key into `AI_API_KEY`, and click Deploy.

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYuanyuanMa03%2Fai-web&project-name=ai-web&env=AI_API_KEY&envDescription=Your%20model%20API%20key%20%28SiliconFlow%20by%20default%2C%20free%20sign-up%29&envLink=https%3A%2F%2Fcloud.siliconflow.cn%2Faccount%2Fak)

3. **Open the `xxx.vercel.app` URL** Vercel gives you and start chatting.

> To add a password or change any variable later: Vercel project → Settings → Environment Variables, then Redeploy.

## Environment variables

| Name | Description | Required |
|---|---|---|
| `AI_API_KEY` | API key of the model provider | ✅ |
| `AI_BASE_URL` | OpenAI-compatible base URL, default `https://api.siliconflow.cn/v1` | |
| `AI_MODELS` | Comma-separated models, the first is the default. Optional with SiliconFlow; **required if you change `AI_BASE_URL`** | |
| `AI_VISION_MODELS` | Comma-separated models that accept images | |
| `APP_PASSWORD` | Access password | |
| `SITE_NAME` | Site title shown in the browser tab | |

See [.env.example](./.env.example).

## Other free providers

| Provider | `AI_BASE_URL` | `AI_MODELS` example |
|---|---|---|
| SiliconFlow (default) | leave empty | leave empty, or pick models marked free in the [model list](https://cloud.siliconflow.cn/models) |
| [OpenRouter](https://openrouter.ai/keys) | `https://openrouter.ai/api/v1` | models ending in `:free`, e.g. `deepseek/deepseek-chat-v3-0324:free` |
| [ModelScope](https://modelscope.cn/my/myaccesstoken) | `https://api-inference.modelscope.cn/v1` | `Qwen/Qwen3-32B` |
| [DeepSeek](https://platform.deepseek.com/api_keys) | `https://api.deepseek.com` | `deepseek-chat,deepseek-reasoner` |
| Local [Ollama](https://ollama.com) | `http://localhost:11434/v1` | `qwen3:8b` (any non-empty `AI_API_KEY`) |

> Free models and quotas change over time; check the provider's site.

## Other ways to run

```bash
docker build -t ai-web .
docker run -d -p 3000:3000 -e AI_API_KEY=sk-xxx ai-web
```

```bash
cp .env.example .env.local   # fill in AI_API_KEY
bun install
bun dev
```

## Upgrading from the Cloudflare version

The old `CF_*`, `GOOGLE_API_KEY` and `NEXT_PUBLIC_CF_AI_GATEWAY_PROVIDERS` variables are no longer used. Chat history is kept.

## Acknowledgements

Based on [Jazee6/cloudflare-ai-web](https://github.com/Jazee6/cloudflare-ai-web). Thanks to the original author.
