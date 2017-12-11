import * as selectors from './../../selectors'

export const getChart = (state) => ({
  priceIndexSeries: selectors.core.data.misc.getPriceIndexSeries(state),
  currency: selectors.core.settings.getCurrency(state)
  // state: selectors.core.data.misc.getAdvertsState(state)
})
