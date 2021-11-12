import { SwapOrderDirectionType } from '@core/types'
import { SwapAccountType, SwapBaseCounterTypes } from 'data/components/swap/types'

const getDirection = (
  from: SwapAccountType
): Exclude<SwapOrderDirectionType, 'TO_USERKEY' | 'ON_CHAIN'> => {
  switch (true) {
    case from.type === SwapBaseCounterTypes.ACCOUNT:
      return 'FROM_USERKEY'
    default:
      return 'INTERNAL'
  }
}

export { getDirection }
