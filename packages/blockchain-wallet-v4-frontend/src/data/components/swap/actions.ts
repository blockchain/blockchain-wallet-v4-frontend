import {
  CoinType,
  PaymentValue,
  SwapOrderType,
  SwapQuoteType,
  SwapUserLimitsType
} from 'blockchain-wallet-v4/src/types'
import { ModalOriginType } from 'data/modals/types'

import * as AT from './actionTypes'
import {
  SwapAccountType,
  SwapActionTypes,
  SwapCheckoutFixType,
  SwapSideType,
  SwapStepPayload
} from './types'

export const cancelOrder = (id: string) => ({
  type: AT.CANCEL_ORDER,
  payload: {
    id
  }
})

export const changePair = (side: SwapSideType, account: SwapAccountType) => ({
  type: AT.CHANGE_PAIR,
  payload: {
    side,
    account
  }
})

export const changeTrendingPair = (
  baseAccount: SwapAccountType,
  counterAccount: SwapAccountType
) => ({
  type: AT.CHANGE_SWAP_TRENDING_PAIR,
  payload: {
    baseAccount,
    counterAccount
  }
})

export const createOrder = () => ({
  type: AT.CREATE_ORDER
})

export const fetchCustodialEligibility = () => ({
  type: AT.FETCH_CUSTODIAL_ELIGIBILITY
})
export const fetchCustodialEligibiliyFailure = (
  error: string
): SwapActionTypes => ({
  type: AT.FETCH_CUSTODIAL_ELIGIBILITY_FAILURE,
  payload: {
    error
  }
})
export const fetchCustodialEligibilityLoading = (): SwapActionTypes => ({
  type: AT.FETCH_CUSTODIAL_ELIGIBILITY_LOADING
})

export const fetchCustodialEligibilitySuccess = (
  eligibility: boolean
): SwapActionTypes => ({
  type: AT.FETCH_CUSTODIAL_ELIGIBILITY_SUCCESS,
  payload: {
    eligibility
  }
})

export const fetchLimits = () => ({
  type: AT.FETCH_LIMITS
})
export const fetchLimitsFailure = (error: string): SwapActionTypes => ({
  type: AT.FETCH_LIMITS_FAILURE,
  payload: {
    error
  }
})
export const fetchLimitsLoading = (): SwapActionTypes => ({
  type: AT.FETCH_LIMITS_LOADING
})
export const fetchLimitsSuccess = (
  limits: SwapUserLimitsType
): SwapActionTypes => ({
  type: AT.FETCH_LIMITS_SUCCESS,
  payload: {
    limits
  }
})

export const fetchPairs = () => ({
  type: AT.FETCH_PAIRS
})
export const fetchPairsFailure = (error: string): SwapActionTypes => ({
  type: AT.FETCH_PAIRS_FAILURE,
  payload: {
    error
  }
})
export const fetchPairsLoading = (): SwapActionTypes => ({
  type: AT.FETCH_PAIRS_LOADING
})
export const fetchPairsSuccess = (pairs: Array<string>): SwapActionTypes => ({
  type: AT.FETCH_PAIRS_SUCCESS,
  payload: {
    pairs
  }
})

export const fetchQuote = () => ({
  type: AT.FETCH_QUOTE
})
export const fetchQuoteFailure = (error: string): SwapActionTypes => ({
  type: AT.FETCH_QUOTE_FAILURE,
  payload: {
    error
  }
})
export const fetchQuoteLoading = (): SwapActionTypes => ({
  type: AT.FETCH_QUOTE_LOADING
})
export const fetchQuoteSuccess = (
  quote: SwapQuoteType,
  rate: number
): SwapActionTypes => ({
  type: AT.FETCH_QUOTE_SUCCESS,
  payload: {
    quote,
    rate
  }
})

export const fetchTrades = () => ({
  type: AT.FETCH_TRADES
})
export const fetchTradesFailure = (error: string): SwapActionTypes => ({
  type: AT.FETCH_TRADES_FAILURE,
  payload: {
    error
  }
})
export const fetchTradesLoading = (): SwapActionTypes => ({
  type: AT.FETCH_TRADES_LOADING
})
export const fetchTradesSuccess = (
  trades: Array<SwapOrderType>
): SwapActionTypes => ({
  type: AT.FETCH_TRADES_SUCCESS,
  payload: {
    trades
  }
})

export const initAmountForm = () => ({
  type: AT.INIT_AMOUNT_FORM
})

export const refreshAccounts = () => ({
  type: AT.REFRESH_ACCOUNTS
})

export const setCheckoutFix = (fix: SwapCheckoutFixType) => ({
  type: AT.SET_CHECKOUT_FIX,
  payload: {
    fix
  }
})

export const setStep = ({ options, step }: SwapStepPayload) => ({
  type: AT.SET_STEP,
  payload: {
    step,
    options
  }
})

export const showModal = (
  origin: ModalOriginType,
  baseCurrency?: CoinType,
  counterCurrency?: CoinType
) => ({
  type: AT.SHOW_MODAL,
  payload: {
    origin,
    baseCurrency,
    counterCurrency
  }
})

export const startPollQuote = () => ({
  type: AT.START_POLL_QUOTE
})

export const stopPollQuote = () => ({
  type: AT.STOP_POLL_QUOTE
})

export const switchFix = (amount: string, fix: SwapCheckoutFixType) => ({
  type: AT.SWITCH_FIX,
  payload: {
    amount,
    fix
  }
})

export const toggleBaseAndCounter = () => ({
  type: AT.TOGGLE_BASE_COUNTER
})

export const updatePaymentFailure = (error: string): SwapActionTypes => ({
  type: AT.UPDATE_PAYMENT_FAILURE,
  payload: {
    error
  }
})
export const updatePaymentLoading = (): SwapActionTypes => ({
  type: AT.UPDATE_PAYMENT_LOADING
})
export const updatePaymentSuccess = (
  payment: PaymentValue | undefined
): SwapActionTypes => ({
  type: AT.UPDATE_PAYMENT_SUCCESS,
  payload: {
    payment
  }
})
