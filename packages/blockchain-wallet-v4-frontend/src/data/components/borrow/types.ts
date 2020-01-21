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

// TODO: move to payments
export type UTXOType = {
  address: string
  change: boolean
  index: number
  path: string
  script: string
  txHash: string
  value: number
  xpub: {
    m: string
    path: string
  }
}

export type PaymentType = {
  change: string
  coins: Array<UTXOType>
  effectiveBalance: number
  fee: number
  fees: {
    limits: {
      max: number
      min: number
    }
    priority: number
    regular: number
  }
  from: Array<string>
  fromAccountIdx: number
  fromType:
    | 'ACCOUNT'
    | 'LEGACY'
    | 'WATCH_ONLY'
    | 'EXTERNAL'
    | 'LOCKBOX'
    | 'ADDRESS'
}

// State
export interface BorrowState {
  offers: RemoteData<NabuApiErrorType, Array<OfferType>>
  payment: RemoteData<string | Error, PaymentType>
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

interface SetPaymentFailure {
  payload: {
    error: string | Error
  }
  type: typeof AT.SET_PAYMENT_FAILURE
}

interface SetPaymentLoading {
  type: typeof AT.SET_PAYMENT_LOADING
}

interface SetPaymentSuccess {
  payload: {
    payment: PaymentType
  }
  type: typeof AT.SET_PAYMENT_SUCCESS
}

export type BorrowActionTypes =
  | FetchBorrowOffersFailureAction
  | FetchBorrowOffersLoadingAction
  | InitializeBorrowAction
  | SetPaymentFailure
  | SetPaymentLoading
  | SetPaymentSuccess
