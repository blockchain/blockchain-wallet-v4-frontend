import { lift } from 'ramda'

import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.core.kvStore.buySell.getMetadata,
    selectors.core.data.sfox.getProfile,
    selectors.core.data.sfox.getAccounts,
    selectors.core.data.sfox.getVerificationStatus
  ], (bsMetadata, profile, accounts, vStatus) => {
    const transform = lift((bsMetadata, profile, accounts, vStatus) => ({ bsMetadata, profile, accounts, vStatus }))
    return { data: transform(bsMetadata, profile, accounts, vStatus) }
  }
)
