import React, {
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  MouseEvent,
} from "react";
import useImage from "../hooks/useImage";
import { type Limit } from "../utils/validate";
import { type ImageFileMetadata } from "../utils/readImageMetadata";

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
  const { ref, metadata } = useImage({ limit });
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
