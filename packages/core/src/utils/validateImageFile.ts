import { type ImageMetadata } from "src/utils/readImageMetadata";

/**
 * validate에 실패한 error에 관련된 내용을 전달하는 interface
 *
 * @interface ValidateError
 * @property {string} field - 유효성 검사에서 실패한 필드의 이름입니다.
 * @property {number} selectedFileValue - 사용자가 선택한 파일의 실제 값입니다.
 * @property {number} max - 허용된 최대 값입니다.
 */
export interface ValidateError {
  field: string;
  selectedFileValue: number;
  max: number;
}

/**
 * @typedef {number | { max: number; onError?: ErrorHandler }} LimitMaxOption
 * 숫자 옵션으로 최대값을 단순한 숫자 또는 최대값과 오류 처리기를 포함할 수 있는 객체입니다.
 */
type LimitMaxOption = number | { max: number; onError?: ErrorHandler };

/**
 * @typedef {(error: ValidateError) => void} ErrorHandler
 * 오류 발생 시 호출되는 함수 타입입니다.
 * @param {ValidateError} error - 유효성 검사에서 발생한 오류에 대한 정보입니다.
 */
type ErrorHandler = (error: ValidateError) => void;

/**
 * 불러올 이미지 파일의 제한 사항을 지정하는 interface
 *
 * @interface Limit
 * @property {LimitMaxOption} [width] - 이미지의 너비 제한 옵션입니다.
 * @property {LimitMaxOption} [height] - 이미지의 높이 제한 옵션입니다.
 * @property {LimitMaxOption} [size] - 이미지 파일의 크기 제한 옵션입니다.
 */
export interface Limit {
  width?: LimitMaxOption;
  height?: LimitMaxOption;
  size?: LimitMaxOption;
}

/**
 * 유효성 검사 실패 시 오류를 처리하는 함수입니다.
 *
 * @param {Object} params - 오류 처리 함수에 전달되는 파라미터입니다.
 * @param {ErrorHandler} [params.errorHandler] - 오류 발생 시 호출되는 사용자 정의 오류 처리기입니다.
 * @param {string} params.field - 유효성 검사에서 실패한 필드의 이름입니다.
 * @param {number} params.value - 사용자가 선택한 파일의 실제 값입니다.
 * @param {number} params.max - 허용된 최대 값입니다.
 * @param {string} [params.unit] - 값의 단위(예: px, bytes)입니다.
 */
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

/**
 * 특정 필드의 유효성을 검사하고, 유효하지 않은 경우 오류를 처리합니다.
 *
 * @param {string} field - 유효성 검사를 수행할 필드의 이름입니다.
 * @param {number} value - 필드의 실제 값입니다.
 * @param {LimitMaxOption} condition - 필드에 대해 설정된 유효성 검사 조건입니다.
 * @param {string} [unit] - 값의 단위(예: px, bytes)입니다.
 *
 * @returns {boolean} 유효성 검사가 통과하면 true, 실패하면 false를 반환합니다.
 */
const validateOption = (
  field: string,
  value: number,
  condition: LimitMaxOption,
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

/**
 * 주어진 이미지 메타데이터와 제한 옵션에 따라 이미지 파일이 유효한지 검증합니다.
 *
 * @param {Limit} option - 이미지의 너비, 높이, 크기 등의 제한 조건을 지정하는 객체입니다.
 * @param {ImageMetadata} metaData - 검증할 이미지의 메타데이터입니다.
 *
 * @returns {boolean} 모든 유효성 검사를 통과하면 true, 그렇지 않으면 false를 반환합니다.
 *
 * @example
 * const metaData = { width: 1024, height: 768, size: 1500000, src: 'image.jpg' };
 * const option = { width: 1000, height: 800, size: { max: 2000000 } };
 * const isValid = validateImageFile(option, metaData);
 * console.log(isValid); // true 또는 false
 */
export const validateImageFile = (option: Limit, metaData: ImageMetadata) => {
  const validations: {
    field: keyof ImageMetadata;
    value: number;
    condition: LimitMaxOption | undefined;
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
