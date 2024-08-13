import { useEffect, useMemo, useState } from "react";
import { type ResizeOption, resizeImage } from "src/utils/resizeImage";
import {
  type ImageMetadata,
  readImageMetadata,
} from "src/utils/readImageMetadata";

interface Props {
  metadata?: ImageMetadata | null;
  option: ResizeOption;
}

const useResizeImage = ({ metadata, option }: Props) => {
  const [resizedImage, setResizedImage] = useState<{
    file: File | null;
    metadata: ImageMetadata | null;
  }>({ file: null, metadata: null });

  const memoizedOption = useMemo(
    () => option,
    [
      option.mode,
      ...(option.mode === "aspectRatio" && "width" in option
        ? [option.width]
        : []),
      ...(option.mode === "aspectRatio" && "height" in option
        ? [option.height]
        : []),
      ...(option.mode === "aspectRatio" && "scale" in option
        ? [option.scale]
        : []),
      ...(option.mode === "stretch" ? [option.width, option.height] : []),
    ]
  );

  const handleResizeImage = async (
    metadata: ImageMetadata,
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
    if (metadata) handleResizeImage(metadata, memoizedOption);
  }, [metadata, memoizedOption]);

  return resizedImage;
};

export default useResizeImage;
