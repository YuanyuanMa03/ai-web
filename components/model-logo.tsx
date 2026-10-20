import {
  DeepSeekLogo,
  GoogleLogo,
  KIMILogo,
  MetaLogo,
  OpenAILogo,
  QWenLogo,
  ZhiPuLogo,
} from "@/components/logo";
import type { Brand } from "@/lib/config";

const logos: Record<Exclude<Brand, "default">, () => React.ReactNode> = {
  qwen: QWenLogo,
  zhipu: ZhiPuLogo,
  deepseek: DeepSeekLogo,
  kimi: KIMILogo,
  meta: MetaLogo,
  google: GoogleLogo,
  openai: OpenAILogo,
};

const ModelLogo = ({ brand }: { brand: Brand }) => {
  const Logo = brand === "default" ? undefined : logos[brand];

  return (
    <span className="size-4 flex items-center justify-center">
      {Logo ? (
        <Logo />
      ) : (
        <div className="bg-linear-to-br from-secondary to-primary size-4 rounded-full" />
      )}
    </span>
  );
};

export default ModelLogo;
