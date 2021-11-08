import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'

const getData = (state) => {
  const withdrawalLocksR = selectors.components.withdraw.getWithdrawalLocks(state)
  const onHold = selectors.core.walletOptions.getWithdrawalLocksFundsOnHold(state).getOrElse(false)

  return lift((withdrawalLocks: ExtractSuccess<typeof withdrawalLocksR>) => ({
    onHold,
    withdrawalLocks
  }))(withdrawalLocksR)
}

export default getData
