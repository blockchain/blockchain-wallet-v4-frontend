import {
  CoinType,
  Everypay3DSResponseType,
  FiatEligibleType,
  FiatType,
  PaymentValue,
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
  SDDEligibleType,
  SDDVerifiedType,
  SwapQuoteType,
  SwapUserLimitsType,
  WalletFiatType
} from 'blockchain-wallet-v4/src/types'
import { ModalOriginType } from 'data/modals/types'
import { BankTransferAccountType } from 'data/types'

import { SwapAccountType } from '../swap/types'
import * as AT from './actionTypes'
import { SBFixType, SBShowModalOriginType, SimpleBuyActionTypes, StepActionsPayload } from './types'

const getPayloadObjectForStep = (payload: StepActionsPayload) => {
  switch (payload.step) {
    case 'LINKED_PAYMENT_ACCOUNTS':
    case 'PAYMENT_METHODS':
      return {
        cryptoCurrency: payload.cryptoCurrency,
        fiatCurrency: payload.fiatCurrency,
        order: payload.order,
        pair: payload.pair,
        step: payload.step
      }
    case 'VERIFY_EMAIL':
    case 'ENTER_AMOUNT':
      return {
        cryptoCurrency: payload.cryptoCurrency,
        fiatCurrency: payload.fiatCurrency,
        method: payload.method,
        orderType: payload.orderType || 'BUY',
        pair: payload.pair,
        step: payload.step,
        swapAccount: payload.swapAccount
      }
    case 'CRYPTO_SELECTION':
      return {
        cryptoCurrency: payload.cryptoCurrency,
        fiatCurrency: payload.fiatCurrency,
        orderType: payload.orderType,
        step: payload.step
      }
    case 'BANK_WIRE_DETAILS':
      return {
        addBank: payload.addBank,
        displayBack: payload.displayBack,
        fiatCurrency: payload.fiatCurrency,
        step: payload.step
      }
    case 'PREVIEW_SELL': {
      return { sellOrderType: payload.sellOrderType, step: payload.step }
    }
    case 'AUTHORIZE_PAYMENT':
    case 'CHECKOUT_CONFIRM':
    case 'ORDER_SUMMARY':
    case 'OPEN_BANKING_CONNECT':
      return { order: payload.order, step: payload.step }
    case '3DS_HANDLER':
      return { order: payload.order, step: payload.step }
    case 'SELL_ORDER_SUMMARY':
      return { sellOrder: payload.sellOrder, step: payload.step }
    default:
      return { step: payload.step }
  }
}

export const activateSBCard = (card: SBCardType) => ({
  card,
  type: AT.ACTIVATE_SB_CARD
})
export const activateSBCardFailure = (error: string): SimpleBuyActionTypes => ({
  payload: {
    error
  },
  type: AT.ACTIVATE_SB_CARD_FAILURE
})
export const activateSBCardLoading = (): SimpleBuyActionTypes => ({
  type: AT.ACTIVATE_SB_CARD_LOADING
})
export const activateSBCardSuccess = (
  providerDetails: SBProviderDetailsType
): SimpleBuyActionTypes => ({
  payload: {
    providerDetails
  },
  type: AT.ACTIVATE_SB_CARD_SUCCESS
})

export const addCardDetails = () => ({
  type: AT.ADD_CARD_DETAILS
})
export const addCardDetailsFailure = (error: string): SimpleBuyActionTypes => ({
  payload: {
    error
  },
  type: AT.ADD_CARD_DETAILS_FAILURE
})
export const addCardDetailsLoading = (): SimpleBuyActionTypes => ({
  type: AT.ADD_CARD_DETAILS_LOADING
})
export const addCardDetailsSuccess = (
  everypay3DS: Everypay3DSResponseType
): SimpleBuyActionTypes => ({
  payload: {
    everypay3DS
  },
  type: AT.ADD_CARD_DETAILS_SUCCESS
})

export const cancelSBOrder = (order: SBOrderType) => ({
  order,
  type: AT.CANCEL_ORDER
})

export const createSBOrder = (
  paymentType?: Exclude<SBPaymentMethodType['type'], 'USER_CARD' | 'BANK_ACCOUNT'>,
  paymentMethodId?: SBCardType['id'] | BankTransferAccountType['id']
) => ({
  paymentMethodId,
  paymentType,
  type: AT.CREATE_ORDER
})

export const confirmOrderPoll = (order: SBOrderType) => ({
  payload: { order },
  type: AT.CONFIRM_ORDER_POLL
})

