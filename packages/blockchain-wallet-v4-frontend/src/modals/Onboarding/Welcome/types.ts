export type ResponseShape = {
  action: string
  iconUrl: string
  id:
    | 'EMAIL_VERIFICATION'
    | 'KYC_VERIFICATION'
    | 'SELF_CLASSIFICATION'
    | 'FINPROMS_ASSESSMENT'
    | 'BUY_CRYPTO'
    | 'DEPOSIT_CRYPTO'
  metadata?: { countdownDate: string }
  status: 'IDLE' | 'PENDING' | 'COMPLETED' | 'DISABLED'
  subtitle: string
  title: string
}
