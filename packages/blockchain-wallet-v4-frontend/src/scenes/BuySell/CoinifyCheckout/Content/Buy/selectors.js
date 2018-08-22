import { formValueSelector } from 'redux-form'
import { lift, path, equals } from 'ramda'
import { selectors } from 'data'

export const getProfileData = state => {
  const profile = selectors.core.data.coinify.getProfile(state)
  const kyc = selectors.core.data.coinify.getKyc(state)
  return lift((profile, kyc) => ({ profile, kyc }))(profile, kyc)
}

export const getTrades = state =>
  selectors.core.data.coinify.getTrades(state).getOrElse(null)

export const getSubscriptions = state =>
  selectors.core.data.coinify.getSubscriptions(state).getOrElse([])

export const getTrade = state =>
  selectors.core.data.coinify.getTrade(state).getOrElse(null)

export const getQuote = state => selectors.core.data.coinify.getQuote(state)

export const getCurrency = state => selectors.core.data.coinify.getLevel(state)

export const getBase = state =>
  path(['form', 'exchangeCheckout', 'active'], state)

export const getErrors = state =>
  path(['form', 'exchangeCheckout', 'syncErrors'], state)

export const showRecurringBuy = state => {
  const countryCode = selectors.core.settings.getCountryCode(state).getOrElse('GB')
  const options = selectors.core.walletOptions.getOptions(state).getOrElse({})

  // TODO: need something like
  // if needsKYC is false, needs more trades is false, but coinify profile is still false, hide it

  if (countryCode === 'GB' || equals(path(['platforms', 'web', 'coinify', 'showRecurringBuy'], options), false)) return false
  return true
}

export const getData = state => ({
  base: getBase(state),
  data: getProfileData(state),
  buyQuoteR: getQuote(state),
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
  canTrade: selectors.core.data.coinify.canTrade(state).getOrElse(false),
  showRecurringModal: path(['coinify', 'showRecurringModal'], state),
  showRecurringBuy: showRecurringBuy(state)
})
