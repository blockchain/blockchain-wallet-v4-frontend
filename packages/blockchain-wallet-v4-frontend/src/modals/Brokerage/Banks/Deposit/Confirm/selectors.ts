import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const withdrawLockCheckR = selectors.components.send.getWithdrawLockCheckRule(state)
  const depositTermsR = selectors.components.brokerage.getDepositTerms(state)

  return lift(
    (
      depositTerms: ExtractSuccess<typeof depositTermsR>,
      withdrawLockCheck: ExtractSuccess<typeof withdrawLockCheckR>
    ) => ({
      depositTerms,
      withdrawLockCheck
    })
  )(depositTermsR, withdrawLockCheckR)
}

export default getData
