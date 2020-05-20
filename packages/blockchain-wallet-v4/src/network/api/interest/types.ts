import { CoinType, FiatType } from 'core/types'

export type InterestAccountBalanceType = {
  [key in CoinType]?: {
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
  [key in CoinType]: {
    currency: FiatType
    lockUpDuration: number
    maxWithdrawalAmount: number
    minDepositAmount: number
  }
}

export type InterestAccountType = {
  accountRef: string // actually the btc deposit address
}

export type InterestRateType = {
  rates: {
    [key in CoinType]: number
  }
}

export type InterestTransactionType = {
  amount: {
    symbol: CoinType
    value: string
  }
  extraAttributes: {
    address: 'string'
    confirmations: number
    dsr: 100
    hash: string
    id: string
    txHash: string
  }
  id: string
  insertedAt: string
  state: 'FAILED' | 'REJECTED' | 'PROCESSING' | 'COMPLETE' | 'PENDING'
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'INTEREST_OUTGOING'
}

export type InterestTransactionResponseType = {
  items: Array<InterestTransactionType>
  next: string | null
}

export type InterestWithdrawalResponseType = {
  amount: number
  id: string
  product: string
  state: string
  user: string
}
