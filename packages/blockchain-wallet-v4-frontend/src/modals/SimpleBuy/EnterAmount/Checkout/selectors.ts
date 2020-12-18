import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

import { OwnProps } from '.'

export const getData = (state: RootState, ownProps: OwnProps) => {
  const coin = selectors.components.simpleBuy.getCryptoCurrency(state) || 'BTC'
  const formErrors = selectors.form.getFormSyncErrors('simpleBuyCheckout')(
    state
  )
  // used for sell only now, eventually buy as well
  // TODO: use swap2 quote for buy AND sell
  const paymentR = selectors.components.simpleBuy.getPayment(state)
  const quoteR =
    ownProps.orderType === 'BUY'
      ? selectors.components.simpleBuy.getSBQuote(state)
      : selectors.components.simpleBuy.getSellQuote(state)
  const ratesR = selectors.core.data.misc.getRatesSelector(coin, state)
  const sbBalancesR = selectors.components.simpleBuy.getSBBalances(state)
  const userDataR = selectors.modules.profile.getUserData(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  return lift(
    (
      quote: ExtractSuccess<typeof quoteR>,
      rates: ExtractSuccess<typeof ratesR>,
      sbBalances: ExtractSuccess<typeof sbBalancesR>,
      userData: ExtractSuccess<typeof userDataR>,
      supportedCoins: ExtractSuccess<typeof supportedCoinsR>
    ) => ({
      coinModel: supportedCoins[coin],
      supportedCoins,
      formErrors,
      quote,
      payment: paymentR.getOrElse(undefined),
      rates,
      sbBalances,
      userData
    })
  )(quoteR, ratesR, sbBalancesR, userDataR, supportedCoinsR)
}
