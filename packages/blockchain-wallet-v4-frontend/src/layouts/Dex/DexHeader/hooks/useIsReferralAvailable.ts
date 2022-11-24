import { useSelector } from 'react-redux'

import { selectors } from 'data'
import { useRemote } from 'hooks'

export const useIsReferralAvailable = () => {
  const { data } = useRemote(selectors.modules.profile.getCurrentTier)
  const isGoldTierVerified = data === 2

  const featureFlags = useSelector(selectors.core.walletOptions.getFeatureFlags).getOrElse(
    {} as { [key in string]: boolean }
  )

  const isReferralAvailable = useSelector(selectors.components.referral.getReferralInformation)
  const isReferralEnabled = useSelector(selectors.core.walletOptions.getReferralEnabled).getOrElse(
    false
  ) as boolean

  return (
    !!isReferralAvailable &&
    isGoldTierVerified &&
    isReferralEnabled &&
    featureFlags.isReferralRetrievalEnabled
  )
}
