import { lift } from 'ramda'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const withdrawLockCheckR = selectors.components.send.getWithdrawLockCheckRule(state)

  return lift((withdrawLockCheck: ExtractSuccess<typeof withdrawLockCheckR>) => ({
    withdrawLockCheck
  }))(withdrawLockCheckR)
}

export default getData
