import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

// ⚠️ 把这里改成你的 GitHub 仓库名，前后都要加斜杠
// 如果仓库名是 blues-guitar-app，就是 /blues-guitar-app/
const REPO_NAME = "/guitar/"; 

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? REPO_NAME : "/",
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  optimizeDeps: {
    exclude: ["@coderline/alphatab"],
  },
});