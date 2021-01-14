import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const quoteR = selectors.components.simpleBuy.getSBQuote(state)
  const sbBalancesR = selectors.components.simpleBuy.getSBBalances(state)
  const userDataR = selectors.modules.profile.getUserData(state)
  const withdrawLockCheckR = selectors.components.send.getWithdrawLockCheckRule(
    state
  )

  return lift(
    (
      quote: ExtractSuccess<typeof quoteR>,
      sbBalances: ExtractSuccess<typeof sbBalancesR>,
      userData: ExtractSuccess<typeof userDataR>,
      withdrawLockCheck: ExtractSuccess<typeof withdrawLockCheckR>
    ) => ({
      quote,
      sbBalances,
      userData,
      withdrawLockCheck
    })
  )(quoteR, sbBalancesR, userDataR, withdrawLockCheckR)
}
