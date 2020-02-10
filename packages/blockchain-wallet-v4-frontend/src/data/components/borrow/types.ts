import * as AT from './actionTypes'
import {
  CoinType,
  LoanType,
  NabuApiErrorType,
  OfferType,
  RemoteDataType
} from 'core/types'

// Types

export type BorrowFormValuesType = {
  collateral: any
  collateralCryptoAmt?: number
  maxCollateral?: number
  maxCollateralCounter?: string
  offer: OfferType
  principal: string
}

export type BorrowMinMaxType = {
  maxCrypto: number
  maxFiat: number
  minCrypto: number
  minFiat: number
}

// TODO: move to ticker
export type RatesType = {
  [key in string]: {
    '15m': number
    buy: number
    last: number
    sell: number
    symbol: '$'
  }
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

export type FromType =
  | 'ACCOUNT'
  | 'LEGACY'
  | 'WATCH_ONLY'
  | 'EXTERNAL'
  | 'LOCKBOX'
  | 'ADDRESS'

export type PaymentType = {
  amount: (n: number, addressType: FromType) => PaymentType
  build: () => PaymentType
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
  fromType: FromType
  publish: () => PaymentType
  sign: (pw: string) => PaymentType
  to: (address: string) => PaymentType
  value: () => PaymentType
}

export type BorrowStepsType = 'CHECKOUT' | 'DETAILS'

// State
export interface BorrowState {
  borrowHistory: RemoteDataType<NabuApiErrorType, Array<LoanType>>
  coin: CoinType
  limits: BorrowMinMaxType
  offer: OfferType | null
  offers: RemoteDataType<NabuApiErrorType, Array<OfferType>>
  payment: RemoteDataType<string | Error, PaymentType>
  step: 'CHECKOUT' | 'DETAILS'
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
interface FetchBorrowOffersSuccessAction {
  payload: {
    offers: Array<OfferType>
  }
  type: typeof AT.FETCH_BORROW_OFFERS_SUCCESS
}
interface FetchUserBorrowHistoryFailureAction {
  payload: {
    error: NabuApiErrorType
  }
  type: typeof AT.FETCH_USER_BORROW_HISTORY_FAILURE
}

interface FetchUserBorrowHistoryLoadingAction {
  type: typeof AT.FETCH_USER_BORROW_HISTORY_LOADING
}
interface FetchUserBorrowHistorySuccessAction {
  payload: {
    borrowHistory: Array<LoanType>
  }
  type: typeof AT.FETCH_USER_BORROW_HISTORY_SUCCESS
}
interface InitializeBorrowAction {
  payload: {
    coin: CoinType
    offer: OfferType
  }
  type: typeof AT.INITIALIZE_BORROW
}

interface SetCoinAction {
  payload: {
    coin: CoinType
  }
  type: typeof AT.SET_COIN
}

interface SetLimitsAction {
  payload: {
    limits: BorrowMinMaxType
  }
  type: typeof AT.SET_LIMITS
}

interface SetOfferAction {
  payload: {
    offer: OfferType | null
  }
  type: typeof AT.SET_OFFER
}

interface SetPaymentFailureAction {
  payload: {
    error: string | Error
  }
  type: typeof AT.SET_PAYMENT_FAILURE
}

interface SetPaymentLoadingAction {
  type: typeof AT.SET_PAYMENT_LOADING
}

interface SetPaymentSuccessAction {
  payload: {
    payment: PaymentType
  }
  type: typeof AT.SET_PAYMENT_SUCCESS
}

interface SetStepAction {
  payload: {
    step: BorrowStepsType
  }
  type: typeof AT.SET_STEP
}

export type BorrowActionTypes =
  | FetchBorrowOffersFailureAction
  | FetchBorrowOffersLoadingAction
  | FetchBorrowOffersSuccessAction
  | FetchUserBorrowHistoryFailureAction
  | FetchUserBorrowHistoryLoadingAction
  | FetchUserBorrowHistorySuccessAction
  | InitializeBorrowAction
  | SetCoinAction
  | SetLimitsAction
  | SetOfferAction
  | SetPaymentFailureAction
  | SetPaymentLoadingAction
  | SetPaymentSuccessAction
  | SetStepAction
