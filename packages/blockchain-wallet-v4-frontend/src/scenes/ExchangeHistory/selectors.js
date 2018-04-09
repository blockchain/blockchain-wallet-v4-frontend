import { take } from 'ramda'
import { selectors } from 'data'

export const getData = (state, total) => {
  return selectors.core.kvStore.shapeShift.getTrades(state).map(x => take(total, x.reverse()))
}
