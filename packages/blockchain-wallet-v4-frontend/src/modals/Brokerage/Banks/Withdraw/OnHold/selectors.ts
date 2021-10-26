import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const withdrawalLocksR = selectors.components.withdraw.getWithdrawalLocks(state)
  const withdrawableBalanceR = selectors.components.brokerage.getWithdrawableBalance(state)

  return lift(
    (
      withdrawalLocks: ExtractSuccess<typeof withdrawalLocksR>,
      withdrawableBalance: ExtractSuccess<typeof withdrawableBalanceR>
    ) => ({
      withdrawableBalance,
      withdrawalLocks
    })
  )(withdrawalLocksR, withdrawableBalanceR)
}
