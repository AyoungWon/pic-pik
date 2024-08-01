/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { ChangeEvent, useState } from "react";

//label의 스타일 받기
//input에 들어갈 props 받기
//children 받아서 label에 넣어주기
interface ImageUploaderProps {}

export interface ImageFileMetadata {
  height: number;
  width: number;
  size: number;
  name: string;
  extension: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({}) => {
  const [imageMetadata, setImageMetadata] = useState<ImageFileMetadata | null>(
    null
  );
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const target = e.target as FileReader;

      const image = new Image();
      image.src = target.result as string;
      image.onload = () => {
        const { height, width } = image;
        const totalSizeKB = Math.ceil(e.total / 1024);
        const fileName = event.target.files?.[0].name ?? "";
        const fileExtension = (fileName.split(".").pop() ?? "").toLowerCase();
        setImageMetadata({
          height,
          width,
          size: totalSizeKB,
          name: fileName,
          extension: fileExtension,
        });
      };
    };
    const target = event.target as HTMLInputElement;

    if (target.files && target.files[0]) reader.readAsDataURL(target.files[0]);
  };

  return (
    <label htmlFor={"pic_pik_file_input"}>
      click
      <input
        id={"pic_pik_file_input"}
        type="file"
        accept="image/*"
        css={_hidden}
        onChange={handleFileChange}
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
