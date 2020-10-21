import * as AT from './actionTypes'

import {
  CoinType,
  PaymentValue,
  SwapQuoteType,
  SwapUserLimitsType
} from 'core/types'
import { ModalOriginType } from 'data/modals/types'
import {
  SwapAccountType,
  SwapActionTypes,
  SwapSideType,
  SwapStepPayload
} from './types'

export const changePair = (side: SwapSideType, account: SwapAccountType) => ({
  type: AT.CHANGE_PAIR,
  payload: {
    side,
    account
  }
})

export const createOrder = () => ({
  type: AT.CREATE_ORDER
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

export const initAmountForm = () => ({
  type: AT.INIT_AMOUNT_FORM
})

export const setStep = ({ step, options }: SwapStepPayload) => ({
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
  payment: PaymentValue | { coin: CoinType; effectiveBalance: number }
): SwapActionTypes => ({
  type: AT.UPDATE_PAYMENT_SUCCESS,
  payload: {
    payment
  }
})
