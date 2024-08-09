import { type ImageMetadata } from "./readImageMetadata";

interface ValidateError {
  field: string;
  selectedFileValue: number;
  max: number;
}

type NumberOption = number | { max: number; onError?: ErrorHandler };

type ErrorHandler = (error: ValidateError) => void;
export interface Limit {
  width?: NumberOption;
  height?: NumberOption;
  size?: NumberOption;
}

const handleError = ({
  errorHandler,
  field,
  value,
  max,
  unit,
}: {
  errorHandler?: ErrorHandler;
  field: string;
  value: number;
  max: number;
  unit?: string;
}) => {
  const errorParams: ValidateError = { field, selectedFileValue: value, max };
  if (errorHandler) errorHandler(errorParams);
  else
    console.error(
      `이미지 파일의 ${field}는 ${max}${unit ?? ""}보다 작거나 같아야합니다.`
    );
};

const validateOption = (
  field: string,
  value: number,
  condition: NumberOption,
  unit?: string
) => {
  const max = typeof condition === "number" ? condition : condition.max;

  if (value > max) {
    const errorHandler =
      typeof condition === "object" ? condition.onError : undefined;
    handleError({ errorHandler, max, value, field, unit });
    return false;
  }

  return true;
};
export const validateImageFile = (option: Limit, metaData: ImageMetadata) => {
  const validations: {
    field: keyof ImageMetadata;
    value: number;
    condition: NumberOption | undefined;
    unit?: string;
  }[] = [
    {
      field: "width",
      value: metaData.width,
      condition: option.width,
      unit: "px",
    },
    {
      field: "height",
      value: metaData.height,
      condition: option.height,
      unit: "px",
    },
    {
      field: "size",
      value: metaData.size,
      condition: option.size,
      unit: "bytes",
    },
  ];

  return validations.every(
    ({ field, value, condition, unit }) =>
      condition === undefined || validateOption(field, value, condition, unit)
  );
};
