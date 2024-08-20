// cypress/e2e/sample.cy.ts
describe("Sample Test", () => {
  it("should visit a page", () => {
    cy.visit("https://example.com");
    cy.contains("Example Domain").should("be.visible");
  });
});
