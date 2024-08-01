const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.tsx", // 진입점 파일
  output: {
    path: path.resolve(__dirname, "dist"), // 출력 디렉토리
    filename: "bundle.js", // 출력 파일 이름
    library: "PicPik", // 라이브러리 이름
    libraryTarget: "umd", // UMD 형식으로 라이브러리 출력
    umdNamedDefine: true, // AMD 환경에서 이름이 지정된 모듈로 정의
    clean: true, // 빌드 전에 output 폴더 정리
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"], // 확장자 처리 우선순위
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // .ts 또는 .tsx 파일을 처리
        use: {
          loader: "ts-loader", // ts-loader 사용
          options: {
            transpileOnly: true, // 빠른 컴파일을 위해 타입 체크 비활성화
          },
        },
        exclude: /node_modules/, // node_modules 제외
      },
      {
        test: /\.css$/, // .css 파일을 처리
        use: ["style-loader", "css-loader"], // style-loader와 css-loader 사용
      },
    ],
  },
  externals: {
    react: {
      commonjs: "react",
      commonjs2: "react",
      amd: "React",
      root: "React",
    },
    "react-dom": {
      commonjs: "react-dom",
      commonjs2: "react-dom",
      amd: "ReactDOM",
      root: "ReactDOM",
    },
  },
};
