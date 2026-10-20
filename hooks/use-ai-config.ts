"use client";

import { useEffect, useState } from "react";
import type { PublicConfig } from "@/lib/config";

let cached: Promise<PublicConfig> | undefined;

const loadConfig = () => {
  cached ??= fetch("/api/config")
    .then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json() as Promise<PublicConfig>;
    })
    .then((config) => {
      // Re-check next time until the site is set up.
      if (!config.configured) cached = undefined;
      return config;
    })
    .catch((error) => {
      cached = undefined;
      throw error;
    });
  return cached;
};

export function useAIConfig() {
  const [config, setConfig] = useState<PublicConfig>();
  const [error, setError] = useState(false);

  useEffect(() => {
    loadConfig()
      .then(setConfig)
      .catch(() => setError(true));
  }, []);

  return { config, error };
}
