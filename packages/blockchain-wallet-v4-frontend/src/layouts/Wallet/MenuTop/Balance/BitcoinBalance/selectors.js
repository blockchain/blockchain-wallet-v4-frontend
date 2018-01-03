import { selectors } from 'data'

export const getData = (state) => ({
  value: selectors.core.data.bitcoin.getBalance(state)
})
