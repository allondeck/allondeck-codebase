describe("About page", () => {
  beforeEach(() => {
    cy.visit("/about");
    cy.waitForApp();
  });

  it("loads the about page", () => {
    cy.url().should("include", "/about");
    cy.get("main").should("be.visible");
  });

  it("shows about content or empty state", () => {
    cy.get("main").then(($main) => {
      const text = $main.text();
      expect(
        text.includes("About") ||
          text.includes("No content") ||
          text.length > 50
      ).to.be.true;
    });
  });
});
