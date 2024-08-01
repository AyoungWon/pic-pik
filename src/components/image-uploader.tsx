/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useEffect } from "react";
import useImageMetadata from "../hooks/useImageMetadata";

//TODO
//label의 스타일 받기
//input에 들어갈 props 받기
//children 받아서 label에 넣어주기
//imageMetadata 로드에 대한 콜백 받기
interface ImageUploaderProps {}

const ImageUploader: React.FC<ImageUploaderProps> = ({}) => {
  const { ref, imageMetadata } = useImageMetadata();
  useEffect(() => {
    console.log(imageMetadata);
  }, [imageMetadata]);

  return (
    <label htmlFor={"pic_pik_file_input"}>
      click
      <input
        id={"pic_pik_file_input"}
        type="file"
        accept="image/*"
        css={_hidden}
        ref={ref}
      />
    </label>
  );
};

export default ImageUploader;

const _hidden = css`
  visibility: hidden;
  max-width: 0;
  max-height: 0;
  overflow: hidden;
`;
