import { useEffect, useState } from "react";
import { type ResizeOption, resizeImage } from "../utils/resizeImage";
import {
  ImageFileMetadata,
  readImageMetadata,
} from "../utils/readImageMetadata";

interface Props {
  metadata?: ImageFileMetadata | null;
  option: ResizeOption;
}

const useImageResize = ({ metadata, option }: Props) => {
  const [resizedImage, setResizedImage] = useState<{
    file: File;
    metadata: ImageFileMetadata;
  } | null>(null);

  const handleResizeImage = async (
    metadata: ImageFileMetadata,
    option: ResizeOption
  ) => {
    try {
      const resizedFile = await resizeImage(metadata, option);
      if (resizedFile) {
        const resizedMetadata = await readImageMetadata(resizedFile);
        if (resizedMetadata)
          setResizedImage({ file: resizedFile, metadata: resizedMetadata });
      }
    } catch (error) {
      console.error("Error resizing image:", error);
    }
  };

  useEffect(() => {
    if (metadata) handleResizeImage(metadata, option);
  }, [metadata, option]);

  return resizedImage;
};

export default useImageResize;
