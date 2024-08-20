import React from "react";
import { useImage } from "@pic-pik/react";

const App = () => {
  const { ref, metadata } = useImage({
    limit: {
      width: 1000,
      height: { max: 2000, onError: (error) => console.log(error) },
    },
  });
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <input ref={ref} type="file" accept=".jpg, .jpeg" />
      {metadata && (
        <img
          style={{ width: metadata.width, height: metadata.height }}
          src={metadata.src}
          alt="image file"
        />
      )}
    </div>
  );
};

export default App;
