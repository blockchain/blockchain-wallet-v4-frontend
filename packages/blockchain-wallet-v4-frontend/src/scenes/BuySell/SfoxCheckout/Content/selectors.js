import { lift } from 'ramda'
import settings from 'config'
import { selectors } from 'data'

export const getData = (state) => {
  const profile = selectors.core.data.sfox.getProfile(state)
  const accounts = selectors.core.data.sfox.getAccounts(state)
  const verificationStatus = selectors.core.data.sfox.getVerificationStatus(state).data
  const nextAddress = selectors.core.common.bitcoin.getNextAvailableReceiveAddress(settings.NETWORK_BITCOIN, 0, state)
  return lift((profile, nextAddress) => ({ profile, verificationStatus, nextAddress }))(profile, nextAddress)
}

export const getQuote = (state) => {
  try {
    return selectors.core.data.sfox.getQuote(state).data
  } catch (e) {
    return null
  }
}

export const getTrades = (state) => {
  try {
    return selectors.core.data.sfox.getTrades(state).data
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
