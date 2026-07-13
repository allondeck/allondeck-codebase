describe("Home page", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.waitForApp();
  });

  it("shows main content area", () => {
    cy.get("main").should("be.visible");
  });

  it("has a link to products", () => {
    cy.get('a[href="/products"]').should("exist");
  });

  it("may show a hero or welcome section", () => {
    cy.get("main").within(() => {
      cy.get("section").should("exist");
    });
  });

  it("footer shows current year in copyright", () => {
    const year = new Date().getFullYear();
    cy.get("footer").contains(year.toString());
  });
});
