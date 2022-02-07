import {
  AgentType,
  BSPaymentTypes,
  BSTransactionStateType,
  CoinType,
  FiatType,
  WalletAccountType,
  WalletCurrencyType,
  WalletFiatType
} from '@core/types'

export type BeneficiaryType = {
  address: string
  agent: AgentType
  currency: WalletCurrencyType
  id: string
  name: string
  state: 'CREATED' | 'ACTIVE' | 'UNDER_REVIEW' | 'DISABLED'
  whitelisted: boolean
}

export type BeneficiariesType = Array<BeneficiaryType>

export enum ProductTypes {
  SAVINGS = 'SAVINGS',
  SIMPLEBUY = 'SIMPLEBUY',
  SWAP = 'SWAP'
}

export type NabuCustodialProductType = keyof typeof ProductTypes

export type WithdrawalFeesProductType = 'simplebuy' | 'mercury'

export type NabuMoneyFloatType = {
  symbol: CoinType | FiatType
  value: string
}

export type NabuSymbolNumberType = {
  minorValue: string
  symbol: CoinType | FiatType
  value: number
}

export type NabuCurrencyNumberType = {
  currency: CoinType | FiatType
  value: number
}

export type PaymentDepositPendingResponseType = {
  amount: NabuCurrencyNumberType
  depositAddress: string
  id: string
  insertedAt: string
  owner: string
  product: NabuCustodialProductType
  state: BSTransactionStateType
  txHash: string
  updatedAt: string
}

export type WithdrawLockAmount = {
  amount: string
  currency: FiatType
}
export type WithdrawalLock = {
  amount: WithdrawLockAmount
  expiresAt: string
}

export type WithdrawalLockResponseType = {
  locks: Array<WithdrawalLock>
  totalLocked: WithdrawLockAmount
}

export type WithdrawResponseType = {
  amount: { symbol: WalletFiatType; value: string }
  fee?: { symbol: WalletFiatType; value: string }
  id: string
  product: NabuCustodialProductType
  state: 'NONE'
  user: string
}

export type WithdrawalMinsAndFeesResponse = {
  feeType: 'NETWORK'
  fees: Array<NabuSymbolNumberType>
  minAmounts: Array<NabuSymbolNumberType>
}

export type WithdrawalLockCheckRule = {
  attributes: { tier: number }
  id: string
  insertedAt: string
  isActive: boolean
  lockTime: number
  paymentMethod: 'CARD'
  updatedAt: string
}

export type WithdrawalLockCheckResponseType = {
  rule?: WithdrawalLockCheckRule
}

export type CustodialTransferRequestType = {
  amount: string
  currency: CoinType
  destination: NabuCustodialProductType
  origin: NabuCustodialProductType
}

export type IneligibilityReasons =
  | 'INVALID_USER'
  | 'TIER_TOO_LOW'
  | 'INVALID_ADDRESS'
  | 'UNSUPPORTED_CURRENCY'
  | 'UNSUPPORTED_REGION'
  | 'LIMIT_DOES_NOT_EXIST'
  | 'DOCUMENT_NOT_FOUND'
  | 'DOCUMENT_NOT_FROM_UK'
  | 'DOCUMENT_NOT_FROM_TR'
  | 'OTHER'
  | null

export type ProductEligibleResponse =
  | {
      eligible: boolean
      ineligibilityReason: IneligibilityReasons
    }
  | {
      [key in WalletCurrencyType]: EligibleType
    }

export type EligibleType = {
  eligible: boolean
  ineligibilityReason: IneligibilityReasons
}

export type PaymentMethod = {
  currency: FiatType
  eligible: boolean
  ineligibleReason: IneligibilityReasons
  limits: { max: string; min: string }
  subTypes: string[]
  type: BSPaymentTypes.PAYMENT_CARD | BSPaymentTypes.BANK_ACCOUNT
}

export type GetTransactionsHistoryType = {
  currency: WalletCurrencyType
  fromValue?: string
  toValue?: string
}

export type CrossBorderLimitsPayload = {
  currency?: WalletFiatType
  fromAccount: WalletAccountType
  inputCurrency: CoinType
  outputCurrency: CoinType
  toAccount: WalletAccountType
}

type CrossBorderLimitItem = {
  currency: FiatType
  value: string
}

export type LimitWithEffective = {
  effective: boolean
  limit: CrossBorderLimitItem
}

export type CrossBorderLimitSuggestedItem = {
  available: CrossBorderLimitItem
  limit: CrossBorderLimitItem
  used: CrossBorderLimitItem
}

export type CrossBorderLimits = {
  currency: FiatType
  current: {
    available: CrossBorderLimitItem
    daily?: LimitWithEffective
    monthly?: LimitWithEffective
    yearly?: LimitWithEffective
  }
  suggestedUpgrade: {
    available: CrossBorderLimitItem
    daily?: CrossBorderLimitSuggestedItem
    monthly?: CrossBorderLimitSuggestedItem
    requiredTier: number
    requirements: string[]
    yearly?: CrossBorderLimitSuggestedItem
  }
}
