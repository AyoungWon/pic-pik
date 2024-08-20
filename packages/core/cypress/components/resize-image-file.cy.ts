/// <reference types="cypress" />

import {
  readImageMetadata,
  type ImageMetadata,
} from "src/utils/readImageMetadata";
import "cypress-file-upload";
import { type ResizeOption, resizeImage } from "src/utils/resizeImage";

describe("resizeImage Function with dynamic file input", () => {
  const filePath = "images/danbi.jpeg";
  let originalImageMetadata: ImageMetadata | null = null;

  before(() => {
    // 동적으로 파일 입력 요소를 생성
    cy.document().then((doc) => {
      const input = doc.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("id", "file-input");
      doc.body.appendChild(input);
    });

    // 파일 입력 요소에 파일 첨부 및 메타데이터 읽기
    cy.get("#file-input")
      .attachFile(filePath)
      .then((input) => {
        const target = input[0] as HTMLInputElement;
        const file = target.files?.[0];

        if (file) {
          return cy
            .wrap(null)
            .then(() => readImageMetadata(file))
            .then((metadata) => {
              originalImageMetadata = metadata;
            });
        }
      });
  });

  it("should load metadata correctly", () => {
    cy.wrap(originalImageMetadata)
      .should("not.be.null")
      .then((metadata) => {
        expect(metadata!.name).to.equal("danbi.jpeg");
        expect(metadata!.width).to.equal(217);
        expect(metadata!.height).to.equal(232);
      });
  });

  it("should resize image maintaining aspect ratio width", () => {
    const resizeOption: ResizeOption = { mode: "aspectRatio", width: 100 };

    cy.wrap(null)
      .then(() => resizeImage(originalImageMetadata!, resizeOption))
      .then((resizedFile: File | null) => {
        expect(resizedFile).to.not.be.null;
        return readImageMetadata(resizedFile!);
      })
      .then((_metadata) => {
        const metadata = _metadata as ImageMetadata;
        expect(metadata.width).to.be.closeTo(100, 1);
        const expectedHeight = Math.round(
          (originalImageMetadata!.height / originalImageMetadata!.width) * 100
        );
        expect(metadata.height).to.be.closeTo(expectedHeight, 1);
      });
  });

  it("should resize image maintaining aspect ratio height", () => {
    const resizeOption: ResizeOption = { mode: "aspectRatio", height: 100 };

    cy.wrap(null)
      .then(() => resizeImage(originalImageMetadata!, resizeOption))
      .then((resizedFile: File | null) => {
        expect(resizedFile).to.not.be.null;
        return readImageMetadata(resizedFile!);
      })
      .then((_metadata) => {
        const metadata = _metadata as ImageMetadata;
        expect(metadata.height).to.be.closeTo(100, 1);
        const expectedWidth = Math.round(
          (originalImageMetadata!.width / originalImageMetadata!.height) * 100
        );
        expect(metadata.width).to.be.closeTo(expectedWidth, 1);
      });
  });

  it("should resize image with aspect ratio scale", () => {
    const resizeOption: ResizeOption = { mode: "aspectRatio", scale: 0.5 };

    cy.wrap(null)
      .then(() => resizeImage(originalImageMetadata!, resizeOption))
      .then((resizedFile: File | null) => {
        expect(resizedFile).to.not.be.null;
        return readImageMetadata(resizedFile!);
      })
      .then((_metadata) => {
        const metadata = _metadata as ImageMetadata;
        const expectedWidth = Math.round(originalImageMetadata!.width * 0.5);
        const expectedHeight = Math.round(originalImageMetadata!.height * 0.5);
        expect(metadata.width).to.be.closeTo(expectedWidth, 1);
        expect(metadata.height).to.be.closeTo(expectedHeight, 1);
      });
  });

  it("should resize image by stretching to specific width and height", () => {
    const resizeOption: ResizeOption = {
      mode: "stretch",
      width: 150,
      height: 150,
    };

    cy.wrap(null)
      .then(() => resizeImage(originalImageMetadata!, resizeOption))
      .then((resizedFile: File | null) => {
        expect(resizedFile).to.not.be.null;
        return readImageMetadata(resizedFile!);
      })
      .then((_metadata) => {
        const metadata = _metadata as ImageMetadata;
        expect(metadata.width).to.equal(150);
        expect(metadata.height).to.equal(150);
      });
  });
});
