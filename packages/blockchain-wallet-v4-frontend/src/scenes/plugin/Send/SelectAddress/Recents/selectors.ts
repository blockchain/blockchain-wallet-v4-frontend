import { toLower } from 'ramda'
import { createSelector } from 'reselect'

import { RemoteDataType } from '@core/types'
import { isValidAddress } from '@core/utils/eth'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getWalletTransactions = (
  state,
  coin
): ((state: RootState) => Array<RemoteDataType<any, Array<any>>>) => {
  return selectors.core.common[toLower(coin)].getWalletTransactions
}

export const getData = (
  state: RootState,
  coin: string,
  searchedAddress: string
): { addresses: string[] } => {
  return createSelector([getWalletTransactions(state, coin)], (transactions) => {
    const FIRST_TRANSACTION_INDEX = 0
    let addresses: string[] = []

    if (!(transactions[FIRST_TRANSACTION_INDEX] && transactions[FIRST_TRANSACTION_INDEX].data)) {
      return {
        addresses
      }
    }

    transactions[FIRST_TRANSACTION_INDEX].data.forEach((transaction) => {
      // Excludes wallets with 'Private key value' label
      if (isValidAddress(transaction.to)) {
        addresses.push(transaction.to)
      }
    })

    addresses = [...new Set(addresses)]

    if (searchedAddress) {
      const searchedAddresses: string[] = []
      addresses.forEach((address) => {
        if (address.includes(searchedAddress) && isValidAddress(address)) {
          searchedAddresses.push(address)
        }
      })
      return {
        addresses: searchedAddresses
      }
    }
    return {
      addresses
    }
  })(state)
}

export default getData
