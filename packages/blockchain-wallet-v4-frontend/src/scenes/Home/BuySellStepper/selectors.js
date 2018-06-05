import { lift } from 'ramda'

import { selectors } from 'data'

export const getData = (state) => {
  const buySellR = selectors.core.kvStore.buySell.getMetadata(state)
  const profileR = selectors.core.data.sfox.getProfile(state)
  const accountsR = selectors.core.data.sfox.getAccounts(state)
  const verificationStatusR = selectors.core.data.sfox.getVerificationStatus(state)
  const transform = lift((bsMetadata, profile, accounts, vStatus) => ({ bsMetadata, profile, accounts, vStatus }))

  return { data: transform(buySellR, profileR, accountsR, verificationStatusR) }
}
