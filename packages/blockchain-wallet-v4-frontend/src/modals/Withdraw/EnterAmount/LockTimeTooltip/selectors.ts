import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { lift } from 'ramda'

import { selectors } from 'data'

export const getData = state => {
  const withdrawLockCheckR = selectors.components.send.getWithdrawLockCheckRule(
    state
  )

  return lift(
    (withdrawLockCheck: ExtractSuccess<typeof withdrawLockCheckR>) => ({
      withdrawLockCheck
    })
  )(withdrawLockCheckR)
}
