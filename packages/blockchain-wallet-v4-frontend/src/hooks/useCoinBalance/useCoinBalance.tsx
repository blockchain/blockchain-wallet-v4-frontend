import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { useRemote } from '../useRemote'
import { CoinBalanceHook } from './useCoinBalance.types'

export const useCoinBalance: CoinBalanceHook = ({ coin }) => {
  return useRemote((state: RootState) => {
    return selectors.balances.getCoinTotalBalance(coin)(state)
  })
}
