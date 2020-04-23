import { CoinType, FiatType } from 'core/types'

enum IneligibilityReason {
  KYC_TIER,
  BLOCKED,
  REGION
}

export type InterestAccountBalanceType = {
  [key in CoinType]?: {
    balanceAvailable: number
    pendingInterest: number
    totalInterest: number
    pendingWithdrawal: number
    pendingDeposit: number
    fiatAmount: number
    fiatCurrency: FiatType
  }
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

export type InterestRateType = {
  coin: number
}

type MoneyType = {
  symbol: FiatType
  value: string
}
export type InterestTransactionType = {
  amount: MoneyType
  extraAttributes?: {
    address: string
    confirmations: number
    hmac: string
    yxHash: string
  }
  id: string
  insertedAt: string
  state: 'FAILED' | 'REJECTED' | 'PROCESSING' | 'COMPLETE'
  type: 'DEPOSIT' | 'WITHDRAWAL'
}
