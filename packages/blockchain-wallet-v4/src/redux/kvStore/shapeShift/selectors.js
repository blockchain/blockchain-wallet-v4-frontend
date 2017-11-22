import { filter, path } from 'ramda'
import { SHAPESHIFT } from '../config'

export const getTrades = path([SHAPESHIFT, 'value', 'trades'])

// export const getTrade = filter(x => getTrades())
