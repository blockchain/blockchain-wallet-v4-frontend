// Log in Events
export enum SofiEvents {
  SOFI_MIGRATION_DASHBOARD_SHOWED = 'Sofi Migration Dashboard Showed',
  SOFI_MIGRATION_IN_PROGRESS_SHOWED = 'Sofi Migration In Progress Showed',
  SOFI_MIGRATION_NEED_SSN_CONTINUE_CLICKED = 'Sofi Migration Need SSN Continue Clicked',
  SOFI_MIGRATION_NEED_SSN_SHOWED = 'Sofi Migration Need SSN Showed',
  SOFI_MIGRATION_SUCCESS_ASSETS_SHOWED = 'Sofi Migration Success Assets Showed',
  SOFI_MIGRATION_WELCOME_SHOWED = 'Sofi Migration Welcome Showed'
}

export type SofiActions = {
  key: SofiEvents
  properties: {}
}
