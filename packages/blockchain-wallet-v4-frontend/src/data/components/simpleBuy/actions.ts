import * as AT from './actionTypes'
import {
  CoinType,
  CurrenciesType,
  Everypay3DSResponseType,
  FiatEligibleType,
  FiatType,
  SBAccountType,
  SBBalancesType,
  SBCardType,
  SBOrderType,
  SBPairType,
  SBPaymentMethodsType,
  SBProviderDetailsType,
  SBQuoteType,
  SBSuggestedAmountType
} from 'core/types'
import {
  SBFormPaymentMethod,
  SBShowModalOriginType,
  SimpleBuyActionTypes
} from './types'

export const activateSBCard = (card: SBCardType) => ({
  type: AT.ACTIVATE_SB_CARD,
  card
})

export const activateSBCardFailure = (error: string): SimpleBuyActionTypes => ({
  type: AT.ACTIVATE_SB_CARD_FAILURE,
  payload: {
    error
  }
})

export const activateSBCardLoading = (): SimpleBuyActionTypes => ({
  type: AT.ACTIVATE_SB_CARD_LOADING
})

export const activateSBCardSuccess = (
  providerDetails: SBProviderDetailsType
): SimpleBuyActionTypes => ({
  type: AT.ACTIVATE_SB_CARD_SUCCESS,
  payload: {
    providerDetails
  }
})
export const cancelSBOrder = (order: SBOrderType) => ({
  type: AT.CANCEL_ORDER,
  order
})

export const createSBOrder = (paymentMethodId?: SBCardType['id']) => ({
  type: AT.CREATE_ORDER,
  paymentMethodId
})

export const confirmSBBankTransferOrder = () => ({
  type: AT.CONFIRM_BANK_TRANSFER_ORDER
})

export const confirmSBCreditCardOrder = (
  paymentMethodId: SBCardType['id']
) => ({
  type: AT.CONFIRM_CREDIT_CARD_ORDER,
  paymentMethodId
})

export const destroyCheckout = () => ({
  type: AT.DESTROY_CHECKOUT
})

export const fetchEverypay3DSDetails = () => ({
  type: AT.FETCH_EVERYPAY_3DS_DETAILS
})
export const fetchEverypay3DSDetailsFailure = (
  error: string
): SimpleBuyActionTypes => ({
  type: AT.FETCH_EVERYPAY_3DS_DETAILS_FAILURE,
  payload: {
    error
  }
})

export const fetchEverypay3DSDetailsLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_EVERYPAY_3DS_DETAILS_LOADING
})

export const fetchEverypay3DSDetailsSuccess = (
  everypay3DS: Everypay3DSResponseType
): SimpleBuyActionTypes => ({
  type: AT.FETCH_EVERYPAY_3DS_DETAILS_SUCCESS,
  payload: {
    everypay3DS
  }
})

export const fetchSBBalances = (currency?: CoinType) => ({
  type: AT.FETCH_SB_BALANCES,
  currency
})

export const fetchSBBalancesFailure = (
  error: string
): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_BALANCES_FAILURE,
  payload: {
    error
  }
})

export const fetchSBBalancesLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_BALANCES_LOADING
})

export const fetchSBBalancesSuccess = (
  balances: SBBalancesType
): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_BALANCES_SUCCESS,
  payload: {
    balances
  }
})

export const fetchSBCard = (cardId?: string) => ({
  type: AT.FETCH_SB_CARD,
  cardId
})

export const fetchSBCardFailure = (error: string): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_CARD_FAILURE,
  payload: {
    error
  }
})

export const fetchSBCardLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_CARD_LOADING
})

export const fetchSBCardSuccess = (card: SBCardType): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_CARD_SUCCESS,
  payload: {
    card
  }
})

export const fetchSBCards = () => ({
  type: AT.FETCH_SB_CARDS
})

export const fetchSBCardsFailure = (error: string): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_CARDS_FAILURE,
  payload: {
    error
  }
})

export const fetchSBCardsLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_CARDS_LOADING
})

export const fetchSBCardsSuccess = (
  cards: Array<SBCardType>
): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_CARDS_SUCCESS,
  payload: {
    cards
  }
})

export const fetchSBFiatEligible = (currency: FiatType) => ({
  type: AT.FETCH_SB_FIAT_ELIGIBLE,
  currency
})

export const fetchSBFiatEligibleFailure = (
  error: string
): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_FIAT_ELIGIBLE_FAILURE,
  payload: {
    error
  }
})

export const fetchSBFiatEligibleLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_FIAT_ELIGIBLE_LOADING
})

export const fetchSBFiatEligibleSuccess = (
  fiatEligible: FiatEligibleType
): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_FIAT_ELIGIBLE_SUCCESS,
  payload: {
    fiatEligible
  }
})

export const fetchSBOrders = () => ({
  type: AT.FETCH_SB_ORDERS
})

export const fetchSBOrdersFailure = (error: string): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_ORDERS_FAILURE,
  payload: {
    error
  }
})

export const fetchSBOrdersLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_ORDERS_LOADING
})

export const fetchSBOrdersSuccess = (
  orders: Array<SBOrderType>
): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_ORDERS_SUCCESS,
  payload: {
    orders
  }
})

export const fetchSBPairs = (currency: FiatType) => ({
  type: AT.FETCH_SB_PAIRS,
  currency
})

