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
