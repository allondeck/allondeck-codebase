describe("Product detail", () => {
  it("loads product detail when visiting valid slug", () => {
    cy.visit("/products");
    cy.waitForApp();
    cy.get("main").then(($main) => {
      const link = $main.find('a[href*="/products/"]').first();
      if (link.length) {
        const href = link.attr("href");
        if (href) {
          cy.visit(href);
          cy.waitForApp();
          cy.get("main").should("be.visible");
          cy.get("main").contains(/Add to cart|Out of stock|View cart|Cart/i);
        }
      }
    });
  });

  it("product page has add to cart or out of stock", () => {
    cy.visit("/products");
    cy.waitForApp();
    cy.get("main")
      .find('a[href*="/products/"]')
      .first()
      .then(($a) => {
        const href = $a.attr("href");
        if (!href) return;
        cy.visit(href);
        cy.waitForApp();
        // Wait for product content: Add to cart, Added to cart, or Out of stock
        cy.get("main").should(($m) => {
          const text = $m.text();
          const hasCartOrStock =
            /add(ed)? to cart/i.test(text) || /out of stock/i.test(text);
          expect(hasCartOrStock).to.be.true;
        });
      });
  });
});
