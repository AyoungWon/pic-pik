import React from "react";
import { useImage, useResizeImage } from "@pic-pik/react";

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

export default App;
