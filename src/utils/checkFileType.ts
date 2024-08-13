/**
 * 주어진 HTMLInputElement가 파일 입력 타입인지 확인합니다.
 *
 * @param {HTMLInputElement} inputEl - 검사할 HTMLInputElement입니다.
 * @returns {boolean} 입력 요소가 파일 타입이면 true를, 그렇지 않으면 false를 반환합니다.
 *
 * @example
 * const inputElement = document.querySelector('input[type="file"]');
 * const isFileType = checkFileType(inputElement);
 * console.log(isFileType); // true 또는 false
 */
export const checkFileType = (inputEl: HTMLInputElement) => {
  if (inputEl.type === "file") return true;
  else {
    console.error("The input type is not file");
    return false;
  }
};
