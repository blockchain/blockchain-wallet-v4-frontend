import { RemoteData } from 'blockchain-wallet-v4/src'
import { add, compose, map, mapAccum, reduce, prop } from 'ramda'
import { selectors } from 'data'

export const getData = (state) => {
  // const bitcoinAddressesData = selectors.core.data.bitcoin.getAddresses(state)
  // const bitcoinLegacyAddresses = selectors.core.wallet.getAddresses(state)
  // const bitcoinHDAccounts = selectors.core.wallet.getHDAccounts(state)
  // console.log('bitcoinLegacyAddresses', bitcoinLegacyAddresses)
  // // console.log('bitcoinHDAccounts', bitcoinHDAccounts)

  // const add = (a, b) => a + b
  // const transformLegacyAddresses = x => mapAccum(add, 0, bitcoinLegacyAddresses)
  // const total = RemoteData.map(transformLegacyAddresses, bitcoinAddressesData)
  // console.log(total)
  // const bitcoinAddresses = selectors.core.data.bitcoin.getAddresses(state)
  // const transform = x => ({

  // })
  // const bitcoinBalances = [...accountsBalances, importedAddressesBalance]
  // const getTotalBalance = compose(reduce(add, 0), map(value => prop('amount', value)))

  return {
    value: 'test'
  }
}
