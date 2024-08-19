// cypress.config.js 또는 cypress.config.ts
import { defineConfig } from "cypress";
import codeCoverageTask from "@cypress/code-coverage/task";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config); // 코드 커버리지 태스크 추가
      return config;
    },
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
  },
  component: {
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config); // 코드 커버리지 태스크 추가
      return config;
    },
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
