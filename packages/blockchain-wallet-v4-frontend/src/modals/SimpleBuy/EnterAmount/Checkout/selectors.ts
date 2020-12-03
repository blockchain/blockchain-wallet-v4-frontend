import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const coin = selectors.components.simpleBuy.getCryptoCurrency(state) || 'BTC'
  const formErrors = selectors.form.getFormSyncErrors('simpleBuyCheckout')(
    state
  )
  const invitationsR = selectors.core.settings.getInvitations(state)
  const quoteR = selectors.components.simpleBuy.getSBQuote(state)
  const ratesR = selectors.core.data.misc.getRatesSelector(coin, state)
  const sbBalancesR = selectors.components.simpleBuy.getSBBalances(state)
  const userDataR = selectors.modules.profile.getUserData(state)
  const sddEligibleR = selectors.components.simpleBuy.getSddEligible(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)

  return lift(
    (
      invitations: ExtractSuccess<typeof invitationsR>,
      quote: ExtractSuccess<typeof quoteR>,
      rates: ExtractSuccess<typeof ratesR>,
      sbBalances: ExtractSuccess<typeof sbBalancesR>,
      userData: ExtractSuccess<typeof userDataR>,
      sddEligible: ExtractSuccess<typeof sddEligibleR>,
      supportedCoins: ExtractSuccess<typeof supportedCoinsR>
    ) => ({
      coinModel: supportedCoins[coin],
      formErrors,
      invitations,
      isSddFlow: sddEligible.eligible || userData?.tiers?.current === 3,
      quote,
      rates,
      sbBalances,
      supportedCoins,
      userData
    })
  )(
    invitationsR,
    quoteR,
    ratesR,
    sbBalancesR,
    userDataR,
    sddEligibleR,
    supportedCoinsR
  )
}
