import { selectors } from 'data'

export const getAdvert = (state) => ({
  value: selectors.core.data.misc.getAdverts(state)
  // state: selectors.core.data.misc.getAdvertsState(state)
})
