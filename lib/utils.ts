import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Kept from the original project so existing users keep their selection.
export const MODEL_STORAGE_KEY = "CF_AI_MODEL";
export const PASSWORD_STORAGE_KEY = "CF_AI_PASSWORD";
