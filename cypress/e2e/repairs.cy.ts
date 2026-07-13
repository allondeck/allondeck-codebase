describe("Repairs page", () => {
  beforeEach(() => {
    cy.visit("/repairs");
    cy.waitForApp();
  });

  it("loads the repairs page", () => {
    cy.url().should("include", "/repairs");
    cy.get("main").should("be.visible");
  });

  it("shows repair request form", () => {
    cy.get("main").contains(/repair|request/i);
    cy.get('input[id="repair-name"], input[type="text"]')
      .first()
      .should("be.visible");
    cy.get('input[id="repair-email"], input[type="email"]').should(
      "be.visible"
    );
    cy.get('textarea[id="repair-description"], textarea').should("be.visible");
  });

  it("has file input for photos", () => {
    cy.get('input[type="file"]').should("exist");
  });

  it("has submit button", () => {
    cy.get('button[type="submit"]').should("contain.text", "Submit");
  });
});