export const confirmSBOrder = (paymentMethodId: SBCardType['id'], order: SBOrderType) => ({
  order,
  paymentMethodId,
  type: AT.CONFIRM_CREDIT_CARD_ORDER
})

export const confirmSBFundsOrder = () => ({
  type: AT.CONFIRM_FUNDS_ORDER
})

export const deleteSBCard = (cardId?: SBCardType['id']) => ({
  cardId,
  type: AT.DELETE_SB_CARD
})

export const destroyCheckout = () => ({
  type: AT.DESTROY_CHECKOUT
})

export const handleSBMethodChange = (method: SBPaymentMethodType) => ({
  method,
  type: AT.HANDLE_SB_METHOD_CHANGE
})

export const fetchSBBalances = (currency?: CoinType, skipLoading?: boolean) => ({
  currency,
  skipLoading,
  type: AT.FETCH_SB_BALANCES
})

export const fetchSBBalancesFailure = (error: string): SimpleBuyActionTypes => ({
  payload: {
    error
  },
  type: AT.FETCH_SB_BALANCES_FAILURE
})

export const fetchSBBalancesLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_BALANCES_LOADING
})

export const fetchSBBalancesSuccess = (balances: SBBalancesType): SimpleBuyActionTypes => ({
  payload: {
    balances
  },
  type: AT.FETCH_SB_BALANCES_SUCCESS
})

export const fetchSBCard = () => ({
  type: AT.FETCH_SB_CARD
})

export const fetchSBCardFailure = (error: string): SimpleBuyActionTypes => ({
  payload: {
    error
  },
  type: AT.FETCH_SB_CARD_FAILURE
})

export const fetchSBCardLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_CARD_LOADING
})

export const fetchSBCardSuccess = (card: SBCardType): SimpleBuyActionTypes => ({
  payload: {
    card
  },
  type: AT.FETCH_SB_CARD_SUCCESS
})

export const fetchSBCards = (skipLoading?: boolean) => ({
  payload: {
    skipLoading
  },
  type: AT.FETCH_SB_CARDS
})

export const fetchSBCardsFailure = (error: string): SimpleBuyActionTypes => ({
  payload: {
    error
  },
  type: AT.FETCH_SB_CARDS_FAILURE
})

export const fetchSBCardsLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_CARDS_LOADING
})

export const fetchSBCardsSuccess = (cards: Array<SBCardType>): SimpleBuyActionTypes => ({
  payload: {
    cards
  },
  type: AT.FETCH_SB_CARDS_SUCCESS
})

export const fetchSBFiatEligible = (currency: FiatType) => ({
  currency,
  type: AT.FETCH_SB_FIAT_ELIGIBLE
})

export const fetchSBFiatEligibleFailure = (error: string): SimpleBuyActionTypes => ({
  payload: {
    error
  },
  type: AT.FETCH_SB_FIAT_ELIGIBLE_FAILURE
})

export const fetchSBFiatEligibleLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_FIAT_ELIGIBLE_LOADING
})

export const fetchSBFiatEligibleSuccess = (
  fiatEligible: FiatEligibleType
): SimpleBuyActionTypes => ({
  payload: {
    fiatEligible
  },
  type: AT.FETCH_SB_FIAT_ELIGIBLE_SUCCESS
})

export const fetchSDDEligible = () => ({
  type: AT.FETCH_SDD_ELIGIBILITY
})

export const fetchSDDEligibleFailure = (error: string): SimpleBuyActionTypes => ({
  payload: {
    error
  },
  type: AT.FETCH_SDD_ELIGIBILITY_FAILURE
})

export const fetchSDDEligibleLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_SDD_ELIGIBILITY_LOADING
})

export const fetchSDDEligibleSuccess = (sddEligible: SDDEligibleType): SimpleBuyActionTypes => ({
  payload: {
    sddEligible
  },
  type: AT.FETCH_SDD_ELIGIBILITY_SUCCESS
})
export const fetchSDDVerified = () => ({
  type: AT.FETCH_SDD_VERIFIED
})

export const fetchSDDVerifiedFailure = (error: string): SimpleBuyActionTypes => ({
  payload: {
    error
  },
  type: AT.FETCH_SDD_VERIFIED_FAILURE
})

export const fetchSDDVerifiedLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_SDD_VERIFIED_LOADING
})

