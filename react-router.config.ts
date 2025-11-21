import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,
  // ⚠️ 必须和 vite.config.ts 里的 REPO_NAME 一致
  basename: process.env.NODE_ENV === "production" ? "/guitar/" : "/",
} satisfies Config;