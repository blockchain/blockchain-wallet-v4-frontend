import { formValueSelector } from 'redux-form'
import { lift, path } from 'ramda'
import { selectors } from 'data'

export const getProfileData = (state) => {
  const profile = selectors.core.data.coinify.getProfile(state)
  const kycs = selectors.core.data.coinify.getSortedKycs(state)
  return lift((profile, kycs) => ({ profile, kycs }))(profile, kycs)
}

export const getTrades = (state) =>
  selectors.core.data.coinify.getTrades(state).getOrElse(null)

export const getSubscriptions = (state) => selectors.core.data.coinify.getSubscriptions(state).getOrElse([])

export const getRateQuote = (state) => {
  try {
    return selectors.core.data.coinify.getRateQuote(state)
  } catch (e) {
    return null
  }
}

export const getTrade = (state) =>
  selectors.core.data.coinify.getTrade(state).getOrElse(null)

export const getQuote = (state) => {
  try {
    return selectors.core.data.coinify.getQuote(state)
  } catch (e) {
    return null
  }
}

export const getCurrency = (state) => {
  try {
    return selectors.core.data.coinify.getLevel(state)
  } catch (e) {
    return null
  }
}

export const getBase = (state) =>
  path(['form', 'exchangeCheckout', 'active'], state)

export const getErrors = (state) =>
  path(['form', 'exchangeCheckout', 'syncErrors'], state)

export const getData = (state) => ({
  base: getBase(state),
  data: getProfileData(state),
  buyQuoteR: getQuote(state),
  rateQuoteR: getRateQuote(state),
  trades: getTrades(state),
  subscriptions: getSubscriptions(state),
  trade: getTrade(state),
  errors: getErrors(state),
  currency: formValueSelector('coinifyCheckoutBuy')(state, 'currency'),
  defaultCurrency: getCurrency(state),
  checkoutBusy: path(['coinify', 'checkoutBusy'], state),
  paymentMedium: path(['coinify', 'medium'], state),
  step: path(['coinify', 'checkoutStep'], state),
  coinifyBusy: path(['coinify', 'coinifyBusy'], state),
  canTrade: selectors.core.data.coinify.canTrade(state).getOrElse(false)
})
