import { DexTokenWithBalance } from '@core/network/api/dex'
import { CoinType, FiatType } from '@core/types'

export type SelectTokenListContainerProps = {
  onTokenSelect: (token: CoinType) => void
  search?: string
  swapSide: 'BASE' | 'COUNTER'
  walletCurrency: FiatType
}

export type SelectTokenListProps = {
  baseToken?: CoinType
  counterToken?: CoinType
  items: DexTokenWithBalance[]
} & SelectTokenListContainerProps
