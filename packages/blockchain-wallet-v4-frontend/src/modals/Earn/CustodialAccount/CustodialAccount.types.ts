import { CoinType } from '@core/types'

export type PropsType = {
  coin: CoinType
  cryptoAmount: string
  fiatAmount: string
  product: 'Active Rewards' | 'Trading' | 'Staking'
}
