describe("Contact page", () => {
  beforeEach(() => {
    cy.visit("/contact");
    cy.waitForApp();
  });

  it("loads the contact page", () => {
    cy.url().should("include", "/contact");
    cy.get("main").should("be.visible");
  });

  it("shows contact form with name, email, message", () => {
    cy.get("#contact-name").should("be.visible");
    cy.get("#contact-email").should("be.visible");
    cy.get("#contact-message").should("be.visible");
  });

  it("has submit button", () => {
    cy.get('button[type="submit"]').should("contain.text", "Send");
  });

  it("validates required fields", () => {
    cy.get('button[type="submit"]').click();
    cy.get("form").should("exist");
    cy.get("input:invalid, textarea:invalid").should("exist");
  });
});
