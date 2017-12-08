import * as selectors from './../../selectors'

export const getExchangeHistory = (state) => ({
  data: {
    trades: selectors.core.kvStore.shapeShift.getTrades(state),
    tradesStatus: selectors.core.data.shapeShift.getTradesStatus(state)
  // state: selectors.core.data.misc.getAdvertsState(state)
  }
})
