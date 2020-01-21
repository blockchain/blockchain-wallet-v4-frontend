import * as AT from './actionTypes'
import { CoinType } from 'blockchain-wallet-v4/src/types'

// State

// Actions
interface InitializeBorrowAction {
  payload: {
    coin: CoinType
  }
  type: typeof AT.INITIALIZE_BORROW
}

export type BorrowActionTypes = InitializeBorrowAction
