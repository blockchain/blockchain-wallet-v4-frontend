import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const exchangeLoginR = selectors.auth.getExchangeLogin(state)
  const walletLoginR = selectors.auth.getLogin(state)

  return lift(
    (
      exchangeLogin: ExtractSuccess<typeof exchangeLoginR>,
      walletLogin: ExtractSuccess<typeof walletLoginR>
    ) => ({
      exchangeLogin,
      walletLogin
    })
  )(exchangeLoginR, walletLoginR)
}
