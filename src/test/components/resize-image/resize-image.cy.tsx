import { ResizeOption } from "../../../utils/resizeImage";
import ResizeImage from "./ResizeImage";

describe("useResizeImage Hook - Resized Metadata Test", () => {
  it("should verify that the resized image's metadata and file are null when the original metadata is missing", () => {
    // 컴포넌트를 마운트
    const option: ResizeOption = {
      mode: "stretch",
      height: 100,
    };
    cy.mount(<ResizeImage option={option} />);

    // 리사이즈 메다데이터가 표시되지 않는지 확인
    cy.get("#resized-metadata").should("not.exist");
    cy.contains("리사이즈할 이미지를 선택하세요.").should("be.visible");
  });

  it("should resize the image according to the specified options in stretch mode", () => {
    const option: ResizeOption = {
      mode: "stretch",
      width: 150,
      height: 100,
    };
    cy.mount(<ResizeImage option={option} />);

    // 테스트할 이미지 로드
    const filePath = "images/danbi.jpeg";
    cy.get('input[type="file"]').attachFile(filePath);

    // Check if the resized metadata is correctly displayed
    cy.get("#resized-metadata", { timeout: 10000 }).should("exist");
    cy.get("#resized-metadata #width").should("contain", "Width: 150");
    cy.get("#resized-metadata #height").should("contain", "Height: 100");

    // Check if the original name and resized name are the same
    cy.get("#metadata #name").then(($originalName) => {
      const originalName = $originalName.text();
      cy.get("#resized-metadata #name").should("contain", originalName);
    });
  });

  it("should resize the image with aspect ratio mode and scaling according to the specified options", () => {
    const option: ResizeOption = {
      mode: "aspectRatio",
      scale: 0.2,
    };
    cy.mount(<ResizeImage option={option} />);

    const filePath = "images/danbi.jpeg";
    cy.get('input[type="file"]').attachFile(filePath);

    cy.get("#resized-metadata", { timeout: 10000 }).should("exist");
    cy.get("#resized-metadata #width").should("contain", "Width: 43");
    cy.get("#resized-metadata #height").should("contain", "Height: 46");

    cy.get("#metadata #name").then(($originalName) => {
      const originalName = $originalName.text();
      cy.get("#resized-metadata #name").should("contain", originalName);
    });

    // Verify that the image loaded successfully without errors
    cy.get("#resized-metadata img")
      .should("be.visible")
      .and(($img) => {
        // NaturalWidth가 0보다 크면 이미지는 성공적으로 로드됨
        expect(($img[0] as HTMLImageElement).naturalWidth).to.be.greaterThan(0);
      });
  });

  it("should resize the image according to the specified width while maintaining the aspect ratio", () => {
    const option: ResizeOption = {
      mode: "aspectRatio",
      width: 400,
    };
    cy.mount(<ResizeImage option={option} />);

    const filePath = "images/danbi.jpeg";
    cy.get('input[type="file"]').attachFile(filePath);

    cy.get("#resized-metadata", { timeout: 10000 }).should("exist");
    cy.get("#resized-metadata #width").should("contain", "Width: 400");
    cy.get("#resized-metadata #height").should("contain", "Height: 427");

    cy.get("#metadata #name").then(($originalName) => {
      const originalName = $originalName.text();
      cy.get("#resized-metadata #name").should("contain", originalName);
    });

    cy.get("#resized-metadata img")
      .should("be.visible")
      .and(($img) => {
        expect(($img[0] as HTMLImageElement).naturalWidth).to.be.greaterThan(0);
      });
  });
});
