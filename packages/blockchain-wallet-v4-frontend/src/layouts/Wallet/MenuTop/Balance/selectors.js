import { add, contains, filter, prop, reduce, values } from 'ramda'
import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getBtcBalance = createDeepEqualSelector(
  [
    selectors.core.wallet.getSpendableContext,
    selectors.core.data.bitcoin.getAddresses
  ],
  (context, addressesR) => {
    const transform = addresses => {
      const filteredAddresses = filter(x => contains(prop('address', x), context), values(addresses))
      const filteredBalances = filteredAddresses.map(prop('final_balance'))
      return reduce(add, 0, filteredBalances)
    }
    return addressesR.map(transform)
  }
)

export const getBchBalance = createDeepEqualSelector(
  [
    selectors.core.kvStore.bch.getSpendableContext,
    selectors.core.data.bch.getAddresses
  ],
  (context, addressesR) => {
    const transform = addresses => {
      const filteredAddresses = filter(x => contains(prop('address', x), context), values(addresses))
      const filteredBalances = filteredAddresses.map(prop('final_balance'))
      return reduce(add, 0, filteredBalances)
    }
    return addressesR.map(transform)
  }
)

export const getEthBalance = selectors.core.data.ethereum.getBalance
