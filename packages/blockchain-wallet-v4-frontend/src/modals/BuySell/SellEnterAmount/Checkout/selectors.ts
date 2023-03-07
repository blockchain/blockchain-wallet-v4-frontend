import { lift } from 'ramda'

import { BSPaymentTypes, CrossBorderLimits, ExtractSuccess } from '@core/types'
import { model, selectors } from 'data'
import { RootState } from 'data/rootReducer'

const { FORM_BS_CHECKOUT } = model.components.buySell

const getData = (state: RootState) => {
  const coin = selectors.components.buySell.getCryptoCurrency(state) || 'BTC'
  const formErrors = selectors.form.getFormSyncErrors(FORM_BS_CHECKOUT)(state)
  const paymentR = selectors.components.buySell.getPayment(state)
  const quoteR = selectors.components.buySell.getSellQuote(state)
  const ratesR = selectors.core.data.misc.getRatesSelector(coin, state)
  const sbBalancesR = selectors.components.buySell.getBSBalances(state)
  const userDataR = selectors.modules.profile.getUserData(state)
  const sddLimitR = selectors.components.buySell.getUserLimit(state, BSPaymentTypes.PAYMENT_CARD)
  const cardsR = selectors.components.buySell.getBSCards(state) || []
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

  const productsR = selectors.custodial.getProductEligibilityForUser(state)

  return lift(
    (
      cards: ExtractSuccess<typeof cardsR>,
      quote: ExtractSuccess<typeof quoteR>,
      rates: ExtractSuccess<typeof ratesR>,
      sbBalances: ExtractSuccess<typeof sbBalancesR>,
      userData: ExtractSuccess<typeof userDataR>,
      sddLimit: ExtractSuccess<typeof sddLimitR>,
      products: ExtractSuccess<typeof productsR>
    ) => ({
      bankTransferAccounts,
      cards,
      crossBorderLimits,
      formErrors,
      hasFiatBalance,
      hasPaymentAccount: hasFiatBalance || cards.length > 0 || bankTransferAccounts.length > 0,
      isRecurringBuy,
      limits: limitsR.getOrElse(undefined),
      payment: paymentR.getOrElse(undefined),
      products,
      quote,
      rates,
      sbBalances,
      sddLimit,
      userData
    })
  )(cardsR, quoteR, ratesR, sbBalancesR, userDataR, sddLimitR, productsR)
}

export default getData
