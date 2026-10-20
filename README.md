# AI Web

中文 ｜ [English](./README.en.md)

**填一个免费的 API Key，一键部署属于自己的 AI 对话网站。** 不需要服务器，不需要会写代码。

![readme.png](https://github.com/user-attachments/assets/e1c4e604-568d-4778-8780-29473619744f)

## 特性

- 🆓 默认接入 [硅基流动](https://cloud.siliconflow.cn) 的免费模型（Qwen、GLM、DeepSeek 等），注册即用
- 🔌 兼容任意 OpenAI 格式接口：OpenRouter、DeepSeek、魔搭 ModelScope、智谱、Kimi、Ollama……改两个环境变量即可切换
- 🧠 支持显示推理模型的思考过程，支持识图模型上传图片
- 💾 聊天记录只保存在浏览器本地，不上传服务器
- 🔒 可设置访问密码，防止别人用掉你的额度
- 🚀 Vercel 一键部署，也支持 Docker

## 三步上线

### 1. 获取免费 API Key

打开 [硅基流动](https://cloud.siliconflow.cn/account/ak)，用手机号注册，在「API 密钥」页面新建一个密钥，复制以 `sk-` 开头的那串字符。

### 2. 一键部署到 Vercel

点击下面的按钮，用 GitHub 账号登录 Vercel，在提示填写 `AI_API_KEY` 的地方粘贴上一步的密钥，点击 Deploy。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYuanyuanMa03%2Fai-web&project-name=ai-web&env=AI_API_KEY&envDescription=%E5%A1%AB%E5%86%99%E4%BD%A0%E7%9A%84%E6%A8%A1%E5%9E%8B%20API%20Key%EF%BC%88%E9%BB%98%E8%AE%A4%E7%A1%85%E5%9F%BA%E6%B5%81%E5%8A%A8%EF%BC%8C%E5%8F%AF%E5%85%8D%E8%B4%B9%E6%B3%A8%E5%86%8C%EF%BC%89&envLink=https%3A%2F%2Fcloud.siliconflow.cn%2Faccount%2Fak)

### 3. 打开网站

部署完成后 Vercel 会给你一个 `xxx.vercel.app` 的网址，打开就能聊天了。

> 想设置访问密码？在 Vercel 项目的 Settings → Environment Variables 里添加 `APP_PASSWORD`，然后在 Deployments 页面点 Redeploy。修改其他环境变量也是同样操作。

## 环境变量

| 名称 | 说明 | 必填 |
|---|---|---|
| `AI_API_KEY` | 模型服务的 API Key | ✅ |
| `AI_BASE_URL` | OpenAI 兼容接口地址，默认 `https://api.siliconflow.cn/v1` | |
| `AI_MODELS` | 可选模型，英文逗号分隔，第一个为默认模型。使用默认硅基流动时可不填；**改了 `AI_BASE_URL` 就必须填** | |
| `AI_VISION_MODELS` | 支持识图的模型，英文逗号分隔（选中后会出现上传图片按钮） | |
| `APP_PASSWORD` | 访问密码 | |
| `SITE_NAME` | 网站标题（浏览器标签页上显示的名字） | |

完整示例见 [.env.example](./.env.example)。

## 换成其他免费模型服务

| 服务 | `AI_BASE_URL` | `AI_MODELS` 示例 |
|---|---|---|
| 硅基流动（默认） | 不用填 | 不用填，或从 [模型广场](https://cloud.siliconflow.cn/models) 挑选标有「免费」的模型 |
| [OpenRouter](https://openrouter.ai/keys) | `https://openrouter.ai/api/v1` | 带 `:free` 后缀的模型，如 `deepseek/deepseek-chat-v3-0324:free` |
| [魔搭 ModelScope](https://modelscope.cn/my/myaccesstoken) | `https://api-inference.modelscope.cn/v1` | `Qwen/Qwen3-32B` |
| [DeepSeek](https://platform.deepseek.com/api_keys) | `https://api.deepseek.com` | `deepseek-chat,deepseek-reasoner` |
| 本地 [Ollama](https://ollama.com) | `http://localhost:11434/v1` | `qwen3:8b`（`AI_API_KEY` 随便填一个） |

> 各平台的免费模型和额度会调整，以平台官网为准。如果遇到「模型不存在」或「额度已用完」的提示，换一个模型即可。

## 其他部署方式

### Docker

```bash
docker build -t ai-web .   # 自定义标题：--build-arg SITE_NAME=我的AI
docker run -d -p 3000:3000 -e AI_API_KEY=sk-xxx ai-web
```

### 本地运行

```bash
cp .env.example .env.local   # 填入 AI_API_KEY
bun install
bun dev
```

## 常见问题

- **页面提示「还差一步：配置模型 API Key」**：没有设置 `AI_API_KEY`，或者改了 `AI_BASE_URL` 却没设置 `AI_MODELS`。设置后要重新部署。
- **提示 API Key 无效**：检查 Key 有没有复制完整、有没有多余的空格。
- **提示额度用完 / 请求太频繁**：免费模型有调用频率限制，稍等一会儿或换一个模型。
- **从旧版（Cloudflare 版）升级**：`CF_*` 等旧环境变量已不再使用，可以删除；聊天记录会保留。

## 致谢

本项目基于 [Jazee6/cloudflare-ai-web](https://github.com/Jazee6/cloudflare-ai-web)，感谢原作者的开源贡献。
