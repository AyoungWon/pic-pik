import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts",
    coverage: {
      include: ["src/**"], // 'src' 폴더만 커버리지에 포함
    },
  },
});
