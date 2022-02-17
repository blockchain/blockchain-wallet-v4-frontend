import { curry, defaultTo, path } from 'ramda'
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
  const exchangeSessionsLists = getExchangeSessions(state) as Array<ExchangeSessionType>
  const sessionId = exchangeSessionsLists.find(
    (wallet) => wallet.email === email
  ) as ExchangeSessionType
  return sessionId.id
}

export const getWalletSessions = (state: RootState) => {
  return state.session.wallet
}

export const getWalletSessionId = (state: RootState, guid) => {
  const walletSessionsLists = getWalletSessions(state) as Array<WalletSessionType>
  const sessionId = walletSessionsLists.find((wallet) => wallet.guid === guid) as WalletSessionType
  return sessionId.id
}
