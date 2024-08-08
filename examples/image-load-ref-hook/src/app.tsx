import React from "react";
import { useImageMetadata } from 'pic-pik"';

const App = () => {
  const { ref, imageMetadata } = useImageMetadata({
    limit: {
      width: 1000,
      height: { max: 2000, onError: (error) => console.log(error) },
    },
  });
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <input ref={ref} type="file" accept=".jpg, .jpeg" />
      {imageMetadata && (
        <img
          style={{ width: imageMetadata.width, height: imageMetadata.height }}
          src={imageMetadata.src}
          alt="image file"
        />
      )}
    </div>
  );
};

export default App;
