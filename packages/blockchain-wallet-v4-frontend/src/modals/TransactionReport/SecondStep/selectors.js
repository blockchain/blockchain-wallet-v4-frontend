import { selectors } from 'data'

export const getData = state => selectors.core.data.bitcoin.getTransactionHistory(state)
