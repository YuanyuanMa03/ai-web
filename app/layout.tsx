import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import AppSidebar from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Read at build time; Vercel rebuilds on redeploy, Docker passes it as a build arg.
export function generateMetadata(): Metadata {
  return {
    title: process.env.SITE_NAME || "AI Web",
    description: "填一个免费 API Key，一键部署属于自己的 AI 对话平台。",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const cookieStore = await cookies();
  // const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="scrollbar-thumb-border scrollbar-track-transparent">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster position="top-center" richColors />

          <SidebarProvider>
            <AppSidebar />

            <SidebarInset>
              <header className="h-16 flex items-center px-4 absolute">
                <SidebarTrigger className="-ml-1 z-10" />
              </header>

              {children}
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
