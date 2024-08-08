import { createRoot } from "react-dom/client";
import ImageLoader from "./components/image-loader";
import useImage from "./hooks/useImage";
import useResizeImage from "./hooks/useResizeImage";

const App = () => {
  const { ref, metadata: imageOriginalMetadata } = useImage();
  const { metadata } = useResizeImage({
    metadata: imageOriginalMetadata,
    option: { mode: "aspectRatio", scale: 0.2 },
  });

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <input type="file" ref={ref} />
      {imageOriginalMetadata && (
        <img
          src={imageOriginalMetadata.src}
          width={imageOriginalMetadata.width}
        />
      )}
      {metadata && <img src={metadata.src} width={metadata.width} />}
    </div>
  );
};

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

export { ImageLoader, useImage };
