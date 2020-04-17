import * as AT from './actionTypes'
import { CoinType } from 'core/types'

export const initializeInterest = (coin: CoinType) => ({
  payload: {
    coin
  },
  type: AT.INITIALIZE_INTEREST
})
