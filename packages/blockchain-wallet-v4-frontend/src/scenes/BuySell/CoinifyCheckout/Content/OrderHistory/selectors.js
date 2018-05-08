import { selectors } from 'data'

export const getData = (state) => ({
  data: selectors.core.data.coinify.getTrades(state)
})
