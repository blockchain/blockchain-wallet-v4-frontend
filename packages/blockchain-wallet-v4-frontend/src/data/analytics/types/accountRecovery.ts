// Account Recovery Events
export enum AccountRecoveryEvents {
  ACCOUNT_RECOVERY_2FA_ACTIVATION = 'Account Recovery 2FA Activation',
  ACCOUNT_RECOVERY_2FA_CONFIRMED = 'Account Recovery 2FA Confirmed',
  ACCOUNT_RECOVERY_2FA_DISMISSED = 'Account Recovery 2FA Dismissed',
  ACCOUNT_RECOVERY_2FA_PROMPTED = 'Account Recovery 2FA Prompted',
  ACCOUNT_RECOVERY_EMAIL_CLICKED = 'Account Recovery Email Clicked',
  ACCOUNT_RECOVERY_EMAIL_SENT = 'Account Recovery Email Sent',
  ACCOUNT_RECOVERY_FORGOT_PASSWORD_VIEWED = 'Account Recovery Forgot Password Viewed',
  ACCOUNT_RECOVERY_PROCESS_COMPLETED = 'Accounts Recovery Process Completed',
  RECOVERY_CLOUD_BACKUP_CODE_SCANNED = 'Cloud Backup Code Scanned',
  RECOVERY_FAILED = 'Account Recovery Failed',
  RECOVERY_IMPORT_WALLET_CANCELLED = 'Import Wallet Cancelled',
  RECOVERY_IMPORT_WALLET_CLICKED = 'Import Wallet Clicked',
  RECOVERY_IMPORT_WALLET_CONFIRMED = 'Import Wallet Confirmed',
  RECOVERY_OPTION_SELECTED = 'Recovery Option Selected',
  RECOVERY_PASSWORD_RESET = 'Account Password Reset',
  RECOVERY_PHRASE_ENTERED = 'Recovery Phrase Entered',
  RECOVERY_RESET_ACCOUNT_CANCELLED = 'Reset Account Cancelled',
  RECOVERY_RESET_ACCOUNT_CLICKED = 'Reset Account Clicked',
  RECOVER_FUNDS_CLICKED = 'Recover Funds Clicked'
}

export type AccountRecoveryActions = {
  key: AccountRecoveryEvents
  properties: {}
}
