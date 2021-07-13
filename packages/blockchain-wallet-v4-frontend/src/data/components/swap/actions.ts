import {
  CoinType,
  PaymentValue,
  SwapOrderType,
  SwapQuoteType,
  SwapUserLimitsType
} from 'blockchain-wallet-v4/src/types'
import { ModalOriginType } from 'data/modals/types'

import * as AT from './actionTypes'
import { SwapAccountType, SwapActionTypes, SwapCheckoutFixType, SwapStepPayload } from './types'

export const cancelOrder = (id: string) => ({
  payload: {
    id
  },
  type: AT.CANCEL_ORDER
})

export const changeBase = (account: SwapAccountType) => ({
  payload: {
    account
  },
  type: AT.CHANGE_BASE
})

export const changeCounter = (account: SwapAccountType) => ({
  payload: {
    account
  },
  type: AT.CHANGE_COUNTER
})

export const changeTrendingPair = (
  baseAccount: SwapAccountType,
  counterAccount: SwapAccountType
) => ({
  payload: {
    baseAccount,
    counterAccount
  },
  type: AT.CHANGE_SWAP_TRENDING_PAIR
})

export const createOrder = () => ({
  type: AT.CREATE_ORDER
})

export const fetchCustodialEligibility = () => ({
  type: AT.FETCH_CUSTODIAL_ELIGIBILITY
})
export const fetchCustodialEligibiliyFailure = (error: string): SwapActionTypes => ({
  payload: {
    error
  },
  type: AT.FETCH_CUSTODIAL_ELIGIBILITY_FAILURE
})
export const fetchCustodialEligibilityLoading = (): SwapActionTypes => ({
  type: AT.FETCH_CUSTODIAL_ELIGIBILITY_LOADING
})

export const fetchCustodialEligibilitySuccess = (eligibility: boolean): SwapActionTypes => ({
  payload: {
    eligibility
  },
  type: AT.FETCH_CUSTODIAL_ELIGIBILITY_SUCCESS
})

export const fetchLimits = () => ({
  type: AT.FETCH_LIMITS
})
export const fetchLimitsFailure = (error: string): SwapActionTypes => ({
  payload: {
    error
  },
  type: AT.FETCH_LIMITS_FAILURE
})
export const fetchLimitsLoading = (): SwapActionTypes => ({
  type: AT.FETCH_LIMITS_LOADING
})
export const fetchLimitsSuccess = (limits: SwapUserLimitsType): SwapActionTypes => ({
  payload: {
    limits
  },
  type: AT.FETCH_LIMITS_SUCCESS
})

export const fetchPairs = () => ({
  type: AT.FETCH_PAIRS
})
export const fetchPairsFailure = (error: string): SwapActionTypes => ({
  payload: {
    error
  },
  type: AT.FETCH_PAIRS_FAILURE
})
export const fetchPairsLoading = (): SwapActionTypes => ({
  type: AT.FETCH_PAIRS_LOADING
})
export const fetchPairsSuccess = (pairs: Array<string>): SwapActionTypes => ({
  payload: {
    pairs
  },
  type: AT.FETCH_PAIRS_SUCCESS
})

export const fetchQuote = () => ({
  type: AT.FETCH_QUOTE
})
export const fetchQuoteFailure = (error: string): SwapActionTypes => ({
  payload: {
    error
  },
  type: AT.FETCH_QUOTE_FAILURE
})
export const fetchQuoteLoading = (): SwapActionTypes => ({
  type: AT.FETCH_QUOTE_LOADING
})
export const fetchQuoteSuccess = (quote: SwapQuoteType, rate: number): SwapActionTypes => ({
  payload: {
    quote,
    rate
  },
  type: AT.FETCH_QUOTE_SUCCESS
})

export const fetchTrades = () => ({
  type: AT.FETCH_TRADES
})
export const fetchTradesFailure = (error: string): SwapActionTypes => ({
  payload: {
    error
  },
  type: AT.FETCH_TRADES_FAILURE
})
export const fetchTradesLoading = (): SwapActionTypes => ({
  type: AT.FETCH_TRADES_LOADING
})
export const fetchTradesSuccess = (trades: Array<SwapOrderType>): SwapActionTypes => ({
  payload: {
    trades
  },
  type: AT.FETCH_TRADES_SUCCESS
})

export const initAmountForm = () => ({
  type: AT.INIT_AMOUNT_FORM
})

export const refreshAccounts = () => ({
  type: AT.REFRESH_ACCOUNTS
})

export const setCheckoutFix = (fix: SwapCheckoutFixType) => ({
  payload: {
    fix
  },
  type: AT.SET_CHECKOUT_FIX
})

export const setStep = ({ options, step }: SwapStepPayload) => ({
  payload: {
    options,
    step
  },
  type: AT.SET_STEP
})

export const handleSwapMaxAmountClick = (amount: string) => ({
  payload: {
    amount
  },
  type: AT.HANDLE_SWAP_MAX_AMOUNT_CLICK
})

export const handleSwapMinAmountClick = (amount: string) => ({
  payload: {
    amount
  },
  type: AT.HANDLE_SWAP_MIN_AMOUNT_CLICK
})

export const showModal = (
  origin: ModalOriginType,
  baseCurrency?: CoinType,
  counterCurrency?: CoinType
) => ({
  payload: {
    baseCurrency,
    counterCurrency,
    origin
  },
  type: AT.SHOW_MODAL
})

export const startPollQuote = () => ({
  type: AT.START_POLL_QUOTE
})

export const stopPollQuote = () => ({
  type: AT.STOP_POLL_QUOTE
})

export const switchFix = (amount: string, fix: SwapCheckoutFixType) => ({
  payload: {
    amount,
    fix
  },
  type: AT.SWITCH_FIX
})

export const toggleBaseAndCounter = () => ({
  type: AT.TOGGLE_BASE_COUNTER
})

export const updatePaymentFailure = (error: string): SwapActionTypes => ({
  payload: {
    error
  },
  type: AT.UPDATE_PAYMENT_FAILURE
})
export const updatePaymentLoading = (): SwapActionTypes => ({
  type: AT.UPDATE_PAYMENT_LOADING
})
export const updatePaymentSuccess = (payment: PaymentValue | undefined): SwapActionTypes => ({
  payload: {
    payment
  },
  type: AT.UPDATE_PAYMENT_SUCCESS
})
