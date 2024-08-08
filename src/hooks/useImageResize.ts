import { useEffect, useState } from "react";
import { type ResizeOption, resizeImage } from "../utils/resizeImage";
import { ImageFileMetadata } from "../utils/readImageMetadata";

interface Props {
  metadata?: ImageFileMetadata | null;
  option: ResizeOption;
}

const useImageResize = ({ metadata, option }: Props) => {
  const [resizedFile, setResizedFile] = useState<File | null>(null);

  const handleResizeImage = async (
    metadata: ImageFileMetadata,
    option: ResizeOption
  ) => {
    try {
      const resized = await resizeImage(metadata, option);
      if (resized) {
        setResizedFile(resized);
      }
    } catch (error) {
      console.error("Error resizing image:", error);
    }
  };

  useEffect(() => {
    if (metadata) handleResizeImage(metadata, option);
  }, [metadata, option]);

  return { resizedFile };
};

export default useImageResize;
