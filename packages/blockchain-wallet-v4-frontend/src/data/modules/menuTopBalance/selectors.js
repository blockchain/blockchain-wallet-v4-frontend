import * as selectors from './../../selectors'

export const getMenuTopBalance = (state) => ({
  bitcoinBalance: selectors.core.data.bitcoin.getBalance(state),
  etherBalance: selectors.core.data.ethereum.getBalance(state)
  // state: selectors.core.data.misc.getAdvertsState(state)
})
