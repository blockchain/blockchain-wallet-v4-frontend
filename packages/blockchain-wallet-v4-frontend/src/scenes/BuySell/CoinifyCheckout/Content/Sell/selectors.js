import { formValueSelector } from 'redux-form'
import { lift, equals, prop } from 'ramda'
import { selectors, model } from 'data'

const { TIERS_STATES } = model.profile

export const getUserData = state => {
  const profile = selectors.core.data.coinify.getProfile(state)
  const payment = selectors.components.coinify.getCoinifyPayment(state)
  return lift((profile, payment) => ({ profile, payment }))(profile, payment)
}

export const getTrades = state =>
  selectors.core.data.coinify.getTrades(state).getOrElse(null)

export const getTrade = state =>
  selectors.core.data.coinify.getTrade(state).getOrElse(null)

export const getQuote = state => selectors.core.data.coinify.getQuote(state)

export const getCurrency = state => selectors.core.data.coinify.getLevel(state)

export const getData = state => {
  const kycState = selectors.modules.profile
    .getUserKYCState(state)
    .getOrElse(false)
  const tier2Data = selectors.modules.profile.getTier(state, 2).getOrElse(null)
  const kycVerified = equals(prop('state', tier2Data), TIERS_STATES.VERIFIED)
  return {
    data: getUserData(state),
    sellQuoteR: getQuote(state),
    trade: getTrade(state),
    currency: formValueSelector('coinifyCheckoutSell')(state, 'currency'),
    defaultCurrency: getCurrency(state),
    rateQuoteR: selectors.core.data.coinify.getRateQuote(state),
    checkoutBusy: selectors.components.coinify.getCoinifyCheckoutBusy(state),
    paymentMedium: selectors.components.coinify.getCoinifyMedium(state),
    step: selectors.components.coinify.getCoinifyCheckoutStep(state),
    coinifyBusy: selectors.components.coinify.getCoinifyBusy(state),
    checkoutError: selectors.components.coinify.getCoinifyCheckoutError(state),
    canTrade: selectors.core.data.coinify.canTrade(state),
    cannotTradeReason: selectors.core.data.coinify.cannotTradeReason(state),
    canTradeAfter: selectors.core.data.coinify.canTradeAfter(state),
    kycState,
    kycVerified,
    level: selectors.core.data.coinify.getLevel(state)
  }
}
