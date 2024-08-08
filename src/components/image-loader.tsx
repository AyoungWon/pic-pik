import React, {
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  MouseEvent,
} from "react";
import useImageMetadata, {
  type ImageFileMetadata,
} from "../hooks/useImageMetadata";
import { type Limit } from "../utils/validate";

interface ImageLoaderProps {
  accept?: string | undefined;
  style?: React.CSSProperties | undefined;
  children?: ReactNode;
  onMetadataLoaded?: (metadata: ImageFileMetadata) => void;
  limit?: Limit;
}

const ImageLoader: React.FC<ImageLoaderProps> = ({
  accept,
  style,
  children,
  limit,
  onMetadataLoaded,
}) => {
  const { ref, imageMetadata } = useImageMetadata({ limit });
  const extendedChildren = useMemo(
    () =>
      React.Children.map(children, (child) => {
        //children에 button tag가 있을때 input click이 활성화 되도록
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
  useEffect(() => {
    if (imageMetadata && onMetadataLoaded) onMetadataLoaded(imageMetadata);
  }, [imageMetadata, onMetadataLoaded]);

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
