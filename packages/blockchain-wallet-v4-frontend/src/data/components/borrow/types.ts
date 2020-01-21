import * as AT from './actionTypes'
import { CoinType } from 'blockchain-wallet-v4/src/types'
import { NabuApiErrorType } from 'blockchain-wallet-v4/src/network/types'
import { RemoteData } from 'blockchain-wallet-v4/src/remote/types'

// Types
export type OfferType = {}

export type BorrowFormValuesType = {
  collateral: any
  maxCollateral?: number
  maxCollateralCounter?: string
  principal: string
}

// State
export interface BorrowState {
  offers: RemoteData<NabuApiErrorType, Array<OfferType>>
}

// Actions
interface FetchBorrowOffersFailureAction {
  payload: {
    error: NabuApiErrorType
  }
  type: typeof AT.FETCH_BORROW_OFFERS_FAILURE
}

interface FetchBorrowOffersLoadingAction {
  type: typeof AT.FETCH_BORROW_OFFERS_LOADING
}
interface InitializeBorrowAction {
  payload: {
    coin: CoinType
  }
  type: typeof AT.INITIALIZE_BORROW
}

export type BorrowActionTypes =
  | FetchBorrowOffersFailureAction
  | FetchBorrowOffersLoadingAction
  | InitializeBorrowAction
