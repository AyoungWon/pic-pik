import { createRoot } from "react-dom/client";
import ImageUploader from "./components/image-uploader";

const App = () => (
  <div>
    <h1>PicPik Uploader</h1>
    <ImageUploader />
  </div>
);

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

export { ImageUploader };
