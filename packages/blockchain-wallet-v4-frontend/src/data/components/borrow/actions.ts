import * as AT from './actionTypes'
import { CoinType } from 'blockchain-wallet-v4/src/types'

export const initializeBorrow = (coin: CoinType) => ({
  type: AT.INITIALIZE_BORROW,
  payload: {
    coin
  }
})
