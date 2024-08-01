import { type ImageFileMetadata } from "../hooks/useImageMetadata";

interface ValidateError {
  field: string;
  selectedFileValue: number;
  max: number;
}

type NumberOption = number | { max: number; onError?: ErrorHandler };

type ErrorHandler = (error: ValidateError) => void;
export interface ValidateOptions {
  width?: NumberOption;
  height?: NumberOption;
  size?: NumberOption;
}

const validateOption = (
  field: string,
  value: number,
  condition: number | { max: number; onError?: ErrorHandler }
) => {
  if (typeof condition === "number") {
    if (value > condition) {
      window.alert(
        `이미지 파일의 ${field}는 ${condition}보다 작거나 같아야합니다.`
      );
      return false;
    }
  } else {
    if (value > condition.max) {
      if (condition.onError)
        condition.onError({
          field,
          selectedFileValue: condition.max,
          max: value,
        });
      else
        window.alert(
          `이미지 파일의 ${field}는 ${condition.max}보다 작거나 같아야합니다.`
        );
      return false;
    }
  }
  return true;
};
export const validateImageFile = (
  option: ValidateOptions,
  metaData: ImageFileMetadata
) => {
  if (option.width) {
    const validatePassed = validateOption(
      "width",
      metaData.width,
      option.width
    );
    if (!validatePassed) return false;
  }
  if (option.height) {
    const validatePassed = validateOption(
      "height",
      metaData.height,
      option.height
    );
    if (!validatePassed) return false;
  }
  if (option.size) {
    const validatePassed = validateOption("size", metaData.size, option.size);
    if (!validatePassed) return false;
  }
  return true;
};
