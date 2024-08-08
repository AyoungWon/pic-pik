import { useEffect, useState } from "react";

interface AspectRatioWidth {
  mode: "aspectRatio";
  width: number;
}

interface AspectRatioHeight {
  mode: "aspectRatio";
  height: number;
}

interface AspectRatioScale {
  mode: "aspectRatio";
  scale: number;
}

interface StretchResize {
  mode: "stretch";
  width?: number; // width와 height 중 하나는 반드시 있어야 함
  height?: number;
}

type ResizeOption =
  | AspectRatioWidth
  | AspectRatioHeight
  | AspectRatioScale
  | StretchResize;

interface Props {
  blob?: Blob;
  option: ResizeOption;
}
interface ResizeDimensions {
  targetWidth: number;
  targetHeight: number;
}

const calculateResizeDimensions = (
  imgWidth: number,
  imgHeight: number,
  option: ResizeOption
): ResizeDimensions => {
  let targetWidth: number = imgWidth; // 초기값 설정
  let targetHeight: number = imgHeight; // 초기값 설정

  const { mode } = option;

  switch (mode) {
    case "aspectRatio":
      if ("width" in option) {
        targetWidth = option.width;
        targetHeight = (imgHeight / imgWidth) * targetWidth;
      } else if ("height" in option) {
        targetHeight = option.height;
        targetWidth = (imgWidth / imgHeight) * targetHeight;
      } else if ("scale" in option) {
        targetWidth = imgWidth * option.scale;
        targetHeight = imgHeight * option.scale;
      }
      break;

    case "stretch":
      targetWidth = option.width || imgWidth;
      targetHeight = option.height || imgHeight;
      break;

    default:
      // 기본값으로 초기화된 상태를 유지
      break;
  }

  return { targetWidth, targetHeight };
};

export const resizeImage = async (
  blob: Blob,
  option: ResizeOption,
  onComplete: (blob: Blob) => void
) => {
  const img = new Image();
  img.src = URL.createObjectURL(blob);

  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const { targetHeight, targetWidth } = calculateResizeDimensions(
      img.width,
      img.height,
      option
    );

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // 이미지 리사이즈 및 캔버스에 그리기
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    // 캔버스에서 Blob으로 변환
    canvas.toBlob((resizedBlob) => {
      if (resizedBlob) {
        onComplete(resizedBlob);
      }
    }, blob.type);
  };
};

const useImageResize = ({ blob, option }: Props) => {
  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);

  useEffect(() => {
    if (blob) resizeImage(blob, option, setResizedBlob);
  }, [blob, option]);

  return resizedBlob;
};

export default useImageResize;
