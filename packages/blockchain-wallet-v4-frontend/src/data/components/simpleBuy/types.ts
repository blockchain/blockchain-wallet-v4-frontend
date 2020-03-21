import * as AT from './actionTypes'
import {
  CurrenciesType,
  FiatCurrenciesType,
  FiatEligibleType,
  RemoteDataType,
  SBAccountType,
  SBOrderType,
  SBPairType,
  SBSuggestedAmountType
} from 'core/types'

// Types
export type SBCheckoutFormValuesType = {
  amount: string
  pair?: SBPairType
}
export type SBCurrencySelectFormType = {
  search: string
}
export enum SimpleBuyStepType {
  'CURRENCY_SELECTION',
  'ENTER_AMOUNT',
  'ORDER_DETAILS'
}

// State
export type SimpleBuyState = {
  account: RemoteDataType<string, SBAccountType>
  fiatCurrency: undefined | keyof FiatCurrenciesType
  fiatEligible: RemoteDataType<string, FiatEligibleType>
  order: undefined | SBOrderType
  orders: RemoteDataType<string, Array<SBOrderType>>
  pairs: RemoteDataType<string, Array<SBPairType>>
  step: keyof typeof SimpleBuyStepType
  suggestedAmounts: RemoteDataType<Error | string, SBSuggestedAmountType>
}

// Actions
interface DestroyCheckout {
  type: typeof AT.DESTROY_CHECKOUT
}
interface FetchSBFiatEligible {
  payload: {
    currency: keyof CurrenciesType
  }
  type: typeof AT.FETCH_SB_FIAT_ELIGIBLE
}

interface FetchSBFiatEligibleFailure {
  payload: {
    error: string
  }
  type: typeof AT.FETCH_SB_FIAT_ELIGIBLE_FAILURE
}

interface FetchSBFiatEligibleLoading {
  type: typeof AT.FETCH_SB_FIAT_ELIGIBLE_LOADING
}

interface FetchSBFiatEligibleSuccess {
  payload: {
    fiatEligible: FiatEligibleType
  }
  type: typeof AT.FETCH_SB_FIAT_ELIGIBLE_SUCCESS
}
interface FetchSBOrders {
  type: typeof AT.FETCH_SB_ORDERS
}
interface FetchSBOrdersFailure {
  payload: {
    error: string
  }
  type: typeof AT.FETCH_SB_ORDERS_FAILURE
}

interface FetchSBOrdersLoading {
  type: typeof AT.FETCH_SB_ORDERS_LOADING
}

interface FetchSBOrdersSuccess {
  payload: {
    orders: Array<SBOrderType>
  }
  type: typeof AT.FETCH_SB_ORDERS_SUCCESS
}
interface FetchSBPairs {
  payload: {
    currency: keyof CurrenciesType
  }
  type: typeof AT.FETCH_SB_PAIRS
}

interface FetchSBPairsFailure {
  payload: {
    error: string
  }
  type: typeof AT.FETCH_SB_PAIRS_FAILURE
}

interface FetchSBPairsLoading {
  type: typeof AT.FETCH_SB_PAIRS_LOADING
}

interface FetchSBPairsSuccess {
  payload: {
    pairs: Array<SBPairType>
  }
  type: typeof AT.FETCH_SB_PAIRS_SUCCESS
}

interface FetchSBPaymentAccount {
  type: typeof AT.FETCH_SB_PAYMENT_ACCOUNT
}

interface FetchSBPaymentAccountFailure {
  payload: {
    error: string
  }
  type: typeof AT.FETCH_SB_PAYMENT_ACCOUNT_FAILURE
}

interface FetchSBPaymentAccountLoading {
  type: typeof AT.FETCH_SB_PAYMENT_ACCOUNT_LOADING
}

interface FetchSBPaymentAccountSuccess {
  payload: {
    account: SBAccountType
  }
  type: typeof AT.FETCH_SB_PAYMENT_ACCOUNT_SUCCESS
}

interface FetchSBSuggestedAmounts {
  payload: {
    currency: keyof CurrenciesType
  }
  type: typeof AT.FETCH_SB_SUGGESTED_AMOUNTS
}

interface FetchSBSuggestedAmountsFailure {
  payload: {
    error: Error | string
  }
  type: typeof AT.FETCH_SB_SUGGESTED_AMOUNTS_FAILURE
}

interface FetchSBSuggestedAmountsLoading {
  type: typeof AT.FETCH_SB_SUGGESTED_AMOUNTS_LOADING
}

interface FetchSBSuggestedAmountsSuccess {
  payload: {
    amounts: SBSuggestedAmountType
  }
  type: typeof AT.FETCH_SB_SUGGESTED_AMOUNTS_SUCCESS
}

interface SetStepAction {
  payload:
    | {
        fiatCurrency: keyof FiatCurrenciesType
        step: 'ENTER_AMOUNT'
      }
    | {
        step: 'CURRENCY_SELECTION'
      }
    | {
        order: SBOrderType
        step: 'ORDER_DETAILS'
      }
  type: typeof AT.SET_STEP
}
interface ShowModalAction {
  type: typeof AT.SHOW_MODAL
}

export type SimpleBuyActionTypes =
  | DestroyCheckout
  | FetchSBFiatEligible
  | FetchSBFiatEligibleFailure
  | FetchSBFiatEligibleLoading
  | FetchSBFiatEligibleSuccess
  | FetchSBOrders
  | FetchSBOrdersFailure
  | FetchSBOrdersLoading
  | FetchSBOrdersSuccess
  | FetchSBPaymentAccount
  | FetchSBPairs
  | FetchSBPairsFailure
  | FetchSBPairsLoading
  | FetchSBPairsSuccess
  | FetchSBPaymentAccount
  | FetchSBPaymentAccountFailure
  | FetchSBPaymentAccountLoading
  | FetchSBPaymentAccountSuccess
  | FetchSBSuggestedAmounts
  | FetchSBSuggestedAmountsFailure
  | FetchSBSuggestedAmountsLoading
  | FetchSBSuggestedAmountsSuccess
  | SetStepAction
  | ShowModalAction
