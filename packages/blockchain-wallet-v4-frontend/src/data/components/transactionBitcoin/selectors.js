import * as selectors from './../../selectors'

export const getTransactionBitcoin = (state) => ({
  data: {
    transactions: selectors.core.data.bitcoin.getTransactions(state),
    transactionFiats: selectors.core.data.bitcoin.getFiatAtTime(state)
  }
  // state: selectors.core.data.misc.getAdvertsState(state)
})
