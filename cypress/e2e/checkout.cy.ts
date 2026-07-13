describe("Checkout", () => {
  it("loads checkout page when visiting directly", () => {
    cy.visit("/checkout");
    cy.waitForApp();
    cy.get("main").should("be.visible");
  });

  it("shows cart-related content or empty message", () => {
    cy.visit("/checkout");
    cy.waitForApp();
    cy.get("main").then(($main) => {
      const text = $main.text();
      expect(
        text.includes("empty") ||
          text.includes("cart") ||
          text.includes("Cart") ||
          text.includes("checkout") ||
          text.includes("Checkout")
      ).to.be.true;
    });
  });
});