export const fetchSDDVerifiedSuccess = (sddVerified: SDDVerifiedType): SimpleBuyActionTypes => ({
  payload: {
    sddVerified
  },
  type: AT.FETCH_SDD_VERIFIED_SUCCESS
})

export const fetchSBOrders = (skipLoading?: boolean) => ({
  payload: {
    skipLoading
  },
  type: AT.FETCH_SB_ORDERS
})

export const fetchSBOrdersFailure = (error: string): SimpleBuyActionTypes => ({
  payload: {
    error
  },
  type: AT.FETCH_SB_ORDERS_FAILURE
})

export const fetchSBOrdersLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_ORDERS_LOADING
})

export const fetchSBOrdersSuccess = (orders: Array<SBOrderType>): SimpleBuyActionTypes => ({
  payload: {
    orders
  },
  type: AT.FETCH_SB_ORDERS_SUCCESS
})

export const fetchSBPairs = (currency: FiatType, coin?: CoinType) => ({
  coin,
  currency,
  type: AT.FETCH_SB_PAIRS
})

export const fetchSBPairsFailure = (error: string): SimpleBuyActionTypes => ({
  payload: {
    error
  },
  type: AT.FETCH_SB_PAIRS_FAILURE
})

export const fetchSBPairsLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_PAIRS_LOADING
})

export const fetchSBPairsSuccess = (
  pairs: Array<SBPairType>,
  coin?: CoinType
): SimpleBuyActionTypes => ({
  payload: {
    coin,
    pairs
  },
  type: AT.FETCH_SB_PAIRS_SUCCESS
})

export const fetchSBPaymentAccount = () => ({
  type: AT.FETCH_SB_PAYMENT_ACCOUNT
})

export const fetchSBPaymentAccountFailure = (error: string): SimpleBuyActionTypes => ({
  payload: {
    error
  },
  type: AT.FETCH_SB_PAYMENT_ACCOUNT_FAILURE
})

export const fetchSBPaymentAccountLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_PAYMENT_ACCOUNT_LOADING
})

export const fetchSBPaymentAccountSuccess = (account: SBAccountType): SimpleBuyActionTypes => ({
  payload: {
    account
  },
  type: AT.FETCH_SB_PAYMENT_ACCOUNT_SUCCESS
})

export const fetchSBPaymentMethods = (currency?: FiatType) => ({
  currency,
  type: AT.FETCH_SB_PAYMENT_METHODS
})

export const fetchSBPaymentMethodsFailure = (error: string): SimpleBuyActionTypes => ({
  payload: {
    error
  },
  type: AT.FETCH_SB_PAYMENT_METHODS_FAILURE
})

export const fetchSBPaymentMethodsLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_PAYMENT_METHODS_LOADING
})

export const fetchSBPaymentMethodsSuccess = (
  methods: SBPaymentMethodsType
): SimpleBuyActionTypes => ({
  payload: {
    methods
  },
  type: AT.FETCH_SB_PAYMENT_METHODS_SUCCESS
})

export const fetchSBQuote = (pair: SBPairsType, orderType: SBOrderActionType, amount: string) => ({
  amount,
  orderType,
  pair,
  type: AT.FETCH_SB_QUOTE
})

export const fetchSBQuoteFailure = (error: string): SimpleBuyActionTypes => ({
  payload: {
    error
  },
  type: AT.FETCH_SB_QUOTE_FAILURE
})

export const fetchSBQuoteLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_QUOTE_LOADING
})

export const fetchSBQuoteSuccess = (quote: SBQuoteType): SimpleBuyActionTypes => ({
  payload: {
    quote
  },
  type: AT.FETCH_SB_QUOTE_SUCCESS
})

export const fetchSellQuote = (pair: SBPairsType, account: SwapAccountType) => ({
  account,
  pair,
  type: AT.FETCH_SELL_QUOTE
})

export const fetchSellQuoteFailure = (error: string): SimpleBuyActionTypes => ({
  payload: {
    error
  },
  type: AT.FETCH_SELL_QUOTE_FAILURE
})

export const fetchSellQuoteLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_SELL_QUOTE_LOADING
})

export const fetchSellQuoteSuccess = (
  quote: SwapQuoteType,
  rate: number
): SimpleBuyActionTypes => ({
  payload: {
    quote,
    rate
  },
  type: AT.FETCH_SELL_QUOTE_SUCCESS
})

export const handleSBDepositFiatClick = (coin: WalletFiatType, origin: ModalOriginType) => ({
  payload: {
    coin,
    origin
  },
  type: AT.HANDLE_SB_DEPOSIT_FIAT_CLICK
})

