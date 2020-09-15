import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const quoteR = selectors.components.simpleBuy.getSBQuote(state)
  const sbBalancesR = selectors.components.simpleBuy.getSBBalances(state)
  const userDataR = selectors.modules.profile.getUserData(state)

  return lift(
    (
      quote: ExtractSuccess<typeof quoteR>,
      sbBalances: ExtractSuccess<typeof sbBalancesR>,
      userData: ExtractSuccess<typeof userDataR>
    ) => ({ quote, sbBalances, userData })
  )(quoteR, sbBalancesR, userDataR)
}
