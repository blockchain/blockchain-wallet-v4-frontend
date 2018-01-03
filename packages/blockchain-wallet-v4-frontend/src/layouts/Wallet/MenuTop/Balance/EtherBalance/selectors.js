import { selectors } from 'data'

export const getData = (state) => ({
  value: selectors.core.data.ethereum.getBalance(state)
})
