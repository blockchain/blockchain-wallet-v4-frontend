import {
  AgentType,
  CoinType,
  FiatType,
  InterestTransactionType,
  SBTransactionType,
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

export type CustodialTxStateType =
  | 'CREATED'
  | 'PENDING'
  | 'PENDING_DEPOSIT'
  | 'UNIDENTIFIED'
  | 'FAILED'
  | 'FRAUD_REVIEW'
  | 'MANUAL_REVIEW'
  | 'REJECTED'
  | 'CLEARED'
  | 'COMPLETE'
  | 'REFUNDED'

export type CustodialTxResponseType = {
  items: Array<SBTransactionType | InterestTransactionType>
  next: string | null
  prev: string | null
}

export type NabuCustodialProductType = 'SIMPLEBUY' | 'SAVINGS' | 'SWAP'

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
  state: CustodialTxStateType
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
