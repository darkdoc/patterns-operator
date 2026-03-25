import { selectors } from "./selectors";

export const getCards = () => cy.get(selectors.patternCard);

export const getFirstCard = () =>
  cy.get(selectors.patternCard).first();

export const getTierToggle = () =>
  cy.get(selectors.tierFilterToggle);

export const openTierFilter = () =>
  getTierToggle().click();

export const closeTierFilter = () =>
  getTierToggle().click();

export const selectTier = (tier: any) =>
  cy.get(selectors.tierOption(tier)).click();

export const hasInstalledCards = () =>
  cy.get('body').then(($body) => {
    return $body.find(selectors.installedLabel).length;
  });

export const getInstalledCards = () =>
  cy.get(selectors.patternCard)
    .filter(`:has(${selectors.installedLabel})`);