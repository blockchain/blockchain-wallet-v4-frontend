import { path } from 'ramda'
import { SHAPESHIFT } from '../config'

export const getTrades = path([SHAPESHIFT, 'value', 'trades'])
