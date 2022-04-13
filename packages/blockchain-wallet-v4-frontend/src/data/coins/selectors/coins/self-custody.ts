import { lift } from 'ramda'

import { getBalance } from '@core/redux/data/coins/selectors'
import { InvitationsType } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { generateSelfCustodyAccount } from 'data/coins/utils'

import * as selectors from '../../../selectors'

export const getTransactionPageHeaderText = () => null

// main selector for all SELF-CUSTODY account types
// accepts a coin string
export const getAccounts = createDeepEqualSelector(
  [
    (state, ownProps) => getBalance(ownProps.coin, state),
    (state, ownProps) => ownProps // selector config
  ],
  (balanceR, ownProps) => {
    const { coin } = ownProps

    const transform = (balance) => {
      return generateSelfCustodyAccount(coin, balance)
    }

    return lift(transform)(balanceR)
  }
)

export const getStxSelfCustodyAvailablity = createDeepEqualSelector(
  [
    selectors.core.walletOptions.getFeatureFlags,
    selectors.modules.profile.getBlockstackTag,
    selectors.core.settings.getInvitations
  ],
  (featureFlagsR, tagsR, invitationsR): boolean => {
    const featureFlags = featureFlagsR.getOrElse({
      stxSelfCustodyEnableAirdrop: false,
      stxSelfCustodyEnableAll: false
    })
    const tag = tagsR.getOrElse(false)
    const invitations = invitationsR.getOrElse({ stxSelfCustody: false } as InvitationsType)

    if (invitations.stxSelfCustody) {
      if (tag && featureFlags.stxSelfCustodyEnableAirdrop) {
        return true
      }
      if (featureFlags.stxSelfCustodyEnableAll) {
        return true
      }

      return false
    }

    return false
  }
)
