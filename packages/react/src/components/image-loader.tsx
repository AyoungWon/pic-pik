import React, {
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  MouseEvent,
} from "react";
import useImage from "src/hooks/useImage";
import { type Limit, type ImageMetadata } from "@pic-pik/core";

interface ImageLoaderProps {
  accept?: string | undefined;
  style?: React.CSSProperties | undefined;
  children?: ReactNode;
  onMetadataLoaded?: (metadata: ImageMetadata) => void;
  limit?: Limit;
}

/**
 * `ImageLoader` 컴포넌트는 파일 입력 필드와 이를 트리거할 수 있는 자식 요소를 포함합니다.
 * 사용자가 이미지 파일을 선택하면 메타데이터를 읽고, 필요에 따라 제한 조건을 적용합니다.
 *
 * @param {string} [accept] - 입력 필드에서 허용할 파일 유형(예: "image/*").
 * @param {React.CSSProperties} [style] - 컴포넌트의 스타일을 지정하는 객체.
 * @param {ReactNode} [children] - 컴포넌트 내부에 렌더링할 자식 요소.
 * @param {Limit} [limit] - 이미지 파일의 크기, 너비, 높이 등의 제한 조건을 지정하는 객체.
 * @param {(metadata: ImageMetadata) => void} [onMetadataLoaded] - 이미지 메타데이터가 로드된 후 호출되는 콜백 함수.
 *
 * @returns {ReactElement} 파일 입력 필드와 자식 요소를 포함한 `ImageLoader` 컴포넌트를 반환합니다.
 *
 * @example
 * const handleMetadataLoaded = (metadata) => {
 *   console.log('Image metadata:', metadata);
 * };
 *
 * <ImageLoader accept="image/*" onMetadataLoaded={handleMetadataLoaded}>
 *   <button>Upload Image</button>
 * </ImageLoader>
 */
const ImageLoader: React.FC<ImageLoaderProps> = ({
  accept,
  style,
  children,
  limit,
  onMetadataLoaded,
}) => {
  const { ref, metadata } = useImage({ limit });

  // 자식 요소에 파일 입력 필드를 트리거하는 onClick 이벤트를 추가
  const extendedChildren = useMemo(
    () =>
      React.Children.map(children, (child) => {
        // children에 button 태그가 있을 때 input 클릭이 활성화되도록 처리
        if (isValidElement(child) && child.type === "button") {
          const originalClickEvent = child.props.onClick;

          // 새로운 onClick 핸들러로 클론
          return cloneElement(child as ReactElement<any>, {
            onClick: (e: MouseEvent<HTMLButtonElement>) => {
              if (ref.current) ref.current.click();
              if (originalClickEvent) {
                originalClickEvent(e);
              }
            },
          });
        }
        return child;
      }),
    [children]
  );

  // 이미지 메타데이터가 로드되면 onMetadataLoaded 콜백을 호출
  useEffect(() => {
    if (metadata && onMetadataLoaded) onMetadataLoaded(metadata);
  }, [metadata, onMetadataLoaded]);

  return (
    <label style={style}>
      <input
        type="file"
        accept={accept}
        style={{
          visibility: "hidden",
          maxWidth: 0,
          maxHeight: 0,
          overflow: "hidden",
        }}
        ref={ref}
      />
      {extendedChildren}
    </label>
  );
};

export default ImageLoader;
