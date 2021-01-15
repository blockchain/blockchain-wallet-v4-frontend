import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const bankAccountsR = selectors.components.brokerage.getBankTransferAccounts(
    state
  )
  const quoteR = selectors.components.simpleBuy.getSBQuote(state)
  const sbBalancesR = selectors.components.simpleBuy.getSBBalances(state)
  const userDataR = selectors.modules.profile.getUserData(state)
  const withdrawLockCheckR = selectors.components.send.getWithdrawLockCheckRule(
    state
  )

  return lift(
    (
      bankAccounts: ExtractSuccess<typeof bankAccountsR>,
      quote: ExtractSuccess<typeof quoteR>,
      sbBalances: ExtractSuccess<typeof sbBalancesR>,
      userData: ExtractSuccess<typeof userDataR>,
      withdrawLockCheck: ExtractSuccess<typeof withdrawLockCheckR>
    ) => ({
      bankAccounts,
      quote,
      sbBalances,
      userData,
      withdrawLockCheck
    })
  )(bankAccountsR, quoteR, sbBalancesR, userDataR, withdrawLockCheckR)
}
