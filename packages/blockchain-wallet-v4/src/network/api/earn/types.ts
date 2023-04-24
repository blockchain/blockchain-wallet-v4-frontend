import { CoinType, FiatType, NabuMoneyFloatType, WalletFiatType } from '@core/types'

export type EarnApiProductType = 'staking' | 'savings' | 'EARN_CC1W'

export type CapProductType = 'STAKING' | 'SAVINGS' | 'EARN_CC1W'

export type EarnAccountBalanceType = {
  ccy?: CoinType
  din?: FiatType
  product: EarnApiProductType
}

export type EarnBalanceType = {
  balance: string
  bondingDeposits: string
  earningBalance: string
  fiatAmount: string | null
  locked: string
  pendingDeposit: string
  pendingInterest: string
  pendingWithdrawal: string
  totalInterest: string
  totalRewards: string
  unbondingWithdrawals: string
}

export type EarnAccountBalanceResponseType = {
  [key in CoinType]?: EarnBalanceType
}
export type EarnBondingDepositsParamType = {
  ccy?: CoinType
  product: string
}
export type EarnBondingDepositsType = {
  amount: string
  bondingDays: number
  bondingExpiryDate: string
  bondingStartDate: string
  currency: CoinType
  insertedAt: string
  isCustodialTransfer: boolean
  paymentRef: string
  product: string
  userId: string
}

export type EarnUnbondingWithdrawalsType = {
  amount: string
  currency: CoinType
  insertedAt: string
  paymentRef: string
  product: string
  unbondingDays: number
  unbondingExpiryDate: string
  unbondingStartDate: string
  userId: string
}

export type EarnBondingDepositsResponseType = {
  bondingDeposits: Array<EarnBondingDepositsType>
  unbondingWithdrawals: Array<EarnUnbondingWithdrawalsType>
} | null

// If user is eligible it will send {coin: eligibleType} otherwise it will send EligibleType only
type EligibleType = {
  eligible: boolean
  ineligibilityReason: 'KYC_TIER' | 'BLOCKED' | 'REGION' | 'UNSUPPORTED_COUNTRY_OR_STATE' | null
}
export type EarnEligibleType =
  | {
      [key in CoinType]?: EligibleType
    }
  | EligibleType

export type EarnTransactionParamType = {
  currency?: CoinType
  nextPageUrl?: string
  product: CapProductType
}

export type EarnAfterTransactionType = {
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

export type EarnDepositLimits = {
  depositLimits: LimitDetails[] | []
}

export type WithdrawLimits = {
  withdrawLimits: LimitDetails
}

export type EarnDepositErrorsType = {
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

export type EarnAccountType = {
  coin: CoinType
  product: EarnApiProductType
}

export type EarnAccountResponseType = {
  accountRef: string // actually the btc deposit address
}

export type RewardsRatesType = {
  rates: {
    [key in CoinType]: number
  }
}

export type EarnRatesType = {
  rates: {
    [key in CoinType]: {
      commission: number
      rate: number
      triggerPrice?: string
    }
  }
}

export type StakingAccountCoinType = {
  balance: string
  depositsBonding: string
  locked: string
  pendingDeposit: string
  pendingRewards: string
  pendingWithdrawal: string
  totalRewards: string
  withdrawalsUnbonding: string
}

export type StakingAccountType =
  | {
      [key in CoinType]: StakingAccountCoinType
    }
  | undefined

export type TransactionType = {
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
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'INTEREST_OUTGOING' | 'DEBIT'
}

export type EarnTransactionResponseType = {
  items: Array<TransactionType>
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

export type EarnEDDStatus = {
  eddNeeded: boolean
  eddPassed: boolean
  eddSubmitted: boolean
}

export type EarnEDDDocumentsResponse = {
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

export type StakingLimitType = {
  bondingDays: number
  disabledWithdrawals: boolean
  minDepositValue: string
  unbondingDays: number
}

export type ActiveRewardsLimitType = {
  bondingDays: number
  minDepositValue: string
  rewardFrequency: string
  unbondingDays: number
}

export type EarnLimitsType = {
  [key in CoinType]: StakingLimitType | ActiveRewardsLimitType
}

export type EarnLimitsResponse = {
  limits: EarnLimitsType
}
