import { formValueSelector } from 'redux-form'
import { lift, path } from 'ramda'
// import settings from 'config'
import { selectors } from 'data'

export const getProfileData = (state) => {
  const profile = selectors.core.data.coinify.getProfile(state)
  // const nextAddress = selectors.core.common.bitcoin.getNextAvailableReceiveAddress(settings.NETWORK_BITCOIN, 0, state)
  return lift((profile) => ({ profile }))(profile)
}

export const getTrades = (state) => {
  try {
    return selectors.core.data.coinify.getTrades(state).data
  } catch (e) {
    return null
  }
}

export const getRateQuote = (state) => {
  try {
    return selectors.core.data.coinify.getRateQuote(state)
  } catch (e) {
    return null
  }
}

export const getTrade = (state) => {
  try {
    return selectors.core.data.coinify.getTrade(state).data
  } catch (e) {
    return null
  }
}

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

export const getBase = (state) => {
  return state.form.exchangeCheckout && state.form.exchangeCheckout.active
}

export const getErrors = (state) => {
  const exchangeCheckoutForm = state.form && state.form.exchangeCheckout
  return exchangeCheckoutForm && exchangeCheckoutForm.syncErrors
}

export const getData = (state) => ({
  base: getBase(state),
  data: getProfileData(state),
  sellQuoteR: getQuote(state),
  rateQuoteR: getRateQuote(state),
  trade: getTrade(state),
  errors: getErrors(state),
  currency: formValueSelector('coinifyCheckout')(state, 'currency'),
  defaultCurrency: getCurrency(state),
  checkoutBusy: path(['coinify', 'checkoutBusy'], state),
  paymentMedium: path(['coinify', 'medium'], state),
  step: path(['coinify', 'checkoutStep'], state),
  coinifyBusy: path(['coinify', 'coinifyBusy'], state)
})
