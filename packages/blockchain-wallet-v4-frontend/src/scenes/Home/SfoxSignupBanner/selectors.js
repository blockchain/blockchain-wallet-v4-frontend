import { lift } from 'ramda'

import { Remote } from 'blockchain-wallet-v4/src'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'

export const getData = (state, ownProps) => createDeepEqualSelector(
  [
    selectors.core.data.sfox.getProfile,
    selectors.core.data.sfox.getAccounts,
    selectors.core.data.sfox.getVerificationStatus
  ], (sfoxProfile, sfoxAccounts, verificationStatus) => {
    if (!ownProps.sfoxKvData.account_token) {
      // no account token, dont fetch sfox data and render first step
      return Remote.of({})
    }

    return lift((sfoxProfile, sfoxAccounts, verificationStatus) => ({
      sfoxProfile, sfoxAccounts, verificationStatus
    }))(sfoxProfile, sfoxAccounts, verificationStatus)
  }
)(state, ownProps)
