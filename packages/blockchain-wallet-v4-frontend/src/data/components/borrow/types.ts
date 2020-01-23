import * as AT from './actionTypes'
import { CoinType } from 'blockchain-wallet-v4/src/types'
import { NabuApiErrorType } from 'blockchain-wallet-v4/src/network/types'
import { RemoteData } from 'blockchain-wallet-v4/src/remote/types'

// Types
export type OfferType = {
  callTerms: {
    callTriggerRatio: number
    liquidationHardRatio: number
    marginTopupTime: number
    minutesBeforeLiquidation: number
  }
  id: string
  status: 'OPEN'
  terms: {
    collateralCcy: CoinType
    collateralRatio: number
    durationHours: number
    format: 'FLEX'
    interestRate: number
    maxYieldingAmount: {
      symbol: CoinType
      value: number
    }
    minPrincipalAmount: {
      symbol: CoinType
      value: number
    }
    principalCcy: CoinType
  }
}

export type BorrowFormValuesType = {
  collateral: any
  maxCollateral?: number
  maxCollateralCounter?: string
  offer: OfferType
  principal: string
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

export type PaymentType = {
  amount: (n: number) => PaymentType
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
  sign: (pw: string) => PaymentType
  to: (address: string) => PaymentType
  value: () => PaymentType
}

// State
export interface BorrowState {
  borrowHistory: RemoteData<NabuApiErrorType, any>
  coin: CoinType
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
    borrowHistory: any
  }
  type: typeof AT.FETCH_USER_BORROW_HISTORY_SUCCESS
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
  | FetchBorrowOffersSuccessAction
  | FetchUserBorrowHistoryFailureAction
  | FetchUserBorrowHistoryLoadingAction
  | FetchUserBorrowHistorySuccessAction
  | InitializeBorrowAction
  | SetPaymentFailure
  | SetPaymentLoading
  | SetPaymentSuccess
