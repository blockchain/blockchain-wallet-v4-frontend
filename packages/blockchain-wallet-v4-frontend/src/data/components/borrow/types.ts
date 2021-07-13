import {
  AccountTypes,
  CoinType,
  LoanTransactionsType,
  LoanType,
  NabuApiErrorType,
  OfferType,
  PaymentValue,
  RemoteDataType
} from 'blockchain-wallet-v4/src/types'

import * as AT from './actionTypes'

// Types

export type BorrowFormValuesType = {
  additionalCollateral?: string
  collateral: AccountTypes
  collateralCryptoAmt?: number
  maxCollateral?: number
  offer: OfferType
  principal: string
}

export type BorrowMinMaxType = {
  maxFiat: number
  minFiat: number
}

export enum BorrowSteps {
  'CHECKOUT',
  'CONFIRM',
  'DETAILS',
  'ADD_COLLATERAL',
  'REPAY_LOAN'
}

export type RepayLoanFormType = {
  amount?: string
  'repay-method': 'principal' | 'collateral'
  'repay-type': 'full' | 'partial'
}

// State
export interface BorrowState {
  borrowHistory: RemoteDataType<NabuApiErrorType, Array<LoanType>>
  coin: CoinType
  limits: BorrowMinMaxType
  loan?: LoanType
  loanTransactions: RemoteDataType<
    NabuApiErrorType,
    Array<LoanTransactionsType>
  >
  offer?: OfferType
  offers: RemoteDataType<NabuApiErrorType, Array<OfferType>>
  payment: RemoteDataType<string | Error, PaymentValue>
  step: keyof typeof BorrowSteps
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
interface FetchLoanTransactionsFailureAction {
  payload: {
    error: NabuApiErrorType
  }
  type: typeof AT.FETCH_LOAN_TRANSACTIONS_FAILURE
}

interface FetchLoanTransactionsLoadingAction {
  type: typeof AT.FETCH_LOAN_TRANSACTIONS_LOADING
}
interface FetchLoanTransactionsSuccessAction {
  payload: {
    transactions: Array<LoanTransactionsType>
  }
  type: typeof AT.FETCH_LOAN_TRANSACTIONS_SUCCESS
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
  }
  type: typeof AT.INITIALIZE_BORROW
}

interface InitializeRepayLoanAction {
  payload: {
    coin: CoinType
  }
  type: typeof AT.INITIALIZE_REPAY_LOAN
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
    payment: PaymentValue
  }
  type: typeof AT.SET_PAYMENT_SUCCESS
}

interface SetStepAction {
  payload:
    | {
        offer?: OfferType
        step: 'CHECKOUT' | 'CONFIRM'
      }
    | {
        loan: LoanType
        offer: OfferType
        step: 'DETAILS' | 'ADD_COLLATERAL' | 'REPAY_LOAN'
      }
  type: typeof AT.SET_STEP
}

export type BorrowActionTypes =
  | FetchBorrowOffersFailureAction
  | FetchBorrowOffersLoadingAction
  | FetchBorrowOffersSuccessAction
  | FetchLoanTransactionsFailureAction
  | FetchLoanTransactionsLoadingAction
  | FetchLoanTransactionsSuccessAction
  | FetchUserBorrowHistoryFailureAction
  | FetchUserBorrowHistoryLoadingAction
  | FetchUserBorrowHistorySuccessAction
  | InitializeBorrowAction
  | InitializeRepayLoanAction
  | SetCoinAction
  | SetLimitsAction
  | SetPaymentFailureAction
  | SetPaymentLoadingAction
  | SetPaymentSuccessAction
  | SetStepAction
