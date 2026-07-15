# Cloudflare AI Web

[中文](./README.md) ｜ English

![readme.png](https://github.com/user-attachments/assets/e1c4e604-568d-4778-8780-29473619744f)

## Deployment

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYuanyuanMa03%2Fai-web&demo-title=Cloudflare%20AI%20Web&demo-url=https%3A%2F%2Fai-web-blond-three.vercel.app)

Example: https://ai-web-blond-three.vercel.app

> It may not respond when the quota is used up, it is recommended to deploy it yourself

## Features

- Quickly build a multimodel AI platform using Cloudflare Workers AI
- Support Cloudflare AI Gateway to access models such as Gemini
- Support fast deployment with Serverless
- Chat history is stored locally
- Support setting access password

## Deployment Instructions

### Environment Variables

| Name                                | Description                      | Required |
|-------------------------------------|----------------------------------|----------|
| CF_ACCOUNT_ID                       | Cloudflare Account ID            | ✅        |  
| CF_WORKERS_AI_TOKEN                 | Cloudflare Workers AI Token      | ✅        |
| APP_PASSWORD                        | Access Password                  |          |
| CF_AI_GATEWAY_NAME                  | Cloudflare AI Gateway Name       |          |
| CF_AI_GATEWAY_TOKEN                 | Cloudflare AI Gateway Auth Token |          |
| NEXT_PUBLIC_CF_AI_GATEWAY_PROVIDERS | Cloudflare AI Gateway Providers  |          |
| GOOGLE_API_KEY                      | Google AI Studio Token           |          |

#### CF_WORKERS_AI_TOKEN

- Manage Account - Account API Tokens - Create Token - Create with Workers AI template

#### NEXT_PUBLIC_CF_AI_GATEWAY_PROVIDERS

Supported providers:

- google

Multiple providers are separated by commas

## Acknowledgements

This project is based on [Jazee6/cloudflare-ai-web](https://github.com/Jazee6/cloudflare-ai-web). Thanks to the original author for the open-source contribution.
