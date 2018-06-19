import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { add, contains, filter, reduce, prop, values } from 'ramda'

export const getData = createDeepEqualSelector(
  [
    selectors.core.wallet.getUnspendableContext,
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
