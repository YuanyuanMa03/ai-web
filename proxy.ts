import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  if (!process.env.APP_PASSWORD) {
    return NextResponse.next();
  }
  const password = request.headers.get("Authorization");
  if (password !== process.env.APP_PASSWORD) {
    return new Response("Unauthorized", { status: 401 });
  }
  return NextResponse.next();
}

// /api/config only exposes model names, so it stays public.
export const config = {
  matcher: "/api/chat",
};
