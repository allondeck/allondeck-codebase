describe("Wishlist", () => {
  it("loads wishlist page", () => {
    cy.visit("/wishlist");
    cy.waitForApp();
    cy.url().should("include", "/wishlist");
    cy.get("main").should("be.visible");
  });

  it("shows empty state or product list", () => {
    cy.visit("/wishlist");
    cy.waitForApp();
    cy.get("main").then(($main) => {
      const text = $main.text();
      expect(
        text.includes("Wishlist") &&
          (text.includes("empty") ||
            text.includes("item") ||
            text.includes("Browse") ||
            $main.find('a[href*="/products/"]').length > 0)
      ).to.be.true;
    });
  });
});
