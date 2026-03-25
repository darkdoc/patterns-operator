import { checkErrors } from '../support';

const PLUGIN_NAME = 'patterns-operator-console-plugin';
export const isLocalDevEnvironment = Cypress.config('baseUrl').includes('localhost');

// Check if console plugin is installed and enabled (operator-managed)
const checkPluginInstalled = () => {
  cy.visit('/k8s/cluster/operator.openshift.io~v1~Console/cluster/console-plugins');
  cy.get(`[data-test="${PLUGIN_NAME}"]`).get(`[data-test="status-text"]`).should('include.text', 'loaded')
};

// For operator-managed deployment, we just need to verify the plugin exists
const verifyOperatorDeployment = () => {
  cy.exec('oc get consoleplugin patterns-operator-console-plugin', {
    failOnNonZeroExit: false,
  }).then((result) => {
    if (result.code !== 0) {
      cy.log('Console plugin not found - operator may not be installed');
    } else {
      cy.log('Console plugin found via operator deployment');
      checkPluginInstalled();
    }
  });
};

describe('Console plugin tests', () => {
  before(() => {
    cy.login();
    cy.closeGuidedTour();

    if (!isLocalDevEnvironment) {
      console.log('Verifying operator-managed console plugin deployment');
      verifyOperatorDeployment();
    } else {
      console.log('Local development environment - assuming plugin is running via yarn start');
    }
  });

  afterEach(() => {
    checkErrors();
  });

  after(() => {
    // No cleanup needed for operator-managed deployment
    cy.logout();
  });

  it('Verify the pattern catalog can be reached from the dashboard', () => {
    cy.get('[data-test="nav"]').contains('Patterns').click() //expand
    cy.get('[data-test="nav"]')
        .contains(/^Catalog$/).click();
 
    cy.url().should('include', '/patterns');
    cy.get('[data-test="pattern-catalog-page-title"]').should('contain', 'Pattern Catalog');
  });
});
