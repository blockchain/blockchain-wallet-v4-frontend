import { useSelector } from 'react-redux'

import { CoinBalanceHook } from './types'
import { getCoinSelector } from './utils'

export const useCoinBalance: CoinBalanceHook = ({ coin }) => {
  const { data } = useSelector(getCoinSelector(coin))

  return {
    data
  }
}
