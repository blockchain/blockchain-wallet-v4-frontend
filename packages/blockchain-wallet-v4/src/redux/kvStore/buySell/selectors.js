import { BUYSELL } from '../config'
import { kvStorePath } from '../../paths'
import { path, pathOr } from 'ramda'

export const getMetadata = path([kvStorePath, BUYSELL])

export const getSfoxTrades = state =>
  getMetadata(state).map(pathOr([], ['value', 'sfox', 'trades']))

export const getCoinifyUser = state =>
  getMetadata(state).map(path(['value', 'coinify', 'user']))

export const getCoinifyToken = state =>
  getMetadata(state).map(path(['value', 'coinify', 'offline_token']))

export const getCoinifyTrades = state =>
  getMetadata(state).map(pathOr([], ['value', 'coinify', 'trades']))
