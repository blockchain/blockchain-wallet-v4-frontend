import * as AT from './actionTypes'
import {
  CoinType,
  Everypay3DSResponseType,
  FiatEligibleType,
  FiatType,
  RemoteDataType,
  SBAccountType,
  SBBalancesType,
  SBCardType,
  SBOrderType,
  SBPairType,
  SBPaymentMethodsType,
  SBPaymentMethodType,
  SBProviderDetailsType,
  SBQuoteType,
  SBSuggestedAmountType
} from 'core/types'

// Types
export type SBAddCardFormValuesType = {
  'card-number': string
  cvc: string
  'expiry-date': string
  'name-on-card': string
}
export type SBCheckoutFormValuesType = {
  amount: string
  method?: SBPaymentMethodType
  orderType: 'BUY' | 'SELL'
  pair?: SBPairType
}
export type SBCurrencySelectFormType = {
  search: string
}
export enum SimpleBuyStepType {
  'CURRENCY_SELECTION',
  'ENTER_AMOUNT',
  'ADD_CARD',
  '3DS_HANDLER',
  'CHECKOUT_CONFIRM',
  'ORDER_SUMMARY',
  'TRANSFER_DETAILS',
  'CANCEL_ORDER'
}

// State
export type SimpleBuyState = {
  account: RemoteDataType<string, SBAccountType>
  balances: RemoteDataType<string, SBBalancesType>
  card: RemoteDataType<string, SBCardType>
  cardId: undefined | string
  cards: RemoteDataType<string, Array<SBCardType>>
  cryptoCurrency: undefined | CoinType
  everypay3DS: RemoteDataType<string, Everypay3DSResponseType>
  fiatCurrency: undefined | FiatType
  fiatEligible: RemoteDataType<string, FiatEligibleType>
  methods: RemoteDataType<string, SBPaymentMethodsType>
  order: undefined | SBOrderType
  orders: RemoteDataType<string, Array<SBOrderType>>
  pairs: RemoteDataType<string, Array<SBPairType>>
  providerDetails: RemoteDataType<string, SBProviderDetailsType>
  quote: RemoteDataType<string, SBQuoteType>
  step: keyof typeof SimpleBuyStepType
  suggestedAmounts: RemoteDataType<Error | string, SBSuggestedAmountType>
}

// Actions
interface ActivateSBCardFailure {
  payload: {
    error: string
  }
  type: typeof AT.ACTIVATE_SB_CARD_FAILURE
}
interface ActivateSBCardLoading {
  type: typeof AT.ACTIVATE_SB_CARD_LOADING
}

interface ActivateSBCardSuccess {
  payload: {
    providerDetails: SBProviderDetailsType
  }
  type: typeof AT.ACTIVATE_SB_CARD_SUCCESS
}
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
interface FetchSBCardFailure {
  payload: {
    error: string
  }
  type: typeof AT.FETCH_SB_CARD_FAILURE
}
interface FetchSBCardLoading {
  type: typeof AT.FETCH_SB_CARD_LOADING
}

interface FetchSBCardSuccess {
  payload: {
    card: SBCardType
  }
  type: typeof AT.FETCH_SB_CARD_SUCCESS
}
interface FetchSBCardsFailure {
  payload: {
    error: string
  }
  type: typeof AT.FETCH_SB_CARDS_FAILURE
}

interface FetchSBCardsLoading {
  type: typeof AT.FETCH_SB_CARDS_LOADING
}
interface FetchSBCardsSuccess {
  payload: {
    cards: Array<SBCardType>
  }
  type: typeof AT.FETCH_SB_CARDS_SUCCESS
}

interface FetchEverypay3DSFailure {
  payload: {
    error: string
  }
  type: typeof AT.FETCH_EVERYPAY_3DS_DETAILS_FAILURE
}
interface FetchEverypay3DSLoading {
  type: typeof AT.FETCH_EVERYPAY_3DS_DETAILS_LOADING
}
interface FetchEverypay3DSSuccess {
  payload: {
    everypay3DS: Everypay3DSResponseType
  }
  type: typeof AT.FETCH_EVERYPAY_3DS_DETAILS_SUCCESS
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

interface FetchSBPaymentMethodsFailure {
  payload: {
    error: string
  }
  type: typeof AT.FETCH_SB_PAYMENT_METHODS_FAILURE
}
interface FetchSBPaymentMethodsLoading {
  type: typeof AT.FETCH_SB_PAYMENT_METHODS_LOADING
}
interface FetchSBPaymentMethodsSuccess {
  payload: {
    methods: SBPaymentMethodsType
  }
  type: typeof AT.FETCH_SB_PAYMENT_METHODS_SUCCESS
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
        order: SBOrderType
        step:
          | 'CHECKOUT_CONFIRM'
          | 'ORDER_SUMMARY'
          | 'TRANSFER_DETAILS'
          | 'CANCEL_ORDER'
      }
    | {
        cardId?: string
        step: 'ADD_CARD'
      }
    | {
        step: '3DS_HANDLER'
      }
    | {
        step: 'CURRENCY_SELECTION'
      }
  type: typeof AT.SET_STEP
}
interface ShowModalAction {
  payload: {
    cryptoCurrency?: CoinType
    origin:
      | 'sideNav'
      | 'pendingOrder'
      | 'welcomeModal'
      | 'priceChart'
      | 'emptyFeed'
  }
  type: typeof AT.SHOW_MODAL
}

export type SimpleBuyActionTypes =
  | ActivateSBCardFailure
  | ActivateSBCardLoading
  | ActivateSBCardSuccess
  | DestroyCheckout
  | FetchSBBalancesFailure
  | FetchSBBalancesLoading
  | FetchSBBalancesSuccess
  | FetchSBCardFailure
  | FetchSBCardLoading
  | FetchSBCardSuccess
  | FetchSBCardsFailure
  | FetchSBCardsLoading
  | FetchSBCardsSuccess
  | FetchEverypay3DSFailure
  | FetchEverypay3DSLoading
  | FetchEverypay3DSSuccess
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
  | FetchSBPaymentMethodsFailure
  | FetchSBPaymentMethodsLoading
  | FetchSBPaymentMethodsSuccess
  | FetchSBQuoteFailure
  | FetchSBQuoteLoading
  | FetchSBQuoteSuccess
  | FetchSBSuggestedAmountsFailure
  | FetchSBSuggestedAmountsLoading
  | FetchSBSuggestedAmountsSuccess
  | SetStepAction
  | ShowModalAction
