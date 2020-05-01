import { CoinType } from 'core/types'

enum IneligibilityReason {
  KYC_TIER,
  BLOCKED,
  REGION
}

export type InterestAccountBalanceType = {
  BTC: {
    balance: number
    fiatAmount: number
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

export type InterestAccountType = {
  accountRef: string // actually the btc deposit address
}

export type InterestRateType = {
  BTC: number
}

export type InterestTransactionType = {
  amount: {
    symbol: CoinType
    value: string
  }
  extraAttributes?: {
    txHash: string
  }
  id: string

  insertedAt: string
  state: 'FAILED' | 'REJECTED' | 'PROCESSING' | 'COMPLETE'
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'INTEREST_OUTGOING'
}

export type InterestTransactionResponseType = {
  items: Array<InterestTransactionType>
}
