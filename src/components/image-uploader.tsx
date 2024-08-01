/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, {
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  MouseEvent,
} from "react";
import useImageMetadata, { ImageFileMetadata } from "../hooks/useImageMetadata";

// TODO
// label의 스타일 받기
// input에 들어갈 props 받기
// children 받아서 label에 넣어주기
// imageMetadata 로드에 대한 콜백 받기
// 이미지 accept 형식 지정을 해줄까?

interface ValidateOptions {
  width?: number;
  height?: number;
  size?: number;
}

interface ImageUploaderProps {
  accept?: string | undefined;
  style?: React.CSSProperties | undefined;
  children?: ReactNode;
  onMetadataLoaded?: (metadata: ImageFileMetadata) => void;
  validate?: ValidateOptions;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  accept,
  style,
  children,
  validate,
  onMetadataLoaded,
}) => {
  const { ref, imageMetadata } = useImageMetadata();
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
    <label style={style} htmlFor="pic_pik_input">
      <input
        id="pic_pik_input"
        type="file"
        accept={accept}
        css={_hidden}
        ref={ref}
      />
      {extendedChildren}
    </label>
  );
};

export default ImageUploader;

const _hidden = css`
  visibility: hidden;
  max-width: 0;
  max-height: 0;
  overflow: hidden;
`;