export const handleSBMaxAmountClick = (amount: string, coin: 'FIAT' | CoinType) => ({
  payload: {
    amount,
    coin
  },
  type: AT.HANDLE_SB_MAX_AMOUNT_CLICK
})

export const handleSBMinAmountClick = (amount: string, coin: 'FIAT' | CoinType) => ({
  payload: {
    amount,
    coin
  },
  type: AT.HANDLE_SB_MIN_AMOUNT_CLICK
})

export const initializeBillingAddress = () => ({
  type: AT.INITIALIZE_BILLING_ADDRESS
})

export const initializeCheckout = (
  pairs: Array<SBPairType>,
  orderType: SBOrderActionType,
  fix: SBFixType,
  pair?: SBPairType,
  amount?: string,
  account?: SwapAccountType,
  cryptoAmount?: string
) => ({
  account,
  amount,
  cryptoAmount,
  fix,
  orderType,
  pair,
  pairs,
  type: AT.INITIALIZE_CHECKOUT
})

export const pollSBBalances = () => ({
  type: AT.POLL_SB_BALANCES
})

export const pollSBCard = (cardId: SBCardType['id']) => ({
  payload: {
    cardId
  },
  type: AT.POLL_SB_CARD
})

export const pollSBOrder = (orderId: string) => ({
  payload: {
    orderId
  },
  type: AT.POLL_SB_ORDER
})

export const setFiatCurrency = (fiatCurrency: FiatType): SimpleBuyActionTypes => ({
  payload: {
    fiatCurrency
  },
  type: AT.SET_FIAT_CURRENCY
})

export const addCardFinished = (): SimpleBuyActionTypes => ({
  type: AT.ADD_CARD_FINISHED
})

export const setStep = (payload: StepActionsPayload): SimpleBuyActionTypes => ({
  payload: getPayloadObjectForStep(payload),
  type: AT.SET_STEP
})

export const showModal = (
  origin: SBShowModalOriginType,
  cryptoCurrency?: CoinType,
  orderType?: SBOrderActionType
) => ({
  payload: {
    cryptoCurrency,
    orderType,
    origin
  },
  type: AT.SHOW_MODAL
})

export const switchFix = (amount: string, orderType: SBOrderActionType, fix: SBFixType) => ({
  payload: {
    amount,
    fix,
    orderType
  },
  type: AT.SWITCH_FIX
})

// used for sell only now, eventually buy as well
// TODO: use swap2 quote for buy AND sell
export const startPollSellQuote = (pair: SBPairsType, account: SwapAccountType) => ({
  account,
  pair,
  type: AT.START_POLL_SELL_QUOTE
})

export const stopPollSellQuote = () => ({
  type: AT.STOP_POLL_SELL_QUOTE
})

export const updatePaymentFailure = (error: string): SimpleBuyActionTypes => ({
  payload: {
    error
  },
  type: AT.UPDATE_PAYMENT_FAILURE
})

export const fetchLimits = (
  currency: FiatType,
  cryptoCurrency?: CoinType,
  side?: SBOrderActionType
) => ({
  cryptoCurrency,
  currency,
  side,
  type: AT.FETCH_LIMITS
})

export const fetchLimitsFailure = (error: string): SimpleBuyActionTypes => ({
  payload: {
    error
  },
  type: AT.FETCH_LIMITS_FAILURE
})
export const updatePaymentLoading = (): SimpleBuyActionTypes => ({
  type: AT.UPDATE_PAYMENT_LOADING
})
export const updatePaymentSuccess = (payment: PaymentValue | undefined): SimpleBuyActionTypes => ({
  payload: {
    payment
  },
  type: AT.UPDATE_PAYMENT_SUCCESS
})
export const fetchLimitsLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_LIMITS_LOADING
})

export const fetchLimitsSuccess = (limits: SwapUserLimitsType): SimpleBuyActionTypes => ({
  payload: {
    limits
  },
  type: AT.FETCH_LIMITS_SUCCESS
})
export const updateSddTransactionFinished = () => ({
  type: AT.UPDATE_SDD_TRANSACTION_FINISHED
})
export const setBuyCrypto = (origin: string) => ({
  payload: {
    props: { origin }
  },
  type: AT.SET_BUY_CRYPTO
})
export const setSellCrypto = (origin: string) => ({
  payload: {
    props: { origin }
  },
  type: AT.SET_SELL_CRYPTO
})
