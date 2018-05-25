import { formValueSelector } from 'redux-form'
import { lift, path } from 'ramda'
import { selectors } from 'data'

export const getUserData = (state) => {
  const profile = selectors.core.data.coinify.getProfile(state)
  const payment = selectors.components.sendBtc.getPayment(state)
  return lift((profile, payment) => ({ profile, payment }))(profile, payment)
}

export const getTrades = (state) =>
  selectors.core.data.coinify.getTrades(state).getOrElse(null)

export const getRateQuote = (state) =>
  selectors.core.data.coinify.getRateQuote(state)

export const getTrade = (state) =>
  selectors.core.data.coinify.getTrade(state).getOrElse(null)

export const getQuote = (state) =>
  selectors.core.data.coinify.getQuote(state)

export const getCurrency = (state) =>
  selectors.core.data.coinify.getLevel(state)

export const getBase = (state) =>
  state.form.exchangeCheckout && state.form.exchangeCheckout.active

export const getErrors = (state) => {
  const exchangeCheckoutForm = state.form && state.form.exchangeCheckout
  return exchangeCheckoutForm && exchangeCheckoutForm.syncErrors
}

export const getData = (state) => ({
  base: getBase(state),
  data: getUserData(state),
  sellQuoteR: getQuote(state),
  rateQuoteR: getRateQuote(state),
  trade: getTrade(state),
  errors: getErrors(state),
  currency: formValueSelector('coinifyCheckoutSell')(state, 'currency'),
  defaultCurrency: getCurrency(state),
  checkoutBusy: path(['coinify', 'checkoutBusy'], state),
  paymentMedium: path(['coinify', 'medium'], state),
  step: path(['coinify', 'checkoutStep'], state),
  coinifyBusy: path(['coinify', 'coinifyBusy'], state),
  checkoutError: path(['coinify', 'checkoutError'], state)
})
