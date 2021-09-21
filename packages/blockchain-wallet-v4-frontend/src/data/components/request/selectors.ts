import Remote from '@core/remote'
import { RootState } from 'data/rootReducer'

import { SwapAccountType } from '../swap/types'

export const getNextAddress = (state: RootState, account: SwapAccountType) => {
  return state.components.request[`${account.coin} ${account.label}`] || Remote.NotAsked
}
