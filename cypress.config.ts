import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
      viteConfig: {}, // 여기에 Vite 설정을 추가할 수 있습니다.
    },
    supportFile: "cypress/support/component.ts",
  },
});
