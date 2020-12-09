import { SwapAccountType } from '../swap/types'
import { SwapOrderDirectionType } from 'core/types'

export const getDirection = (
  from: SwapAccountType
): Exclude<SwapOrderDirectionType, 'TO_USERKEY' | 'ON_CHAIN'> => {
  switch (true) {
    case from.type === 'ACCOUNT':
      return 'FROM_USERKEY'
    default:
      return 'INTERNAL'
  }
}
