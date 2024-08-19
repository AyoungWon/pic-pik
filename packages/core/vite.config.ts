import { defineConfig } from "vite";
import istanbul from "vite-plugin-istanbul";
import path from "path";

export default defineConfig({
  plugins: [
    istanbul({
      cypress: true,
      requireEnv: false,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "MyUtils",
      fileName: (format) => `my-utils.${format}.js`,
    },
    rollupOptions: {
      external: [], // 필요한 외부 라이브러리를 여기에 추가
      output: {
        globals: {},
      },
    },
  },
});
