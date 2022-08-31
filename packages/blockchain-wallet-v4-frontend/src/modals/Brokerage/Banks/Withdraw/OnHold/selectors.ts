import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const withdrawalLocksR = selectors.components.withdraw.getWithdrawalLocks(state)
  const tradingCurrenciesR = selectors.modules.profile.getUserCurrencies(state)

  return lift(
    (
      tradingCurrencies: ExtractSuccess<typeof tradingCurrenciesR>,
      withdrawalLocks: ExtractSuccess<typeof withdrawalLocksR>
    ) => ({
      tradingCurrencies,
      withdrawalLocks
    })
  )(tradingCurrenciesR, withdrawalLocksR)
}
