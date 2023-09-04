import { filter, isNil, lift, not, prop } from 'ramda'

import { ImportedAddrType } from '@core/types'
import { selectors } from 'data'

const filterRelevantAddresses = (addrs) =>
  filter((addr) => {
    // @ts-ignore
    return not(isNil(prop('priv', addr)))
  }, addrs)

export const getData = (state) => {
  const bchAddressesR = selectors.core.common.bch.getActiveAddresses(state) as ImportedAddrType[]

  const transform = (bchImportedAddresses: ImportedAddrType[]) => ({
    bchImports: filterRelevantAddresses(bchImportedAddresses) as ImportedAddrType[]
  })

  return lift(transform)(bchAddressesR)
}
