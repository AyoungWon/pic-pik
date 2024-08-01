import { createRoot } from "react-dom/client";
import ImageUploader from "./components/image-uploader";

const App = () => (
  <div>
    <h1>PicPik Uploader</h1>
    <ImageUploader
      accept=".jpg"
      onMetadataLoaded={(data) => {
        console.log(data);
      }}
      validateOptions={{
        width: {
          max: 500,
        },
        height: 3000,
      }}
    >
      click
    </ImageUploader>
  </div>
);

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

export { ImageUploader };
