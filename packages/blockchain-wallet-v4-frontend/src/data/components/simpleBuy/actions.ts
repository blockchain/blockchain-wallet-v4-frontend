import * as AT from './actionTypes'
import {
  CoinType,
  Everypay3DSResponseType,
  FiatEligibleType,
  FiatType,
  SBAccountType,
  SBBalancesType,
  SBCardType,
  SBOrderActionType,
  SBOrderType,
  SBPairsType,
  SBPairType,
  SBPaymentMethodsType,
  SBPaymentMethodType,
  SBProviderDetailsType,
  SBQuoteType,
  WalletFiatType
} from 'core/types'
import { ModalOriginType } from 'data/modals/types'
import {
  SBFixType,
  SBShowModalOriginType,
  SimpleBuyActionTypes,
  StepActionsPayload
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

export const addCardDetails = () => ({
  type: AT.ADD_CARD_DETAILS
})
export const addCardDetailsFailure = (error: string): SimpleBuyActionTypes => ({
  type: AT.ADD_CARD_DETAILS_FAILURE,
  payload: {
    error
  }
})
export const addCardDetailsLoading = (): SimpleBuyActionTypes => ({
  type: AT.ADD_CARD_DETAILS_LOADING
})
export const addCardDetailsSuccess = (
  everypay3DS: Everypay3DSResponseType
): SimpleBuyActionTypes => ({
  type: AT.ADD_CARD_DETAILS_SUCCESS,
  payload: {
    everypay3DS
  }
})

export const cancelSBOrder = (order: SBOrderType) => ({
  type: AT.CANCEL_ORDER,
  order
})

export const createSBOrder = (
  paymentMethodId?: SBCardType['id'],
  paymentType?: Exclude<
    SBPaymentMethodType['type'],
    'USER_CARD' | 'BANK_ACCOUNT'
  >
) => ({
  type: AT.CREATE_ORDER,
  paymentMethodId,
  paymentType
})

export const confirmSBCreditCardOrder = (
  paymentMethodId: SBCardType['id']
) => ({
  type: AT.CONFIRM_CREDIT_CARD_ORDER,
  paymentMethodId
})

export const confirmSBFundsOrder = () => ({
  type: AT.CONFIRM_FUNDS_ORDER
})

export const deleteSBCard = (cardId?: SBCardType['id']) => ({
  type: AT.DELETE_SB_CARD,
  cardId
})

export const destroyCheckout = () => ({
  type: AT.DESTROY_CHECKOUT
})

export const handleSBMethodChange = (method: SBPaymentMethodType) => ({
  type: AT.HANDLE_SB_METHOD_CHANGE,
  method
})

export const fetchSBBalances = (
  currency?: CoinType,
  skipLoading?: boolean
) => ({
  type: AT.FETCH_SB_BALANCES,
  currency,
  skipLoading
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

export const fetchSBCard = () => ({
  type: AT.FETCH_SB_CARD
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

export const fetchSBCards = (skipLoading?: boolean) => ({
  type: AT.FETCH_SB_CARDS,
  payload: {
    skipLoading
  }
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

export const fetchSBOrders = (skipLoading?: boolean) => ({
  type: AT.FETCH_SB_ORDERS,
  payload: {
    skipLoading
  }
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

export const fetchSBPaymentMethods = (currency?: FiatType) => ({
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

export const fetchSBQuote = (
  pair: SBPairsType,
  orderType: SBOrderActionType,
  amount: string
) => ({
  type: AT.FETCH_SB_QUOTE,
  pair,
  orderType,
  amount
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

export const handleSBDepositFiatClick = (
  coin: WalletFiatType,
  origin: ModalOriginType
) => ({
  type: AT.HANDLE_SB_DEPOSIT_FIAT_CLICK,
  payload: {
    coin,
    origin
  }
})

export const handleSBSuggestedAmountClick = (
  amount: string,
  coin: 'FIAT' | CoinType
) => ({
  type: AT.HANDLE_SB_SUGGESTED_AMOUNT_CLICK,
  payload: {
    amount,
    coin
  }
})

export const initializeBillingAddress = () => ({
  type: AT.INITIALIZE_BILLING_ADDRESS
})

export const initializeCheckout = (
  pairs: Array<SBPairType>,
  orderType: SBOrderActionType,
  fix: SBFixType,
  pair?: SBPairType,
  amount?: string
) => ({
  type: AT.INITIALIZE_CHECKOUT,
  amount,
  fix,
  orderType,
  pair,
  pairs
})

export const pollSBBalances = () => ({
  type: AT.POLL_SB_BALANCES
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

export const setStep = (payload: StepActionsPayload): SimpleBuyActionTypes => ({
  type: AT.SET_STEP,
  payload: getPayloadObjectForStep(payload)
})

const getPayloadObjectForStep = (payload: StepActionsPayload) => {
  switch (payload.step) {
    case 'PAYMENT_METHODS':
      return {
        step: payload.step,
        cryptoCurrency: payload.cryptoCurrency,
        fiatCurrency: payload.fiatCurrency,
        order: payload.order,
        pair: payload.pair
      }
    case 'ENTER_AMOUNT':
      return {
        step: payload.step,
        orderType: payload.orderType || 'BUY',
        cryptoCurrency: payload.cryptoCurrency,
        fiatCurrency: payload.fiatCurrency,
        method: payload.method,
        pair: payload.pair
      }
    case 'CRYPTO_SELECTION':
      return {
        step: payload.step,
        cryptoCurrency: payload.cryptoCurrency,
        fiatCurrency: payload.fiatCurrency
      }
    case 'TRANSFER_DETAILS':
      return {
        step: payload.step,
        fiatCurrency: payload.fiatCurrency,
        displayBack: payload.displayBack
      }
    case 'CHECKOUT_CONFIRM':
    case 'ORDER_SUMMARY':
    case 'CANCEL_ORDER':
      return { step: payload.step, order: payload.order }
    case '3DS_HANDLER':
      return { step: payload.step, order: payload.order }
    default:
      return { step: payload.step }
  }
}

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

export const switchFix = (orderType: SBOrderActionType, fix: SBFixType) => ({
  type: AT.SWITCH_FIX,
  payload: {
    orderType,
    fix
  }
})
