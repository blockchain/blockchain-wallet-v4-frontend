import { useSelector } from 'react-redux'

import { getFiatEntityRemediationAlert } from '@core/redux/walletOptions/selectors'
import { CoinfigType } from '@core/types'
import { getUserLegalEntity } from 'data/modules/profile/selectors'

export const useShowConversionAlert = (coinfig: CoinfigType) => {
  const showFiatEntityRemediationAlert = useSelector(getFiatEntityRemediationAlert).getOrElse(false)
  const userLegalEntity = useSelector(getUserLegalEntity)

  if (!showFiatEntityRemediationAlert || coinfig.type.name !== 'FIAT') return false
  // Non BC_US with USD balance
  const NON_BC_US_WITH_USD = userLegalEntity !== 'BC_US' && coinfig.displaySymbol === 'USD'
  // Non BC_LT/BC_LT_2 with EUR/GBP balance
  const ANY_BC_LT_WITH_EUR_GBP =
    !userLegalEntity?.includes('BC_LT') && ['EUR', 'GBP'].includes(coinfig.displaySymbol)

  return NON_BC_US_WITH_USD || ANY_BC_LT_WITH_EUR_GBP
}
