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

  it("keeps CMS services and shop content visible when navigating away and back to home without refresh", () => {
    // 1. Initial home visit - verify services section cards exist
    cy.contains("SERVICES").should("exist");
    cy.contains("Custom DECK Designs").should("exist");

    // 2. Navigate away to /services
    cy.get('nav a[href="/services"]').first().click();
    cy.url().should("include", "/services");

    // 3. Navigate back to Home via logo
    cy.get('nav a[href="/"]').first().click();
    cy.url().should("eq", `${Cypress.config().baseUrl}/`);

    // 4. Scroll to services and verify content is loaded and visible
    cy.contains("SERVICES").scrollIntoView().should("be.visible");
    cy.contains("Custom DECK Designs").scrollIntoView().should("be.visible");
    cy.contains("Floor Manufacturing").should("be.visible");
    cy.contains("Cutting and Installation").should("be.visible");

    // 5. Scroll to shop and verify content is visible
    cy.contains("OUR SHOP").scrollIntoView().should("be.visible");
    cy.get("#shop").should("be.visible");

    // 6. Navigate to /products and back via browser back button
    cy.get('nav a[href="/products"]').first().click();
    cy.url().should("include", "/products");
    cy.go("back");
    cy.url().should("eq", `${Cypress.config().baseUrl}/`);

    // 7. Verify services and shop remain visible
    cy.contains("SERVICES").scrollIntoView().should("be.visible");
    cy.contains("Custom DECK Designs").scrollIntoView().should("be.visible");
    cy.contains("OUR SHOP").scrollIntoView().should("be.visible");
  });
});
