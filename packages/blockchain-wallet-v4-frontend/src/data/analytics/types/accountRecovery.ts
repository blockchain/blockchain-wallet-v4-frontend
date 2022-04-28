// Account Recovery Events
export enum Events {
  RECOVERY_CLOUD_BACKUP_CODE_SCANNED = 'Cloud Backup Code Scanned',
  RECOVERY_FAILED = 'Account Recovery Failed',
  RECOVERY_IMPORT_WALLET_CANCELLED = 'Import Wallet Cancelled',
  RECOVERY_IMPORT_WALLET_CLICKED = 'Import Wallet Clicked',
  RECOVERY_IMPORT_WALLET_CONFIRMED = 'Import Wallet Confirmed',
  RECOVERY_OPTION_SELECTED = 'Recovery Option Selected',
  RECOVERY_PASSWORD_RESET = 'Account Password Reset',
  RECOVERY_PHRASE_ENTERED = 'Recovery Phrase Entered',
  RECOVERY_RESET_ACCOUNT_CANCELLED = 'Reset Account Cancelled',
  RECOVERY_RESET_ACCOUNT_CLICKED = 'Reset Account Clicked'
}

type AccountRecoveryActions = {
  key:
    | Events.RECOVERY_CLOUD_BACKUP_CODE_SCANNED
    | Events.RECOVERY_FAILED
    | Events.RECOVERY_IMPORT_WALLET_CANCELLED
    | Events.RECOVERY_IMPORT_WALLET_CLICKED
    | Events.RECOVERY_IMPORT_WALLET_CONFIRMED
    | Events.RECOVERY_OPTION_SELECTED
    | Events.RECOVERY_PASSWORD_RESET
    | Events.RECOVERY_PHRASE_ENTERED
    | Events.RECOVERY_RESET_ACCOUNT_CANCELLED
    | Events.RECOVERY_RESET_ACCOUNT_CLICKED
  properties: {}
}

// track event actions to be used inside codebase when we do trigger event
export type TrackEventAction = AccountRecoveryActions
