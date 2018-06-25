import { lift, path } from 'ramda'
import settings from 'config'
import { selectors } from 'data'

export const getData = (state) => {
  const profile = selectors.core.data.sfox.getProfile(state)
  const accounts = selectors.core.data.sfox.getAccounts(state)
  const verificationStatus = selectors.core.data.sfox.getVerificationStatus(state).data
  const nextAddress = selectors.core.common.btc.getNextAvailableReceiveAddress(settings.NETWORK_BITCOIN, 0, state)
  return lift((profile, accounts, nextAddress) => ({ profile, accounts, verificationStatus, nextAddress }))(profile, accounts, nextAddress)
}

export const getQuote = (state) =>
  selectors.core.data.sfox.getQuote(state)

export const getSellQuote = (state) =>
  selectors.core.data.sfox.getSellQuote(state)

export const getTrades = (state) =>
  selectors.core.data.sfox.getTrades(state).getOrElse(null)

export const getBase = (state) =>
  path(['form', 'exchangeCheckout', 'active'], state)

export const getErrors = (state) =>
  path(['form', 'exchangeCheckout', 'syncErrors'], state)

export const getPayment = (state) =>
  selectors.components.sendBtc.getPayment(state).getOrElse(null)
