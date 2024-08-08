import { useEffect, useRef, useState } from "react";
import { type Limit } from "../utils/validate";
import {
  type ImageFileMetadata,
  readImageMetadata,
} from "../utils/readImageMetadata";

interface Props {
  limit?: Limit;
}

export const checkFileType = (inputEl: HTMLInputElement) => {
  if (inputEl.type === "file") return true;
  else {
    console.error("The input type is not file");
    return false;
  }
};

const useImageMetadata = ({ limit }: Props | undefined = {}) => {
  const ref = useRef<HTMLInputElement>(null);

  const [imageMetadata, setImageMetadata] = useState<ImageFileMetadata | null>(
    null
  );

  const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      const metaData = await readImageMetadata(file, limit);
      setImageMetadata(metaData);
    }
  };

  useEffect(() => {
    const fileInput = ref.current;
    if (
      fileInput &&
      !fileInput.dataset.listenerAdded &&
      checkFileType(fileInput)
    ) {
      // 이벤트 리스너 등록
      fileInput.addEventListener("change", handleFileChange);
      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      return () => {
        fileInput.removeEventListener("change", handleFileChange);
      };
    }
  }, [ref.current]);

  return { ref, imageMetadata };
};

export default useImageMetadata;