export const fetchSBPairsFailure = (error: string): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_PAIRS_FAILURE,
  payload: {
    error
  }
})

export const fetchSBPairsLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_PAIRS_LOADING
})

export const fetchSBPairsSuccess = (
  pairs: Array<SBPairType>
): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_PAIRS_SUCCESS,
  payload: {
    pairs
  }
})

export const fetchSBPaymentAccount = () => ({
  type: AT.FETCH_SB_PAYMENT_ACCOUNT
})

export const fetchSBPaymentAccountFailure = (
  error: string
): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_PAYMENT_ACCOUNT_FAILURE,
  payload: {
    error
  }
})

export const fetchSBPaymentAccountLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_PAYMENT_ACCOUNT_LOADING
})

export const fetchSBPaymentAccountSuccess = (
  account: SBAccountType
): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_PAYMENT_ACCOUNT_SUCCESS,
  payload: {
    account
  }
})

export const fetchSBPaymentMethods = (currency: FiatType) => ({
  type: AT.FETCH_SB_PAYMENT_METHODS,
  currency
})

export const fetchSBPaymentMethodsFailure = (
  error: string
): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_PAYMENT_METHODS_FAILURE,
  payload: {
    error
  }
})

export const fetchSBPaymentMethodsLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_PAYMENT_METHODS_LOADING
})

export const fetchSBPaymentMethodsSuccess = (
  methods: SBPaymentMethodsType
): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_PAYMENT_METHODS_SUCCESS,
  payload: {
    methods
  }
})

export const fetchSBQuote = () => ({
  type: AT.FETCH_SB_QUOTE
})

export const fetchSBQuoteFailure = (error: string): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_QUOTE_FAILURE,
  payload: {
    error
  }
})

export const fetchSBQuoteLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_QUOTE_LOADING
})

export const fetchSBQuoteSuccess = (
  quote: SBQuoteType
): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_QUOTE_SUCCESS,
  payload: {
    quote
  }
})

export const fetchSBSuggestedAmounts = (currency: keyof CurrenciesType) => ({
  type: AT.FETCH_SB_SUGGESTED_AMOUNTS,
  currency
})

export const fetchSBSuggestedAmountsFailure = (
  error: Error | string
): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_SUGGESTED_AMOUNTS_FAILURE,
  payload: {
    error
  }
})

export const fetchSBSuggestedAmountsLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_SUGGESTED_AMOUNTS_LOADING
})

export const fetchSBSuggestedAmountsSuccess = (
  amounts: SBSuggestedAmountType
): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_SUGGESTED_AMOUNTS_SUCCESS,
  payload: {
    amounts
  }
})

export const handleSBSuggestedAmountClick = (amount: string) => ({
  type: AT.HANDLE_SB_SUGGESTED_AMOUNT_CLICK,
  payload: {
    amount
  }
})

export const initializeBillingAddress = () => ({
  type: AT.INITIALIZE_BILLING_ADDRESS
})

export const initializeCheckout = (
  pairs: Array<SBPairType>,
  paymentMethods: SBPaymentMethodsType,
  orderType: 'BUY' | 'SELL'
) => ({
  type: AT.INITIALIZE_CHECKOUT,
  pairs,
  paymentMethods,
  orderType
})

export const pollSBCard = (cardId: SBCardType['id']) => ({
  type: AT.POLL_SB_CARD,
  payload: {
    cardId
  }
})

export const pollSBOrder = (orderId: string) => ({
  type: AT.POLL_SB_ORDER,
  payload: {
    orderId
  }
})

export const setStep = (
  payload:
    | {
        order: SBOrderType
        step:
          | 'CHECKOUT_CONFIRM'
          | 'TRANSFER_DETAILS'
          | 'ORDER_SUMMARY'
          | 'CANCEL_ORDER'
      }
    | {
        cryptoCurrency?: CoinType
        defaultMethod?: SBFormPaymentMethod
        fiatCurrency: FiatType
        step: 'ENTER_AMOUNT'
      }
    | { cardId?: string; step: 'ADD_CARD' }
    | { order?: SBOrderType; step: '3DS_HANDLER' }
    | { step: 'CURRENCY_SELECTION' | 'CC_BILLING_ADDRESS' }
): SimpleBuyActionTypes => ({
  type: AT.SET_STEP,
  payload:
    payload.step === 'ENTER_AMOUNT'
      ? {
          step: payload.step,
          cryptoCurrency: payload.cryptoCurrency,
          defaultMethod: payload.defaultMethod,
          fiatCurrency: payload.fiatCurrency
        }
      : payload.step === 'CHECKOUT_CONFIRM' ||
        payload.step === 'TRANSFER_DETAILS' ||
        payload.step === 'ORDER_SUMMARY' ||
        payload.step === 'CANCEL_ORDER'
      ? { step: payload.step, order: payload.order }
      : payload.step === 'ADD_CARD'
      ? { step: payload.step, cardId: payload.cardId }
      : payload.step === '3DS_HANDLER'
      ? { step: payload.step, order: payload.order }
      : {
          step: payload.step
        }
})

export const showModal = (
  origin: SBShowModalOriginType,
  cryptoCurrency?: CoinType
) => ({
  type: AT.SHOW_MODAL,
  payload: {
    origin,
    cryptoCurrency
  }
})
