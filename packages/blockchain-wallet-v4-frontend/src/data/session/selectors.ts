import { compose, curry, defaultTo, lift, path, prop } from 'ramda'

import { RootState } from 'data/rootReducer'

import { AccountSessionType } from './types'

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

export const getUnifiedSessions = (state: RootState) => {
  return state.session.unified
}

export const getUnifiedSessionId = (state: RootState, guid, email) => {
  const guidMatches = guid && getUnifiedSessions(state)?.guid === guid
  const emailMatches = email && getUnifiedSessions(state)?.email === email
  if (guidMatches || emailMatches) {
    return getUnifiedSessions(state)?.id
  }
}

export const getWalletSessions = (state: RootState) => {
  return state.session.wallet
}

export const getWalletSessionId = (state: RootState, guid, email) => {
  const guidMatches = guid && getWalletSessions(state)?.guid === guid
  const emailMatches = email && getWalletSessions(state)?.email === email
  if (guidMatches || emailMatches) {
    return getWalletSessions(state)?.id
  }
}
