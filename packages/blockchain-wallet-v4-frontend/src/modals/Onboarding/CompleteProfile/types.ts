export type COMPLETE_PROFILE_STEPS =
  | 'EMAIL_VERIFICATION'
  | 'KYC_VERIFICATION'
  | 'SELF_CLASSIFICATION'
  | 'FINPROMS_ASSESSMENT'
  | 'BUY_CRYPTO'
  | 'DEPOSIT_CRYPTO'

export type ResponseShape = {
  action: string
  iconUrl: string
  id: COMPLETE_PROFILE_STEPS
  metadata?: { countdownDate: string }
  status: 'IDLE' | 'PENDING' | 'COMPLETED' | 'DISABLED'
  subtitle: string
  title: string
}
