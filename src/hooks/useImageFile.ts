import { useEffect, useRef, useState } from "react";
export const checkFileType = (inputEl: HTMLInputElement) => {
  if (inputEl.type === "file") return true;
  else {
    console.error("The input type is not file");
    return false;
  }
};

const useImageFile = () => {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) setFile(file);
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

  return { ref, file };
};
