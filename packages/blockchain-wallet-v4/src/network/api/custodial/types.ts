import { AgentType, WalletFiatType } from 'core/types'

export type BeneficiaryType = {
  address: string
  agent: AgentType
  currency: WalletFiatType
  id: string
  name: string
  state: 'CREATED' | 'ACTIVE' | 'UNDER_REVIEW' | 'DISABLED'
  whitelisted: boolean
}

export type BeneficiariesType = Array<BeneficiaryType>

export type WithdrawResponseType = {
  amount: { symbol: WalletFiatType; value: string }
  id: string
  product: 'SIMPLEBUY'
  state: 'NONE'
  user: string
}
