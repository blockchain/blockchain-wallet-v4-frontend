import { lift } from 'ramda'
import settings from 'config'
import { selectors } from 'data'

export const getData = (state) => {
  const profile = selectors.core.data.coinify.getProfile(state)
  // const accounts = selectors.core.data.coinify.getAccounts(state)
  // const verificationStatus = selectors.core.data.coinify.getVerificationStatus(state).data
  // const nextAddress = selectors.core.common.bitcoin.getNextAvailableReceiveAddress(settings.NETWORK_BITCOIN, 0, state)
  // return lift((profile, accounts, nextAddress) => ({ profile, accounts, verificationStatus, nextAddress }))(profile, accounts, nextAddress)
  return lift(profile => ({ profile }))(profile)
}

export const getQuote = (state) => {
  try {
    return selectors.core.data.coinify.getQuote(state).data
  } catch (e) {
    return null
  }
}

export const getTrades = (state) => {
  try {
    return selectors.core.data.coinify.getTrades(state).data
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
