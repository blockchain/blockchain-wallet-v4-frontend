import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'

const getData = (state) => {
  const withdrawalLocksR = selectors.components.withdraw.getWithdrawalLocks(state)

  return lift((withdrawalLocks: ExtractSuccess<typeof withdrawalLocksR>) => ({
    withdrawalLocks
  }))(withdrawalLocksR)
}

export default getData
