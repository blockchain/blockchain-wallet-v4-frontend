export enum COMPLETE_PROFILE_STEPS {
  BUY_CRYPTO = 'BUY_CRYPTO',
  LINK_PAYMENT = 'LINK_PAYMENT',
  VERIFY = 'VERIFY'
}

export type ActionButtonType = {
  currentStep: number
  onClick: () => void
}
