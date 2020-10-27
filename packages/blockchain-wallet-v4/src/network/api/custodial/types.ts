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

export type NabuCustodialProductType = 'SIMPLEBUY' | 'SAVINGS'

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

export type CustodialProductType = 'simplebuy' | 'mercurial'

type CheckAttributes = {
  tier: number
}

type WithdrawalLockCheckRule = {
  attributes: CheckAttributes
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
