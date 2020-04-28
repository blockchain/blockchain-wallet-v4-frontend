import * as AT from './actionTypes'
import {
  CoinType,
  FiatEligibleType,
  FiatType,
  RemoteDataType,
  SBAccountType,
  SBBalancesType,
  SBOrderType,
  SBPairType,
  SBQuoteType,
  SBSuggestedAmountType
} from 'core/types'

// Types
export type SBCheckoutFormValuesType = {
  amount: string
  orderType: 'BUY' | 'SELL'
  pair?: SBPairType
}
export type SBCurrencySelectFormType = {
  search: string
}
export enum SimpleBuyStepType {
  'CURRENCY_SELECTION',
  'ENTER_AMOUNT',
  'CHECKOUT_CONFIRM',
  'ORDER_SUMMARY',
  'TRANSFER_DETAILS',
  'CANCEL_ORDER'
}

// State
export type SimpleBuyState = {
  account: RemoteDataType<string, SBAccountType>
  balances: RemoteDataType<string, SBBalancesType>
  cryptoCurrency: undefined | CoinType
  fiatCurrency: undefined | FiatType
  fiatEligible: RemoteDataType<string, FiatEligibleType>
  order: undefined | SBOrderType
  orders: RemoteDataType<string, Array<SBOrderType>>
  pairs: RemoteDataType<string, Array<SBPairType>>
  quote: RemoteDataType<string, SBQuoteType>
  step: keyof typeof SimpleBuyStepType
  suggestedAmounts: RemoteDataType<Error | string, SBSuggestedAmountType>
}

// Actions
interface DestroyCheckout {
  type: typeof AT.DESTROY_CHECKOUT
}
interface FetchSBBalancesFailure {
  payload: {
    error: string
  }
  type: typeof AT.FETCH_SB_BALANCES_FAILURE
}

interface FetchSBBalancesLoading {
  type: typeof AT.FETCH_SB_BALANCES_LOADING
}

interface FetchSBBalancesSuccess {
  payload: {
    balances: SBBalancesType
  }
  type: typeof AT.FETCH_SB_BALANCES_SUCCESS
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
interface FetchSBQuoteFailure {
  payload: {
    error: string
  }
  type: typeof AT.FETCH_SB_QUOTE_FAILURE
}
interface FetchSBQuoteLoading {
  type: typeof AT.FETCH_SB_QUOTE_LOADING
}
interface FetchSBQuoteSuccess {
  payload: {
    quote: SBQuoteType
  }
  type: typeof AT.FETCH_SB_QUOTE_SUCCESS
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
        cryptoCurrency?: CoinType
        fiatCurrency: FiatType
        step: 'ENTER_AMOUNT'
      }
    | {
        step: 'CURRENCY_SELECTION'
      }
    | {
        order: SBOrderType
        step:
          | 'CHECKOUT_CONFIRM'
          | 'ORDER_SUMMARY'
          | 'TRANSFER_DETAILS'
          | 'CANCEL_ORDER'
      }
  type: typeof AT.SET_STEP
}
interface ShowModalAction {
  payload: {
    cryptoCurrency?: CoinType
    origin:
      | 'sideNav'
      | 'settingsProfile'
      | 'pendingOrder'
      | 'welcomeModal'
      | 'priceChart'
      | 'emptyFeed'
  }
  type: typeof AT.SHOW_MODAL
}

export type SimpleBuyActionTypes =
  | DestroyCheckout
  | FetchSBBalancesFailure
  | FetchSBBalancesLoading
  | FetchSBBalancesSuccess
  | FetchSBFiatEligibleFailure
  | FetchSBFiatEligibleLoading
  | FetchSBFiatEligibleSuccess
  | FetchSBOrdersFailure
  | FetchSBOrdersLoading
  | FetchSBOrdersSuccess
  | FetchSBPairsFailure
  | FetchSBPairsLoading
  | FetchSBPairsSuccess
  | FetchSBPaymentAccountFailure
  | FetchSBPaymentAccountLoading
  | FetchSBPaymentAccountSuccess
  | FetchSBQuoteFailure
  | FetchSBQuoteLoading
  | FetchSBQuoteSuccess
  | FetchSBSuggestedAmountsFailure
  | FetchSBSuggestedAmountsLoading
  | FetchSBSuggestedAmountsSuccess
  | SetStepAction
  | ShowModalAction
