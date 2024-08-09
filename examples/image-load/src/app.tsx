import React, { useState } from "react";
import { type ImageMetadata, ImageLoader } from 'pic-pik"';

const App = () => {
  const [imageMetadata, setMetadata] = useState<ImageMetadata>();

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <ImageLoader
        accept=".jpg, .jpeg"
        onMetadataLoaded={(data) => {
          setMetadata(data);
        }}
        limit={{
          width: {
            max: 3000,
            onError: (error) => {
              window.alert(
                `${error.field}의 ${error.max}을 초과하였습니다. 선택된 파일의 ${error.field}:${error.selectedFileValue}`
              );
            },
          },
          height: 3000,
        }}
      >
        <button>
          {imageMetadata ? "reselect Image File" : "Select Image File"}
        </button>
      </ImageLoader>
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
