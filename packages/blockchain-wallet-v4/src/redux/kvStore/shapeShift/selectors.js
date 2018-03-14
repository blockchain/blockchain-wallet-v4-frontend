// import { compose, equals, head, filter, path } from 'ramda'
// import { SHAPESHIFT } from '../config'
// import { kvStorePath } from '../../paths'

// export const getTrades = path([kvStorePath, SHAPESHIFT, 'value', 'trades'])

// export const getTrade = (state, address) => compose(
//   head,
//   filter(t => equals(path(['quote', 'deposit'], t), address)),
//   getTrades
// )(state)

import { compose, curry, filter, head, path } from 'ramda'
import { SHAPESHIFT } from '../config'
import { kvStorePath } from '../../paths'

export const getMetadata = path([kvStorePath, SHAPESHIFT])

export const getTrades = state => getMetadata(state).map(path(['value', 'trades']))

export const getTrade = curry((address, state) => getTrades(state)
  .map(compose(head, filter(x => path(['quote', 'deposit'], x) === address))))
