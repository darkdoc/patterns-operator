export const selectors = {
  // PatternCatalogPage
  catalogPageTitle: 'h1:contains("Pattern Catalog")',
  tierFilterToggle: '#content-scrollable .pf-v6-c-menu-toggle',
  patternCard: '.patterns-operator__card',
  installedLabel: '.patterns-operator__installed-label',
  installButton: 'button:contains("Install")',
  uninstallButton: 'button:contains("Uninstall")',
  manageSecretsButton: 'button:contains("Manage Secrets")',
  docsLink: 'a:contains("Docs")',
  repoLink: 'a:contains("Repo")',
  cloudLabel: '.patterns-operator__cloud-labels .pf-v6-c-label',
  spinner: '.pf-v6-c-spinner',
  alertDanger: '.pf-v6-c-alert.pf-m-danger',
  catalogDescription: '#content-scrollable p',

  // InstallPatternPage
  installPageTitle: 'h1:contains("Install Pattern")',
  patternNameInput: '#pattern-name',
  targetRepoInput: '#pattern-target-repo',
  targetRevisionInput: '#pattern-target-revision',
  submitInstallButton: 'button[type="submit"]:contains("Install")',
  cancelButton: 'button:contains("Cancel")',
  secretSection: '.patterns-operator__secret-section',
  secretField: '.patterns-operator__secret-field',

  // UninstallPatternPage
  uninstallPageTitle: 'h1:contains("Uninstall Pattern")',
  confirmUninstallButton: 'button:contains("Confirm Uninstall")',
  uninstallWarning: '.pf-v6-c-alert.pf-m-warning',
  patternStatusCard: '.pf-v6-c-card:contains("Pattern Status")',

  // ManageSecretsPage
  manageSecretsPageTitle: 'h1:contains("Manage Secrets")',
  injectSecretsButton: 'button:contains("Inject Secrets")',
  backToCatalogLink: 'button:contains("Back to catalog")',
  secretForm: '.patterns-operator__secret-form',
  secretConfigAlert: '.pf-v6-c-alert:contains("Secret Configuration")',

  // Tier filter options
  tierOption: (tier: string) => `.pf-v6-c-menu__list-item:contains("${tier}")`,
};