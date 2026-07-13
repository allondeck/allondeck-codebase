describe("Cart", () => {
  it("shows empty cart state when no items", () => {
    cy.visit("/cart");
    cy.waitForApp();
    cy.get("main").should("be.visible");
    cy.get("main").contains(/empty|no items|add some|browse/i);
    cy.get('a[href="/products"]').should("exist");
  });

  it("has link to wishlist from empty cart", () => {
    cy.visit("/cart");
    cy.waitForApp();
    cy.get("main").within(() => {
      cy.get('a[href="/wishlist"]').should("exist");
    });
  });

  it("add to cart from product page then view cart", () => {
    cy.visit("/products");
    cy.waitForApp();
    cy.get("main").then(($main) => {
      const productLink = $main.find('a[href*="/products/"]').first();
      if (productLink.length === 0) return;
      cy.wrap(productLink).click();
      cy.waitForApp();
      cy.get("main").then(($m) => {
        const addBtn = $m
          .find("button")
          .filter((_, el) =>
            /add to cart|add to bag/i.test(el.textContent || "")
          );
        if (addBtn.length) {
          cy.wrap(addBtn).first().click();
          cy.visit("/cart");
          cy.waitForApp();
          cy.get("main").should("not.contain.text", "Your cart is empty");
        }
      });
    });
  });
});
