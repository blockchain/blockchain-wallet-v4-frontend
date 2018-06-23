import { formValueSelector } from 'redux-form'
import { lift, path } from 'ramda'
import { selectors } from 'data'

export const getUserData = (state) => {
  const profile = selectors.core.data.coinify.getProfile(state)
  const payment = selectors.components.sendBtc.getPayment(state)
  const kyc = selectors.core.data.coinify.getKyc(state)
  return lift((profile, payment, kyc) => ({ profile, payment, kyc }))(profile, payment, kyc)
}

export const getTrades = (state) =>
  selectors.core.data.coinify.getTrades(state).getOrElse(null)

export const getTrade = (state) =>
  selectors.core.data.coinify.getTrade(state).getOrElse(null)

export const getQuote = (state) =>
  selectors.core.data.coinify.getQuote(state)

export const getCurrency = (state) =>
  selectors.core.data.coinify.getLevel(state)

export const getBase = (state) =>
  path(['form', 'exchangeCheckout', 'active'], state)

export const getErrors = (state) =>
  path(['form', 'exchangeCheckout', 'syncErrors'], state)

export const getData = (state) => ({
  base: getBase(state),
  data: getUserData(state),
  sellQuoteR: getQuote(state),
  trade: getTrade(state),
  errors: getErrors(state),
  currency: formValueSelector('coinifyCheckoutSell')(state, 'currency'),
  defaultCurrency: getCurrency(state),
  checkoutBusy: path(['coinify', 'checkoutBusy'], state),
  paymentMedium: path(['coinify', 'medium'], state),
  step: path(['coinify', 'checkoutStep'], state),
  coinifyBusy: path(['coinify', 'coinifyBusy'], state),
  checkoutError: path(['coinify', 'checkoutError'], state),
  canTrade: selectors.core.data.coinify.canTrade(state).getOrElse(false)
})
