/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Wait for the app to be ready (no loading spinners in main content).
       */
      waitForApp(): Chainable<void>;
    }
  }
}

Cypress.Commands.add("waitForApp", () => {
  cy.get("main").should("be.visible");
  // Allow a short time for lazy-loaded content
  cy.wait(500);
});

export {};
