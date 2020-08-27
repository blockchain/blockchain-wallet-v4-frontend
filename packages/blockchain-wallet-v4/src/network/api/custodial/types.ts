import {
  AgentType,
  CoinType,
  FiatType,
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

export type NabuMoneyFloatType = {
  symbol: CoinType | FiatType
  value: string
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
  product: 'SIMPLEBUY'
  state: 'NONE'
  user: string
}
