import { path } from 'ramda'
import { BUYSELL } from '../config'
import { kvStorePath } from '../../paths'

export const getMetadata = path([kvStorePath, BUYSELL])

export const getSfoxTrades = path([kvStorePath, BUYSELL, 'data', 'value', 'sfox', 'trades'])

export const getSfoxUser = path([kvStorePath, BUYSELL, 'data', 'value', 'sfox', 'user'])
