import { lift } from 'ramda'

import { CrossBorderLimits, ExtractSuccess } from '@core/types'
import { model, selectors } from 'data'
import { RootState } from 'data/rootReducer'

const { FORM_BS_CHECKOUT } = model.components.buySell

const getData = (state: RootState) => {
  const coin = selectors.components.buySell.getCryptoCurrency(state) || 'BTC'
  const formErrors = selectors.form.getFormSyncErrors(FORM_BS_CHECKOUT)(state)
  const paymentR = selectors.components.buySell.getPayment(state)
  const quoteR = selectors.components.buySell.getSellQuotePrice(state)
  const ratesR = selectors.core.data.misc.getRatesSelector(coin, state)
  const sbBalancesR = selectors.components.buySell.getBSBalances(state)
  const userDataR = selectors.modules.profile.getUserData(state)
  const bankTransferAccounts = selectors.components.brokerage
    .getBankTransferAccounts(state)
    .getOrElse([])
  const limitsR = selectors.components.buySell.getLimits(state)
  const hasFiatBalance = selectors.components.buySell.hasFiatBalances(state)

  const isRecurringBuy = selectors.core.walletOptions
    .getFeatureFlagRecurringBuys(state)
    .getOrElse(false) as boolean
  const crossBorderLimits = selectors.components.buySell
    .getCrossBorderLimits(state)
    .getOrElse({} as CrossBorderLimits)

  return lift(
    (
      quote: ExtractSuccess<typeof quoteR>,
      rates: ExtractSuccess<typeof ratesR>,
      sbBalances: ExtractSuccess<typeof sbBalancesR>,
      userData: ExtractSuccess<typeof userDataR>
    ) => ({
      bankTransferAccounts,
      crossBorderLimits,
      formErrors,
      hasFiatBalance,
      hasPaymentAccount: hasFiatBalance || bankTransferAccounts.length > 0,
      isRecurringBuy,
      limits: limitsR.getOrElse(undefined),
      payment: paymentR.getOrElse(undefined),
      quote,
      rates,
      sbBalances,
      userData
    })
  )(quoteR, ratesR, sbBalancesR, userDataR)
}

export default getData
