import { lift } from 'ramda'

import { ImportedAddrType } from '@core/types'
import { selectors } from 'data'

export const getData = (state) => {
  const addressesR = selectors.core.common.btc.getActiveAddresses(state) as ImportedAddrType[]

  const transform = (importedAddresses: ImportedAddrType[]) => ({
    importedAddresses
  })

  return lift(transform)(addressesR)
}
