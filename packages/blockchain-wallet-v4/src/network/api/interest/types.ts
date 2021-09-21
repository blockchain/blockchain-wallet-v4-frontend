import { CoinType, FiatType, NabuMoneyFloatType, WalletFiatType } from 'core/types'

export type InterestBalanceType = {
  balance: string
  fiatAmount: string | null
  locked: string
  pendingDeposit: string
  pendingInterest: string
  pendingWithdrawal: string
  totalInterest: string
}

export type InterestAccountBalanceType = {
  [key in CoinType]?: InterestBalanceType
}

export type InterestEligibleType = {
  [key in CoinType]?: {
    eligible: boolean
    ineligibilityReason: 'KYC_TIER' | 'BLOCKED' | 'REGION' | null
  }
}

export type InterestAfterTransactionType = {
  amount: number
  currency: CoinType
  fiatAmount: number | null
  fiatCurrency: WalletFiatType | null
  show: boolean
}

type LimitDetails = {
  amount: number
  currency: WalletFiatType
  savingsCurrency: CoinType
}

export type DepositLimits = {
  depositLimits: LimitDetails[] | []
}

export type WithdrawLimits = {
  withdrawLimits: LimitDetails
}

export type InterestInstrumentsResponseType = { instruments: CoinType[] }
export type InterestInstrumentsType = Array<CoinType>

export type InterestFormErrorsType = {
  depositAmount?: 'ABOVE_MAX' | 'BELOW_MIN' | boolean
}

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
    address?: 'string'
    confirmations?: number
    hash?: string
    id?: string
    transferType?: string
    txHash?: string
  }
  id: string
  insertedAt: string
  state:
    | 'FAILED'
    | 'REJECTED'
    | 'PROCESSING'
    | 'COMPLETE'
    | 'PENDING'
    | 'MANUAL_REVIEW'
    | 'CLEARED'
    | 'REFUNDED'
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

export type WithdrawalMinimumType = Array<NabuMoneyFloatType>
export type WithdrawalMinimumTypeResponse = {
  feeType: 'NETWORK'
  fees: Array<NabuMoneyFloatType>
  minAmounts: Array<NabuMoneyFloatType>
}

export type CustodialTransferResponseType = {
  amount: string
  coin: CoinType
}

export type InterestEDDStatus = {
  eddNeeded: boolean
  eddPassed: boolean
}

export type InterestEDDDocumentsResponse = {
  categories: Array<string>
  maxAllowedFileSizeMBs: number
  maxNumAllowedFiles: number
  validTypes: Array<string>
}

export type FileUploadItem = {
  category: string
  file: string
}

export type UploadDocumentDetails = {
  expectedDeposits: string
  occupation: string
  ssn?: string
}
