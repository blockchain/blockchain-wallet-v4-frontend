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
  BROKERAGE = 'BROKERAGE',
  DEPOSIT = 'DEPOSIT',
  // Active Rewards
  EARN_CC1W = 'EARN_CC1W',
  SAVINGS = 'SAVINGS',
  SIMPLEBUY = 'SIMPLEBUY',
  STAKING = 'STAKING',
  SWAP = 'SWAP',
  WALLET = 'WALLET'
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

export type WithdrawAmount = { symbol: string; value: string }

export type WithdrawResponseType = {
  amount: WithdrawAmount
  fee?: { symbol: string; value: string }
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

export type CrossBorderLimitItem = {
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

export type CustodialToNonCustodialWithdrawalFeesType = {
  amount: string
  currency: CoinType
  fiatCurrency: FiatType
  paymentMethod: 'BANK_TRANSFER' | 'EASY_TRANSFER' | 'CARD_PAYMENT' | 'CRYPTO_TRANSFER'
}

export type MaxCustodialWithdrawalFeeType = Omit<
  CustodialToNonCustodialWithdrawalFeesType,
  'amount'
>

export type CustodialToNonCustodialWithdrawalFeesAmountType = {
  currency: CoinType
  value: string
}

export type CustodialToNonCustodialWithdrawalFeesFiatAmountType = {
  currency: FiatType
  value: string
}

export type CustodialToNonCustodialWithdrawalFeeType = {
  amount: CustodialToNonCustodialWithdrawalFeesAmountType
  fiat: CustodialToNonCustodialWithdrawalFeesFiatAmountType
  type: 'NETWORK' | 'PROCESSING'
}

export type CustodialToNonCustodialWithdrawalFeesResponseType = {
  fees: CustodialToNonCustodialWithdrawalFeeType[]
  minAmount: {
    amount: CustodialToNonCustodialWithdrawalFeesAmountType
    fiat: CustodialToNonCustodialWithdrawalFeesFiatAmountType
  }
  sendAmount: {
    amount: CustodialToNonCustodialWithdrawalFeesAmountType
    fiat: CustodialToNonCustodialWithdrawalFeesFiatAmountType
  }
  totalFees: {
    amount: CustodialToNonCustodialWithdrawalFeesAmountType
    fiat: CustodialToNonCustodialWithdrawalFeesFiatAmountType
  }
}
