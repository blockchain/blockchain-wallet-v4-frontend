import { Remote } from 'blockchain-wallet-v4/src'
import { VERIFY_IDENTITY } from './actionTypes'

export const EMAIL_STEPS = {
  edit: 'edit',
  verify: 'verify'
}

// State
export interface IdentityVerificationState {
  addressRefetchVisible: boolean
  verificationStep?: number
  smsStep: typeof Remote
  emailStep: typeof EMAIL_STEPS
  supportedCountries: typeof Remote
  supportedDocuments: typeof Remote
  flowConfig: typeof Remote
  preIdvData: typeof Remote
  states: typeof Remote
  steps: typeof Remote
}

// Actions
interface VerifyIdentityAction {
  type: typeof VERIFY_IDENTITY
  payload: {
    tier: number
    isCoinify?: boolean
    needMoreInfo?: boolean
  }
}

export type IdentityVerificationActionTypes = VerifyIdentityAction
