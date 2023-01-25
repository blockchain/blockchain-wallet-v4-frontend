import { compose, curry, defaultTo, lift, path, prop } from 'ramda'

import { RootState } from 'data/rootReducer'

export const getSession = curry((state, guid, email) => {
  const guidSession = path(['session', guid], state)
  const emailSession = path(['session', email], state)
  return defaultTo(guidSession)(emailSession)
})

export const getExchangeSessions = (state: RootState) => {
  return state.session.exchange
}

export const getExchangeSessionId = (state: RootState, email) => {
  if (getExchangeSessions(state)?.email?.toLowerCase() === email.toLowerCase()) {
    return getExchangeSessions(state)?.id
  }
}

export const getWalletSessions = (state: RootState) => {
  return state.session.wallet
}

export const getWalletSessionId = (state: RootState, guid, email) => {
  const guidMatches = guid && getWalletSessions(state)?.guid === guid
  const emailMatches =
    email && getWalletSessions(state)?.email?.toLowerCase() === email.toLowerCase()
  if (guidMatches || emailMatches) {
    return getWalletSessions(state)?.id
  }
}
export const getRecoverSessions = (state: RootState) => {
  return state.session.recover
}

export const getRecoverSessionId = (state: RootState, email) => {
  if (getRecoverSessions(state)?.email === email) {
    return getRecoverSessions(state)?.id
  }
}
