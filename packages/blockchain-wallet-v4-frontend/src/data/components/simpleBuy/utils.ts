import { SwapOrderDirectionType } from 'blockchain-wallet-v4/src/types'

import { SwapAccountType } from '../swap/types'

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
