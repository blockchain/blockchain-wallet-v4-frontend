import { CoinType } from '@core/types'
import { SwapBaseCounterTypes } from 'data/components/swap/types'
import { SwapAccountType } from 'data/types'

export const makeAccount = (): SwapAccountType => ({
  balance: '200000',
  baseCoin: 'BTC',
  coin: 'BTC' as CoinType,
  label: 'Trading Wallet',
  type: SwapBaseCounterTypes.ACCOUNT
})
export const makeBaseAccount = (): SwapAccountType => ({
  balance: '200000',
  baseCoin: 'BTC',
  coin: 'BTC' as CoinType,
  label: 'Trading Wallet',
  type: SwapBaseCounterTypes.ACCOUNT
})
export const makeCounterAccount = (): SwapAccountType => ({
  balance: '200000',
  baseCoin: 'ETH',
  coin: 'ETH' as CoinType,
  label: 'Trading Wallet',
  type: SwapBaseCounterTypes.ACCOUNT
})
