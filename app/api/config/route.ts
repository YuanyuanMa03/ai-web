import { getAIConfig, toPublicConfig } from "@/lib/config";

// Read env vars on every request so Docker users can change them without rebuilding.
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(toPublicConfig(getAIConfig()));
}
