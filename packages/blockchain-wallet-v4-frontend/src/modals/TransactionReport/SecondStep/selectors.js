import { selectors } from 'data'

export const getData = (state, coin) => coin === 'BTC'
  ? selectors.core.data.bitcoin.getTransactionHistory(state)
  : selectors.core.data.bch.getTransactionHistory(state)
