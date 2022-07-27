import { toLower } from 'ramda'
import { createSelector } from 'reselect'

import { RemoteDataType } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getWalletTransactions = (
  state,
  coin
): ((state: RootState) => Array<RemoteDataType<any, Array<any>>>) => {
  return selectors.core.common[toLower(coin)].getWalletTransactions
}

export const getData = (state: RootState, coin: string): { addresses: string[] } => {
  return createSelector([getWalletTransactions(state, coin)], (transactions) => {
    const FIRST_TRANSACTION_INDEX = 0
    let addresses: string[] = []

    if (!transactions[FIRST_TRANSACTION_INDEX]) {
      return {
        addresses
      }
    }

    transactions[FIRST_TRANSACTION_INDEX].data.forEach((transaction) =>
      addresses.push(transaction.to)
    )
    addresses = [...new Set(addresses)].slice(0, 2)
    return {
      addresses
    }
  })(state)
}

export default getData
