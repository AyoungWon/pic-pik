import { HTMLAttributes } from "react";
import useImage from "../../../hooks/useImage";
import useResizeImage from "../../../hooks/useResizeImage";
import { ResizeOption } from "../../../utils/resizeImage";

interface Props extends HTMLAttributes<HTMLDivElement> {
  option: ResizeOption;
}

const ResizeImage = ({ option }: Props) => {
  const { ref, metadata } = useImage();
  const { metadata: resizedMetadata, file } = useResizeImage({
    metadata,
    option,
  });
  return (
    <div>
      <input type="file" ref={ref} />
      {metadata && (
        <div id="metadata">
          <p id="width">Width: {metadata.width}</p>
          <p id="height">Height: {metadata.height}</p>
          <p id="size">Size: {metadata.size}</p>
          <p id="name">Name: {metadata.name}</p>
          <p id="extension">Extension: {metadata.extension}</p>
        </div>
      )}
      {resizedMetadata ? (
        <div id="resized-metadata">
          <p id="width">Width: {resizedMetadata.width}</p>
          <p id="height">Height: {resizedMetadata.height}</p>
          <p id="size">Size: {resizedMetadata.size}</p>
          <p id="name">Name: {resizedMetadata.name}</p>
          <p id="extension">Extension: {resizedMetadata.extension}</p>
          <img src={resizedMetadata.src} width={resizedMetadata.width} />
        </div>
      ) : (
        <p>리사이즈할 이미지를 선택하세요.</p>
      )}
    </div>
  );
};

export default ResizeImage;
