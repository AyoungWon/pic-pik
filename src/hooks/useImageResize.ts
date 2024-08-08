import { useEffect, useState } from "react";
import { type ResizeOption, resizeImage } from "../utils/resizeImage";

interface Props {
  file?: File;
  option: ResizeOption;
}

const useImageResize = ({ file, option }: Props) => {
  const [resizedFile, setResizedFile] = useState<File | null>(null);

  const handleResizeImage = async (file: File, option: ResizeOption) => {
    try {
      const resized = await resizeImage(file, option);
      if (resized) {
        setResizedFile(resized);
      }
    } catch (error) {
      console.error("Error resizing image:", error);
    }
  };

  useEffect(() => {
    if (file) handleResizeImage(file, option);
  }, [file, option]);

  return resizedFile;
};

export default useImageResize;
