import { useEffect, useRef, useState } from "react";
import { type Limit } from "src/utils/validate";
import {
  type ImageMetadata,
  readImageMetadata,
} from "src/utils/readImageMetadata";

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

const useImage = ({ limit }: Props | undefined = {}) => {
  const ref = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<{
    file: File | null;
    metadata: ImageMetadata | null;
  }>({ file: null, metadata: null });

  const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      const metadata = await readImageMetadata(file, limit);

      setImage({ file, metadata });
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

  return { ref, metadata: image.metadata, file: image.file };
};

export default useImage;
