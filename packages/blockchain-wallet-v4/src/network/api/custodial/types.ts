import {
  AgentType,
  CoinType,
  FiatType,
  SBTransactionStateType,
  WalletCurrencyType,
  WalletFiatType
} from 'core/types'

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

export type NabuCustodialProductType = 'SWAP' | 'SIMPLEBUY' | 'SAVINGS'

export type WithdrawalFeesProductType = 'simplebuy' | 'mercurial'

export type NabuMoneyFloatType = {
  symbol: CoinType | FiatType
  value: string
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
  state: SBTransactionStateType
  txHash: string
  updatedAt: string
}

export type WithdrawalLock = {
  attributes: {}
  expiresAt: string
  id: string
  insertedAt: string
  lockRuleId: string
  paymentId: string
  updatedAt: string
  usdAmount: NabuMoneyFloatType
  userId: string
}

export type WithdrawalLockResponseType = {
  locks: Array<WithdrawalLock>
}

export type WithdrawResponseType = {
  amount: { symbol: WalletFiatType; value: string }
  id: string
  product: NabuCustodialProductType
  state: 'NONE'
  user: string
}

export type WithdrawalMinsAndFeesResponse = {
  feeType: 'NETWORK'
  fees: Array<NabuMoneyFloatType>
  minAmounts: Array<NabuMoneyFloatType>
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
  type: 'PAYMENT_CARD' | 'BANK_ACCOUNT'
}
