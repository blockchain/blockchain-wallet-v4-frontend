import { concat, includes, path, pathOr, prop } from 'ramda'
import { BUYSELL } from '../config'
import { kvStorePath } from '../../paths'

export const getMetadata = path([kvStorePath, BUYSELL])

export const getSfoxTrades = state =>
  getMetadata(state).map(pathOr([], ['value', 'sfox', 'trades']))

export const getSfoxUser = state =>
  getMetadata(state).map(path(['value', 'sfox', 'user']))

export const getSfoxJumio = state =>
  getMetadata(state).map(path(['value', 'sfox', 'jumio']))

export const getSfoxPhoneCall = state =>
  getMetadata(state).map(path(['value', 'sfox', 'phone_call']))

export const getSfoxHasSeenShutdown = state =>
  getMetadata(state).map(path(['value', 'sfox', 'has_seen_shutdown']))

export const getCoinifyUser = state =>
  getMetadata(state).map(path(['value', 'coinify', 'user']))

export const getCoinifyToken = state =>
  getMetadata(state).map(path(['value', 'coinify', 'offline_token']))

export const getCoinifyTrades = state =>
  getMetadata(state).map(pathOr([], ['value', 'coinify', 'trades']))

export const getBuySellTxHashMatch = (state, hash) => {
  const allTrades = concat(
    getSfoxTrades(state).getOrElse([]),
    getCoinifyTrades(state).getOrElse([])
  )
  const tradeHashes = allTrades.map(prop('tx_hash'))
  const shouldHaveLabel = includes(hash, tradeHashes)
  return shouldHaveLabel ? 'buy-sell' : false
}
