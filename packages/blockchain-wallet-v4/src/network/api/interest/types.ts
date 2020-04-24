import { CoinType, FiatType } from 'core/types'

enum IneligibilityReason {
  KYC_TIER,
  BLOCKED,
  REGION
}

export type InterestAccountBalanceType = {
  BTC: {
    balanceAvailable: number
    fiatAmount: number
    fiatCurrency: FiatType
    pendingDeposit: number
    pendingInterest: number
    pendingWithdrawal: number
    totalInterest: number
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
  BTC: number
}

type MoneyType = {
  symbol: FiatType
  value: string
}
export type InterestTransactionType = {
  amount: string
  extraAttributes?: {
    address: string
    confirmations: number
    hmac: string
    txHash: string
  }
  id: string
  insertedAt: string
  state: 'FAILED' | 'REJECTED' | 'PROCESSING' | 'COMPLETE'
  type: 'DEPOSIT' | 'WITHDRAWAL'
}
