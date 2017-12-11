import * as selectors from './../../selectors'

export const getAdvert = (state) => ({
  data: selectors.core.data.misc.getAdverts(state)
  // state: selectors.core.data.misc.getAdvertsState(state)
})
