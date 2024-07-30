/** @jsxImportSource @emotion/react */
import React, { ChangeEvent } from "react";

interface ImageUploaderProps {}

const ImageUploader: React.FC<ImageUploaderProps> = ({}) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
    }
  };

  return <input type="file" onChange={handleFileChange} />;
};

export default ImageUploader;
