import { lift, path } from 'ramda'
import { selectors } from 'data'
import Bitcoin from 'bitcoinjs-lib'

export const getData = state => {
  const profile = selectors.core.data.sfox.getProfile(state)
  const accounts = selectors.core.data.sfox.getAccounts(state)
  const networkR = selectors.core.walletOptions.getBtcNetwork(state)
  const network = networkR.getOrElse('bitcoin')
  const verificationStatus = selectors.core.data.sfox
    .getVerificationStatus(state)
    .getOrElse(undefined)
  const defaultIndex = selectors.core.wallet.getDefaultAccountIndex(state)
  const nextAddress = selectors.core.common.btc.getNextAvailableReceiveAddress(
    Bitcoin.networks[network],
    defaultIndex,
    state
  )
  return lift((profile, accounts, nextAddress) => ({
    profile,
    accounts,
    verificationStatus,
    nextAddress
  }))(profile, accounts, nextAddress)
}

export const getQuote = state => selectors.core.data.sfox.getQuote(state)

export const getSellQuote = state =>
  selectors.core.data.sfox.getSellQuote(state)

export const getTrades = state =>
  selectors.core.data.sfox.getTrades(state).getOrElse(null)

export const getBase = state =>
  path(['form', 'exchangeCheckout', 'active'], state)

export const getErrors = state =>
  path(['form', 'exchangeCheckout', 'syncErrors'], state)

export const getPayment = path(['sfoxSignup', 'payment'])
