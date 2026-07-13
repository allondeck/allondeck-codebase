describe("Navigation and layout", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.waitForApp();
  });

  it("loads the home page and shows the header", () => {
    cy.get("nav").should("be.visible");
    cy.get("main").should("be.visible");
  });

  it("has a footer with Quick links and Need help", () => {
    cy.get("footer").scrollIntoView().should("be.visible");
    cy.get("footer").contains("Quick links");
    cy.get("footer").contains("Need help");
  });

  it("navigates to About from footer", () => {
    cy.get("footer").contains("a", "About").click();
    cy.url().should("include", "/about");
    cy.get("main").should("be.visible");
  });

  it("navigates to Products from footer", () => {
    cy.get("footer").contains("a", "Products").click();
    cy.url().should("include", "/products");
  });

  it("navigates to Cart from footer", () => {
    cy.get("footer").contains("a", "Cart").click();
    cy.url().should("include", "/cart");
  });

  it("navigates to Wishlist from footer", () => {
    cy.get("footer").contains("a", "Wishlist").click();
    cy.url().should("include", "/wishlist");
  });

  it("navigates to Look up your order from footer", () => {
    cy.get("footer").contains("a", "Look up your order").click();
    cy.url().should("include", "/lookup-order");
  });

  it("has Contact link in Need help section", () => {
    cy.get("footer")
      .contains("a", "Contact")
      .should("have.attr", "href", "/contact");
  });

  it("navigates to Products from header or nav", () => {
    cy.get('a[href="/products"]').first().click();
    cy.url().should("include", "/products");
  });

  it("navigates to Login when clicking Sign in", () => {
    cy.get('a[href="/login"]').first().click();
    cy.url().should("include", "/login");
  });
});
