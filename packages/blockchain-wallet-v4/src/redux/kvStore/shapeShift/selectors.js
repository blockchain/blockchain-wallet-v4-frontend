import { compose, equals, head, filter, path } from 'ramda'
import { SHAPESHIFT } from '../config'

export const getTrades = path([SHAPESHIFT, 'value', 'trades'])

export const getTrade = (state, address) => compose(
  head,
  filter(t => equals(path(['quote', 'deposit'], t), address)),
  getTrades
)(state)
