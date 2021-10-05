import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'

export const getData = (state) => {
  const withdrawLockCheckR = selectors.components.send.getWithdrawLockCheckRule(state)

  return lift((withdrawLockCheck: ExtractSuccess<typeof withdrawLockCheckR>) => ({
    withdrawLockCheck
  }))(withdrawLockCheckR)
}
