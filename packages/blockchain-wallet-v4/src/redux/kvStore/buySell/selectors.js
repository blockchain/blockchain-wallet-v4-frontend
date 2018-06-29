import { path } from 'ramda'
import { BUYSELL } from '../config'
import { kvStorePath } from '../../paths'

export const getMetadata = path([kvStorePath, BUYSELL])

export const getSfoxTrades = state => getMetadata(state).map(path(['value', 'sfox', 'trades']))

export const getSfoxUser = state => getMetadata(state).map(path(['value', 'sfox', 'user']))

export const getCoinifyTrades = state => getMetadata(state).map(path(['value', 'coinify', 'trades']))
