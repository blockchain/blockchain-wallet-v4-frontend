import { lift } from 'ramda'

import { RemoteDataType, WithdrawalLockResponseType } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { UserTradingCurrencies } from 'data/types'

type OnHoldSelectorType = {
  tradingCurrencies: UserTradingCurrencies
  withdrawalLocks: WithdrawalLockResponseType
}

export const getData = (state: RootState): RemoteDataType<string, OnHoldSelectorType> => {
  const withdrawalLocksR = selectors.components.withdraw.getWithdrawalLocks(state)
  const tradingCurrenciesR = selectors.modules.profile.getUserCurrencies(state)

  return lift((tradingCurrencies, withdrawalLocks) => ({
    tradingCurrencies,
    withdrawalLocks
  }))(tradingCurrenciesR, withdrawalLocksR)
}
