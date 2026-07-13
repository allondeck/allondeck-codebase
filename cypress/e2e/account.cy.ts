describe("Account", () => {
  it("redirects to login when visiting account unauthenticated", () => {
    cy.visit("/account");
    cy.waitForApp();
    cy.url().should("include", "/login");
  });

  it("account orders redirects to login when unauthenticated", () => {
    cy.visit("/account/orders");
    cy.waitForApp();
    cy.url().should("include", "/login");
  });

  it("owner dashboard redirects to login when unauthenticated", () => {
    cy.visit("/account/owner");
    cy.waitForApp();
    cy.url().should("include", "/login");
  });
});
