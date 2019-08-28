import { formValueSelector } from 'redux-form'
import { lift, equals, path, prop } from 'ramda'
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
  const tier2Data = selectors.modules.profile.getTier(state, 2).getOrElse(null)
  const kycVerified = equals(prop('state', tier2Data), TIERS_STATES.VERIFIED)
  const country = selectors.core.data.coinify.getCountry(state)
  const mediums = selectors.core.data.coinify.getMediums(state).getOrElse({})
  const canTrade = path(['bank', 'canTrade'], mediums)
  const cannotTradeReason = path(['bank', 'cannotTradeReason'], mediums)

  return {
    canTrade,
    canTradeAfter: selectors.core.data.coinify.canTradeAfter(state),
    cannotTradeReason,
    checkoutBusy: selectors.components.coinify.getCoinifyCheckoutBusy(state),
    checkoutError: selectors.components.coinify.getCoinifyCheckoutError(state),
    coinifyBusy: selectors.components.coinify.getCoinifyBusy(state),
    country,
    currency: formValueSelector('coinifyCheckoutSell')(state, 'currency'),
    data: getUserData(state),
    defaultCurrency: getCurrency(state),
    kycState: selectors.modules.profile.getUserKYCState(state).getOrElse(false),
    kycVerified,
    level: selectors.core.data.coinify.getLevel(state),
    paymentMedium: selectors.components.coinify.getCoinifyMedium(state),
    rateQuoteR: selectors.core.data.coinify.getRateQuote(state),
    sellQuoteR: getQuote(state),
    step: selectors.components.coinify.getCoinifyCheckoutStep(state),
    trade: getTrade(state)
  }
}
