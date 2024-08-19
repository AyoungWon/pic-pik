import { useEffect, useRef, useState } from "react";
import {
  type ImageMetadata,
  type Limit,
  readImageMetadata,
  checkFileType,
} from "@pic-pik/core";

interface Props {
  limit?: Limit;
}

/**
 * 커스텀 훅 `useImage`는 파일 입력 필드에서 선택된 이미지 파일의 메타데이터를 읽고,
 * 파일과 메타데이터를 상태로 관리합니다.
 *
 * @param {Props} [props] - 훅의 매개변수 객체입니다.
 * @param {Limit} [props.limit] - 이미지 파일의 크기, 너비, 높이 등의 제한 조건을 지정하는 객체입니다.
 *
 * @returns {{ ref: React.RefObject<HTMLInputElement>, metadata: ImageMetadata | null, file: File | null }}
 * 이미지 파일의 입력 필드에 대한 참조와 선택된 이미지 파일 및 메타데이터를 반환합니다.
 *
 * @example
 * // 컴포넌트 내에서 useImage 사용 예제
 * const MyComponent = () => {
 *   const { ref, metadata, file } = useImage({ limit: { width: 1000, height: 800 } });
 *
 *   return (
 *     <div>
 *       <input ref={ref} type="file" />
 *       {metadata && <div>Image width: {metadata.width}, height: {metadata.height}</div>}
 *     </div>
 *   );
 * };
 */
const useImage = ({ limit }: Props | undefined = {}) => {
  const ref = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<{
    file: File | null;
    metadata: ImageMetadata | null;
  }>({ file: null, metadata: null });

  /**
   * 파일 입력 필드에서 파일이 변경되었을 때 호출되는 비동기 함수입니다.
   * 이미지 파일의 메타데이터를 읽고 상태를 업데이트합니다.
   *
   * @param {Event} event - 파일 입력 필드의 change 이벤트입니다.
   */
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
