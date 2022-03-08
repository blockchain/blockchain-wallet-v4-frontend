import { compose, curry, defaultTo, lift, path, prop } from 'ramda'

import { RootState } from 'data/rootReducer'

import { ExchangeSessionType, WalletSessionType } from './types'

export const getSession = curry((state, guid, email) => {
  const guidSession = path(['session', guid], state)
  const emailSession = path(['session', email], state)
  return defaultTo(guidSession)(emailSession)
})

export const getExchangeSessions = (state: RootState) => {
  return state.session.exchange
}

export const getExchangeSessionId = (state: RootState, email) => {
  if (getExchangeSessions(state)?.email === email) {
    return getExchangeSessions(state)?.id
  }
}

export const getWalletSessions = (state: RootState) => {
  return state.session.wallet
}

export const getWalletSessionId = (state: RootState, guid, email) => {
  const guidMatches = getWalletSessions(state)?.guid === guid && guid
  const emailMatches = getWalletSessions(state)?.email === email && email
  if (guidMatches || emailMatches) {
    return getWalletSessions(state)?.id
  }
}
