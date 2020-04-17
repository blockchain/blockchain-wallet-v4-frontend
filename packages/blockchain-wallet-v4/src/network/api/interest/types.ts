import { CoinType } from 'core/types'

enum IneligibilityReason {
  KYC_TIER,
  BLOCKED,
  REGION
}

export type InterestEligibleType = {
  eligible: boolean
  ineligibilityReason: IneligibilityReason
}

export type InterestInstrumentsType = Array<CoinType>

export type InterestLimitsType = {
  [key in CoinType]?: {
    lockUp: number
    maxAutomaticWithdrawal: number
    minimumDeposit: number
  }
}

export type InterestPaymentAccountType = {
  depositAddress: string
}
