import { CoinType, FiatType } from '@core/types'
import { DexToken } from 'data/types'

export type SelectTokenListContainerProps = {
  onTokenSelect: (token: CoinType) => void
  search?: string
  swapSide: 'BASE' | 'COUNTER'
  walletCurrency: FiatType
}

export type SelectTokenListProps = {
  baseToken?: CoinType
  counterToken?: CoinType
  items: DexToken[]
} & SelectTokenListContainerProps
