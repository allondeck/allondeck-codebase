describe("Authentication", () => {
  describe("Login page", () => {
    beforeEach(() => {
      cy.visit("/login");
      cy.waitForApp();
    });

    it("shows login form with email and password", () => {
      cy.get('input[type="email"]').should("be.visible");
      cy.get('input[type="password"]').should("be.visible");
      cy.get('button[type="submit"]').should("exist");
    });

    it("has link to signup", () => {
      cy.contains("a", /create account|sign up/i).should(
        "have.attr",
        "href",
        "/signup"
      );
    });

    it("shows validation for empty submit", () => {
      cy.get("form").submit();
      cy.get("main").should("be.visible");
      cy.get('input[type="email"]:invalid, input[required]:invalid').should(
        "exist"
      );
    });
  });

  describe("Signup page", () => {
    beforeEach(() => {
      cy.visit("/signup");
      cy.waitForApp();
    });

    it("shows signup form with full name, email, password", () => {
      cy.get('input[autocomplete="name"]').should("be.visible");
      cy.get('input[type="email"]').should("be.visible");
      cy.get('input[type="password"]').should("be.visible");
    });

    it("shows password requirements list", () => {
      cy.contains("At least 8 characters").should("be.visible");
      cy.contains("lowercase").should("be.visible");
      cy.contains("uppercase").should("be.visible");
      cy.contains("number").should("be.visible");
      cy.contains("symbol").should("be.visible");
    });

    it("rejects weak password on submit", () => {
      cy.get('input[autocomplete="name"]').type("Test User");
      cy.get('input[type="email"]').type("test@example.com");
      cy.get('input[type="password"]').type("weak");
      cy.get('button[type="submit"]').click();
      cy.contains(
        /password|requirement|lowercase|uppercase|digit|symbol/i
      ).should("be.visible");
    });

    it("has link to login", () => {
      cy.contains("a", /sign in|log in|already have/i).should(
        "have.attr",
        "href",
        "/login"
      );
    });
  });
});
