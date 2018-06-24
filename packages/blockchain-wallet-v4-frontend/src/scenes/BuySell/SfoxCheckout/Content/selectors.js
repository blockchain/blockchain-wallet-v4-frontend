import { lift } from 'ramda'
import settings from 'config'
import { selectors } from 'data'

export const getData = (state) => {
  const profile = selectors.core.data.sfox.getProfile(state)
  const accounts = selectors.core.data.sfox.getAccounts(state)
  const verificationStatus = selectors.core.data.sfox.getVerificationStatus(state).data
  const defaultIndex = selectors.core.wallet.getDefaultAccountIndex(state)
  const nextAddress = selectors.core.common.btc.getNextAvailableReceiveAddress(settings.NETWORK_BITCOIN, defaultIndex, state)
  return lift((profile, accounts, nextAddress) => ({ profile, accounts, verificationStatus, nextAddress }))(profile, accounts, nextAddress)
}

export const getQuote = (state) => {
  return selectors.core.data.sfox.getQuote(state)
}

export const getSellQuote = (state) => {
  return selectors.core.data.sfox.getSellQuote(state)
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

export const getPayment = (state) => {
  return selectors.components.sendBtc.getPayment(state).data
}
