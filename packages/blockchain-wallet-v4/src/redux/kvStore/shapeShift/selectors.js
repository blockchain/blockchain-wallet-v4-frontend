// import { compose, equals, head, filter, path } from 'ramda'
// import { SHAPESHIFT } from '../config'
// import { kvStorePath } from '../../paths'

// export const getTrades = path([kvStorePath, SHAPESHIFT, 'value', 'trades'])

// export const getTrade = (state, address) => compose(
//   head,
//   filter(t => equals(path(['quote', 'deposit'], t), address)),
//   getTrades
// )(state)

import { path } from 'ramda'
import { SHAPESHIFT } from '../config'
import { kvStorePath } from '../../paths'
import * as RemoteData from '../../remoteData'

export const getMetadata = path([kvStorePath, SHAPESHIFT])
