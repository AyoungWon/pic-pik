import { useEffect, useMemo, useState } from "react";
import {
  type ResizeOption,
  resizeImage,
  type ImageMetadata,
  readImageMetadata,
} from "@pic-pik/core";

interface Props {
  metadata?: ImageMetadata | null;
  option: ResizeOption;
}

/**
 * 커스텀 훅 `useResizeImage`는 주어진 이미지 메타데이터와 리사이즈 옵션에 따라 이미지를 리사이즈하고,
 * 리사이즈된 이미지 파일과 그 메타데이터를 반환합니다.
 *
 * @param {Props} props - 훅의 매개변수 객체입니다.
 * @param {ImageMetadata} [props.metadata] - 원본 이미지의 메타데이터입니다. 이미지의 소스, 너비, 높이 등을 포함합니다.
 * @param {ResizeOption} props.option - 리사이즈 옵션을 지정하는 객체입니다. 사용자가 원하는 리사이즈 모드 및 크기 정보를 포함합니다.
 *
 * @returns {{file: File | null, metadata: ImageMetadata | null}} 리사이즈된 이미지 파일과 그 메타데이터를 포함한 객체를 반환합니다.
 *
 * @example
 * // 컴포넌트 내에서 useResizeImage 사용 예제
 * const MyComponent = ({ metadata, option }) => {
 *   const resizedImage = useResizeImage({ metadata, option });
 *
 *   useEffect(() => {
 *     if (resizedImage.file) {
 *       console.log("Resized image file:", resizedImage.file);
 *     }
 *   }, [resizedImage]);
 *
 *   return <div>Check the console for the resized image</div>;
 * };
 */
const useResizeImage = ({ metadata, option }: Props) => {
  const [resizedImage, setResizedImage] = useState<{
    file: File | null;
    metadata: ImageMetadata | null;
  }>({ file: null, metadata: null });

  // 리사이즈 옵션을 메모이제이션하여 불필요한 리렌더링을 방지
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

  /**
   * 이미지를 리사이즈하고 결과를 상태로 저장하는 비동기 함수입니다.
   *
   * @param {ImageMetadata} metadata - 원본 이미지의 메타데이터.
   * @param {ResizeOption} option - 리사이즈 옵션을 지정하는 객체.
   */
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
