import { SemanticColors } from '@blockchain-com/constellation'

import {
  CoinType,
  EarnAccountBalanceResponseType,
  EarnBalanceType,
  EarnEDDStatus,
  EarnEligibleType,
  EarnRatesType,
  FiatType,
  PriceChangeType
} from '@core/types'
import { EarnStepMetaData, PendingTransactionType } from 'data/types'

export type DataType = {
  totalBondingDeposits: number
  walletCurrency: FiatType
}

export type RemoteType = {
  accountBalances: EarnAccountBalanceResponseType
  activeRewardsEligible: EarnEligibleType
  activeRewardsRates: EarnRatesType['rates']
  currentPrice: string
  earnEDDStatus: EarnEDDStatus
  hasBalance: boolean
  isActiveRewardsWithdrawalEnabled: boolean
  pendingTransactions: PendingTransactionType[]
  priceChange: PriceChangeType
}

export type PropsType = {
  coin: CoinType
  handleClose: () => void
  showSupply: boolean
  stepMetadata: EarnStepMetaData
}

export type SuccessPropsType = {
  account?: EarnBalanceType
  accountBalanceBase?: string
  activeRewardsBalanceBase?: string
  coin: CoinType
  currentPrice: string
  handleBalanceDropdown: () => void
  handleClose: () => void
  handleCoinToggled: () => void
  handleDepositClick: () => void
  handleEDDSubmitInfo: () => void
  handleTransactionsToggled: () => void
  handleWithdrawal: () => void
  isBalanceDropdownToggled: boolean
  isCoinDisplayed: boolean
  isDepositEnabled?: boolean
  isEDDRequired: boolean
  isTransactionsToggled: boolean
  isWithdrawalEnabled: boolean
  pendingTransactions: Array<PendingTransactionType>
  percentChange: string
  priceChangeColor: SemanticColorsType
  priceChangeSymbol: PriceChangeSymbolType
  rate: number
  showSupply: boolean
  stepMetadata: EarnStepMetaData
  totalBondingDeposits: number
  triggerPrice?: string
  walletCurrency: FiatType
}

export type SemanticColorsType = keyof typeof SemanticColors
export type PriceChangeSymbolType = '' | '+' | '-'
