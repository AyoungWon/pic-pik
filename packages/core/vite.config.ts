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
      src: path.resolve(__dirname, "./src"), // 'src/~' 경로 설정
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"), // 라이브러리 진입점
      name: "PicPikCore", // 전역 변수 이름을 라이브러리 이름에 맞게 변경
      fileName: (format) => `pic-pik-core.${format}.js`, // 파일 이름을 라이브러리 이름에 맞게 변경
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
  },
});
