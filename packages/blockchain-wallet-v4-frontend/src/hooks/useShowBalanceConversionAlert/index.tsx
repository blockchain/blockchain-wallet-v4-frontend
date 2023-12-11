import { useSelector } from 'react-redux'

import { getFiatTransformAlertEnabled } from '@core/redux/walletOptions/selectors'
import { CoinfigType } from '@core/types'
import { getUserLegalEntity } from 'data/modules/profile/selectors'

const useShowConversionAlert = (coinfig?: CoinfigType) => {
  if (!coinfig) return false
  const fiatTransformAlertEnabled = useSelector(getFiatTransformAlertEnabled)
  const userLegalEntity = useSelector(getUserLegalEntity)

  if (!fiatTransformAlertEnabled || coinfig.type.name !== 'FIAT') return false
  // Non BC_US with USD balance
  const NON_BC_US_WITH_USD = userLegalEntity !== 'BC_US' && coinfig.displaySymbol === 'USD'
  // Non BC_LT/BC_LT_2 with EUR/GBP balance
  const ANY_BC_LT_WITH_EUR_GBP =
    !userLegalEntity?.includes('BC_LT') && ['EUR', 'GBP'].includes(coinfig.displaySymbol)

  return NON_BC_US_WITH_USD || ANY_BC_LT_WITH_EUR_GBP
}

export default useShowConversionAlert
