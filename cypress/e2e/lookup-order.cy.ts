describe("Look up order", () => {
  beforeEach(() => {
    cy.visit("/lookup-order");
    cy.waitForApp();
  });

  it("loads the lookup order page", () => {
    cy.url().should("include", "/lookup-order");
    cy.get("main").should("be.visible");
  });

  it("shows form or instructions for order lookup", () => {
    cy.get("main").then(($main) => {
      const text = $main.text();
      expect(
        text.includes("order") ||
          text.includes("email") ||
          text.includes("lookup") ||
          $main.find("input, form").length > 0
      ).to.be.true;
    });
  });
});
