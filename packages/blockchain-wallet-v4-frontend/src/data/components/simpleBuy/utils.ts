import { SwapOrderDirectionType } from '@core/types'

import { SwapAccountType, SwapBaseCounterTypes } from '../swap/types'

// eslint-disable-next-line import/prefer-default-export
export const getDirection = (
  from: SwapAccountType
): Exclude<SwapOrderDirectionType, 'TO_USERKEY' | 'ON_CHAIN'> => {
  switch (true) {
    case from.type === SwapBaseCounterTypes.ACCOUNT:
      return 'FROM_USERKEY'
    default:
      return 'INTERNAL'
  }
}
