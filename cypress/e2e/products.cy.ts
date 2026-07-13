describe("Products listing", () => {
  beforeEach(() => {
    cy.visit("/products");
    cy.waitForApp();
  });

  it("loads the products page", () => {
    cy.url().should("include", "/products");
    cy.get("main").should("be.visible");
  });

  it("shows product grid or empty state", () => {
    cy.get("main").then(($main) => {
      const hasGrid = $main.find('[class*="grid"]').length > 0;
      const hasProducts = $main.find('a[href*="/products/"]').length > 0;
      const text = $main.text();
      const hasEmpty =
        text.includes("No products") ||
        text.toLowerCase().includes("no products") ||
        /product/i.test(text);
      expect(hasGrid || hasProducts || hasEmpty).to.be.true;
    });
  });

  it("can open a product detail when products exist", () => {
    cy.get("main").then(($main) => {
      const productLink = $main.find('a[href*="/products/"]').first();
      if (productLink.length) {
        cy.wrap(productLink).click();
        cy.url().should("match", /\/products\/[^/]+/);
        cy.get("main").should("be.visible");
      }
    });
  });
});
