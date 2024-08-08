import { useEffect, useState } from "react";

interface ImageResizeProps {
  blob: Blob;
}

interface AspectRatioWidth extends ImageResizeProps {
  mode: "aspectRatio";
  width: number;
}

interface AspectRatioHeight extends ImageResizeProps {
  mode: "aspectRatio";
  height: number;
}

interface AspectRatioScale extends ImageResizeProps {
  mode: "aspectRatio";
  scale: number;
}

interface StretchResize extends ImageResizeProps {
  mode: "stretch";
  width?: number; // width와 height 중 하나는 반드시 있어야 함
  height?: number;
}

type ResizeProps =
  | AspectRatioWidth
  | AspectRatioHeight
  | AspectRatioScale
  | StretchResize;

interface ResizeDimensions {
  targetWidth: number;
  targetHeight: number;
}

const calculateResizeDimensions = (
  imgWidth: number,
  imgHeight: number,
  props: ResizeProps
): ResizeDimensions => {
  let targetWidth: number = imgWidth; // 초기값 설정
  let targetHeight: number = imgHeight; // 초기값 설정

  const { mode } = props;

  switch (mode) {
    case "aspectRatio":
      if ("width" in props) {
        targetWidth = props.width;
        targetHeight = (imgHeight / imgWidth) * targetWidth;
      } else if ("height" in props) {
        targetHeight = props.height;
        targetWidth = (imgWidth / imgHeight) * targetHeight;
      } else if ("scale" in props) {
        targetWidth = imgWidth * props.scale;
        targetHeight = imgHeight * props.scale;
      }
      break;

    case "stretch":
      targetWidth = props.width || imgWidth;
      targetHeight = props.height || imgHeight;
      break;

    default:
      // 기본값으로 초기화된 상태를 유지
      break;
  }

  return { targetWidth, targetHeight };
};

const useImageResize = (props: ResizeProps) => {
  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);

  const resizeImage = async () => {
    const { blob } = props;

    const img = new Image();
    img.src = URL.createObjectURL(blob);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      const { targetHeight, targetWidth } = calculateResizeDimensions(
        img.width,
        img.height,
        props
      );

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // 이미지 리사이즈 및 캔버스에 그리기
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // 캔버스에서 Blob으로 변환
      canvas.toBlob((resizedBlob) => {
        if (resizedBlob) {
          setResizedBlob(resizedBlob);
        }
      }, blob.type);
    };
  };

  useEffect(() => {
    resizeImage();
  }, [props]);

  return resizedBlob;
};

export default useImageResize;
