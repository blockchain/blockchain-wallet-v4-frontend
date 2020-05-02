import { CoinType } from 'core/types'

export type InterestAccountBalanceType = {
  [key in CoinType]: {
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
  ineligibilityReason: 'KYC_TIER' | 'BLOCKED' | 'REGION'
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
  extraAttributes: {
    txHash: string
  }
  id: string

  insertedAt: string
  state: 'FAILED' | 'REJECTED' | 'PROCESSING' | 'COMPLETE' | 'PENDING'
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'INTEREST_OUTGOING'
}

export type InterestTransactionResponseType = {
  items: Array<InterestTransactionType>
}
