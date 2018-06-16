import { lift } from 'ramda'

import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.core.data.sfox.getProfile,
    selectors.core.data.sfox.getAccounts,
    selectors.core.data.sfox.getVerificationStatus
  ], (sfoxProfile, sfoxAccounts, verificationStatus) => {
    return lift((sfoxProfile, sfoxAccounts, verificationStatus) => ({
      sfoxProfile, sfoxAccounts, verificationStatus
    }))(sfoxProfile, sfoxAccounts, verificationStatus)
  }
)
