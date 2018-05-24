import { selectors } from 'data'
import { path } from 'ramda'

export const getTrade = (state) => {
  try {
    return selectors.core.data.coinify.getTrade(state).data
  } catch (e) {
    return null
  }
}

export const getData = (state) => ({
  data: selectors.core.data.coinify.getTrades(state),
  trade: getTrade(state),
  step: path(['coinify', 'checkoutStep'], state),
  busy: path(['coinify', 'coinifyBusy'], state),
  cancelTradeId: path(['coinify', 'cancelTradeId'], state)
})
