import { CircleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { PublicConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

const SetupNotice = ({
  config,
  error,
  className,
}: {
  config?: PublicConfig;
  error?: boolean;
  className?: string;
}) => {
  if (error) {
    return (
      <Alert variant="destructive" className={cn(className)}>
        <CircleAlert />
        <AlertTitle>无法读取站点配置</AlertTitle>
        <AlertDescription>请刷新页面重试。</AlertDescription>
      </Alert>
    );
  }

  if (!config || config.configured) return null;

  return (
    <Alert className={cn(className)}>
      <CircleAlert />
      <AlertTitle>还差一步：配置模型 API Key</AlertTitle>
      <AlertDescription>
        <p>
          在部署平台（如 Vercel 的 Settings → Environment Variables）添加
          <code className="mx-1 font-mono">AI_API_KEY</code>
          后重新部署即可使用。
          {config.models.length === 0 &&
            "你修改了 AI_BASE_URL，还需要同时设置 AI_MODELS。"}
        </p>
        <p>
          没有 Key？可以在
          <a
            href="https://cloud.siliconflow.cn/account/ak"
            target="_blank"
            rel="noopener"
            className="mx-1 underline underline-offset-4"
          >
            硅基流动
          </a>
          免费注册获取。
        </p>
      </AlertDescription>
    </Alert>
  );
};

export default SetupNotice;
