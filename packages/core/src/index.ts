import {
  calcResizeDimensions,
  type ResizeDimensions,
} from "./utils/calcResizeDimensions";
import { checkFileType } from "./utils/checkFileType";
import {
  readImageMetadata,
  type ImageMetadata,
} from "./utils/readImageMetadata";
import {
  resizeImage,
  type ResizeOption,
  type AspectRatioWidth,
  type AspectRatioHeight,
  type AspectRatioScale,
  type StretchResize,
} from "./utils/resizeImage";
import {
  validateImageFile,
  type Limit,
  type ValidateError,
} from "./utils/validateImageFile";

export {
  calcResizeDimensions,
  checkFileType,
  readImageMetadata,
  resizeImage,
  validateImageFile,
};

export type {
  ResizeDimensions,
  ImageMetadata,
  ResizeOption,
  Limit,
  AspectRatioWidth,
  AspectRatioHeight,
  AspectRatioScale,
  StretchResize,
  ValidateError,
};
