declare global {
  namespace Cypress {
    interface Chainable {
      login(username?: string, password?: string): Chainable<Element>;
      logout(): Chainable<Element>;
    }
  }
}

import { selectors } from "./selectors";

Cypress.Commands.add('gotoCatalogPage', () => {
  cy.visit('/patterns');

  // Wait for either success OR error state
  return cy.get('body').then(($body) => {
    if ($body.find(selectors.alertDanger).length > 0) {
      return false;
    }

    // Wait until at least the page stabilizes
    return cy.get(selectors.patternCard, { timeout: 10000 })
      .should('exist')
      .then(() => true);
  });
});

Cypress.Commands.add('closeGuidedTour', () => {
  return cy.get(`[data-test="tour-step-footer-secondary"]`).contains('Skip tour').click();
});