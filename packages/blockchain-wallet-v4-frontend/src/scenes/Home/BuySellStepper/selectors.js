import { lift } from 'ramda'

import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.core.kvStore.buySell.getMetadata,
    selectors.core.data.sfox.getProfile,
    selectors.core.data.sfox.getAccounts,
    selectors.core.data.sfox.getVerificationStatus,
    selectors.exchange.getCanTrade
  ], (kvBuySellMetadata, profile, accounts, vStatus, canTrade) => {
    const transform = lift((kvBuySellMetadata, profile, accounts, vStatus, canTrade) => ({
      kvBuySellMetadata, profile, accounts, vStatus, canTrade
    }))
    return transform(kvBuySellMetadata, profile, accounts, vStatus, canTrade)
  }
)
