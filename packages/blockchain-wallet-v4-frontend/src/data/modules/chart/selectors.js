import * as selectors from './../../selectors'

export const getChart = (state) => ({
  data: selectors.core.data.misc.getPriceIndexSeries(state)
  // state: selectors.core.data.misc.getAdvertsState(state)
})
