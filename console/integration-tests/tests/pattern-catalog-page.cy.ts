import {
  getCards,
  getFirstCard,
  getTierToggle,
  openTierFilter,
  closeTierFilter,
  selectTier,
  getInstalledCards,
  hasInstalledCards
} from '../support/helpers';

import { selectors } from '../support/selectors';
import { checkErrors } from '../support';

describe('Catalog Page', () => {
  beforeEach(function () {
    cy.login();
    cy.closeGuidedTour();
    cy.gotoCatalogPage();
  });

  afterEach(() => {
    checkErrors();
  });

  after(() => {
    cy.logout();
  });

  it('renders pattern cards from the catalog', () => {
    getFirstCard().should('be.visible');
    getCards().should('have.length.greaterThan', 0);
  });

  it('each pattern card has a display name and tier label', () => {
    getFirstCard().as('card');

    cy.get('@card')
      .find('[class*="card"] [class*="title"]')
      .first()
      .should('not.be.empty');

    cy.get('@card')
      .find('[class*="label"]')
      .first()
      .should('be.visible');
  });

  it('tier filter defaults to Maintained', () => {
    getTierToggle().should('contain.text', 'Maintained');
  });

  it('tier filter can select and deselect tiers', () => {
    getTierToggle().as('toggle');

    openTierFilter();
    selectTier('Tested');
    selectTier('Maintained');
    closeTierFilter();

    cy.get('@toggle')
      .should('contain.text', 'Tested')
      .and('not.contain.text', 'Maintained');
  });

  it('selecting all tiers shows all patterns', () => {
    getCards().its('length').then((maintainedCount) => {
      openTierFilter();
      selectTier('Tested');
      selectTier('Sandbox');
      closeTierFilter();

      getCards().its('length')
        .should('be.gte', maintainedCount);
    });
  });

  it('deselecting all tiers shows all patterns', () => {
    getTierToggle().as('toggle');

    openTierFilter();
    selectTier('Maintained');
    closeTierFilter();

    cy.get('@toggle').should('contain.text', 'Tier');
    getCards().should('have.length.greaterThan', 0);
  });

  it('pattern cards show cloud provider labels when available', () => {
    cy.get(selectors.cloudLabel).then(($labels) => {
      if ($labels.length === 0) return;

      cy.wrap($labels)
        .first()
        .invoke('text')
        .should((text) => {
          expect(['AWS', 'GCP', 'Azure']).to.include(text.trim());
        });
    });
  });

  it('non-installed patterns show Install button', () => {
    cy.get(selectors.installButton).then(($btns) => {
      if ($btns.length === 0) return;

      cy.wrap($btns).first().should('be.visible');
    });
  });

  it('installed patterns show Uninstall and Manage Secrets buttons', function () {
    openTierFilter();
    selectTier('Tested');
    selectTier('Sandbox');
    closeTierFilter();

    hasInstalledCards().then((count) => {
      if (count === 0) this.skip();

      getInstalledCards().first().as('card');

      cy.get('@card')
        .find(selectors.uninstallButton)
        .should('be.visible');

      cy.get('@card')
        .find(selectors.manageSecretsButton)
        .should('be.visible');
    });
  });

  it('pattern cards show Docs and Repo links', () => {
    cy.get(selectors.docsLink).then(($links) => {
      if ($links.length === 0) return;

      cy.wrap($links)
        .first()
        .should('have.attr', 'href')
        .and('match', /^https?:\/\//);
    });
  });

  it('catalog description is shown when available', () => {
    cy.get('body').then(($body) => {
      const exists = $body.find(selectors.catalogDescription).length > 0;
      if (!exists) return;

      cy.get(selectors.catalogDescription)
        .first()
        .should('not.be.empty');
    });
  });
});
