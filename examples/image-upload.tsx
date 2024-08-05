import React from "react";
import ImageUploader from "../src/components/image-uploader"; //배포하고 path 바꾸기
import { useState } from "react";
import { type ImageFileMetadata } from "../src/hooks/useImageMetadata"; //배포하고 path 바꾸기

const ImageUploadSample = () => {
  const [imageMetadata, setMetadata] = useState<ImageFileMetadata>();

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <ImageUploader
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
      </ImageUploader>
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

export default ImageUploadSample;
