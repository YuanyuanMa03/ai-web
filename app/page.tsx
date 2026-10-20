"use client";

import { generateId } from "ai";
import { useRouter } from "next/navigation";
import { useCallback, ViewTransition } from "react";
import ChatInput, { type onSendMessageProps } from "@/components/chat-input";
import Footer from "@/components/footer";
import SetupNotice from "@/components/setup-notice";
import { TextEffect } from "@/components/ui/text-effect";
import { db } from "@/lib/db";
import { useAIConfig } from "@/hooks/use-ai-config";

export default function Home() {
  const router = useRouter();
  const { config, error } = useAIConfig();

  const onSendMessage = useCallback(
    async (data: onSendMessageProps) => {
      const { text, files } = data;

      const sessionId = crypto.randomUUID();
      await db.session.add({
        updatedAt: new Date(),
        name: text.slice(0, 20),
        id: sessionId,
      });
      await db.message.add({
        id: generateId(),
        parts: [
          ...(files ?? []),
          {
            type: "text",
            text,
          },
        ],
        role: "user",
        sessionId,
        createdAt: new Date(),
      });

      router.replace(`/c/${sessionId}?new`);
    },
    [router],
  );

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex flex-col justify-center h-full w-full space-y-4 px-4">
        <div className="font-bold text-2xl mx-auto font-mono">
          <TextEffect per="word" preset="fade-in-blur">
            今天想聊点什么？
          </TextEffect>
        </div>
        <SetupNotice
          config={config}
          error={error}
          className="mx-auto max-w-3xl"
        />
        <ViewTransition name="chat-input">
          <ChatInput
            models={config?.models ?? []}
            className="mx-auto max-w-3xl"
            onSendMessage={onSendMessage}
          />
        </ViewTransition>
      </div>

      <Footer classname="mt-auto mb-1" />
    </div>
  );
}
