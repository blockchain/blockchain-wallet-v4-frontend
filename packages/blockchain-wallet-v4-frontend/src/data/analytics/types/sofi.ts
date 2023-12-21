import { type } from 'os'

// Log in Events
export enum Events {
  SOFI_MIGRATION_DASHBOARD_SHOWED = 'Sofi Migration Dashboard Showed',
  SOFI_MIGRATION_IN_PROGRESS_SHOWED = 'Sofi Migration In Progress Showed',
  SOFI_MIGRATION_NEED_SSN_CONTINUE_CLICKED = 'Sofi Migration Need SSN Continue Clicked',
  SOFI_MIGRATION_NEED_SSN_SHOWED = 'Sofi Migration Need SSN Showed',
  SOFI_MIGRATION_SUCCESS_ASSETS_SHOWED = 'Sofi Migration Success Assets Showed',
  SOFI_MIGRATION_WELCOME_SHOWED = 'Sofi Migration Welcome Showed'
}

type SofiMigrationDashboardShowed = {
  key: Events.SOFI_MIGRATION_DASHBOARD_SHOWED
  properties: {}
}

type SofiMigrationNeedSsnShowed = {
  key: Events.SOFI_MIGRATION_NEED_SSN_SHOWED
  properties: {}
}

type SofiMigrationSuccessAssetsShowed = {
  key: Events.SOFI_MIGRATION_SUCCESS_ASSETS_SHOWED
  properties: {}
}

type SofiMigrationWelcomeShowed = {
  key: Events.SOFI_MIGRATION_WELCOME_SHOWED
  properties: {}
}

type SofiMigrationNeedSsnContinueClicked = {
  key: Events.SOFI_MIGRATION_NEED_SSN_CONTINUE_CLICKED
  properties: {}
}

type SofiMigrationInProgressShowed = {
  key: Events.SOFI_MIGRATION_IN_PROGRESS_SHOWED
  properties: {}
}

// track event actions to be used inside codebase when we do trigger event
export type TrackEventAction =
  | SofiMigrationDashboardShowed
  | SofiMigrationNeedSsnShowed
  | SofiMigrationSuccessAssetsShowed
  | SofiMigrationWelcomeShowed
  | SofiMigrationNeedSsnContinueClicked
  | SofiMigrationInProgressShowed
