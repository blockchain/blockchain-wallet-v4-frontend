import { useSelector } from 'react-redux'

import { selectors } from 'data'
import type { RootState } from 'data/rootReducer'

export const useTokenBalancePreview = (token: string | undefined) => {
  const balance = useSelector((state: RootState) =>
    token ? selectors.balances.getCoinNonCustodialBalance(token)(state) : null
  )

  return balance ? balance.getOrElse(0) : 0
}
