import { selectors } from 'data'

export const getData = (state) => ({
  value: selectors.core.data.misc.getAdverts(state)
  // state: selectors.core.data.misc.getAdvertsState(state)
})
