/// <reference types="cypress" />

import {
  readImageMetadata,
  type ImageMetadata,
} from "src/utils/readImageMetadata";
import { type Limit } from "src/utils/validateImageFile";
import "cypress-file-upload";

describe("readImageMetadata Function", () => {
  const filePath = "images/danbi.jpeg";
  let testFile: File;

  before(() => {
    // 동적으로 파일 입력 요소를 생성하고, 파일을 읽음
    cy.document().then((doc) => {
      const input = doc.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("id", "file-input");
      doc.body.appendChild(input);
    });

    cy.get("#file-input")
      .attachFile(filePath)
      .then((input) => {
        const target = input[0] as HTMLInputElement;
        testFile = target.files?.[0]!;
      });
  });

  it("should read image metadata correctly without any limits", () => {
    cy.wrap(readImageMetadata(testFile)).then((_metadata) => {
      const metadata = _metadata as any as ImageMetadata;
      expect(metadata).to.not.be.null;
      expect(metadata!.name).to.equal("danbi.jpeg");
      expect(metadata!.extension).to.equal("jpeg");
      expect(metadata!.width).to.equal(217); // 실제 이미지 너비
      expect(metadata!.height).to.equal(232); // 실제 이미지 높이
      expect(metadata!.size).to.be.a("number").and.to.be.greaterThan(0); // 파일 크기 확인
    });
  });

  it("should return null when width exceeds limit", () => {
    const limit: Limit = {
      width: 200, // 실제 너비보다 작은 값
    };

    cy.wrap(readImageMetadata(testFile, limit)).then((metadata) => {
      expect(metadata).to.be.null; // 제한 조건에 맞지 않아 null을 반환해야 함
    });
  });

  it("should return null when height exceeds limit", () => {
    const limit: Limit = {
      height: 200, // 실제 높이보다 작은 값
    };

    cy.wrap(readImageMetadata(testFile, limit)).then((metadata) => {
      expect(metadata).to.be.null; // 제한 조건에 맞지 않아 null을 반환해야 함
    });
  });

  it("should return null when size exceeds limit", () => {
    const limit: Limit = {
      size: 1000, // 실제 파일 크기보다 작은 값 (1KB)
    };

    cy.wrap(readImageMetadata(testFile, limit)).then((metadata) => {
      expect(metadata).to.be.null; // 제한 조건에 맞지 않아 null을 반환해야 함
    });
  });

  it("should read image metadata correctly when within all limits", () => {
    const limit: Limit = {
      width: 300, // 실제 너비보다 큰 값
      height: 300, // 실제 높이보다 큰 값
      size: 5000000, // 실제 파일 크기보다 큰 값 (5MB)
    };

    cy.wrap(readImageMetadata(testFile, limit)).then((_metadata) => {
      const metadata = _metadata as any as ImageMetadata;
      expect(metadata).to.not.be.null;
      expect(metadata!.name).to.equal("danbi.jpeg");
      expect(metadata!.width).to.equal(217);
      expect(metadata!.height).to.equal(232);
    });
  });
});
