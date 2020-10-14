import * as AT from './actionTypes'

import { CoinType, SwapQuoteType } from 'core/types'
import { ModalOriginType } from 'data/modals/types'
import { SwapAccountType } from '../exchange/types'
import { SwapSideType, SwapStepPayload } from './types'

export const changePair = (side: SwapSideType, account: SwapAccountType) => ({
  type: AT.CHANGE_PAIR,
  payload: {
    side,
    account
  }
})

export const fetchQuote = () => ({
  type: AT.FETCH_QUOTE
})
export const fetchQuoteFailure = (error: string) => ({
  type: AT.FETCH_QUOTE_LOADING,
  payload: {
    error
  }
})
export const fetchQuoteLoading = () => ({
  type: AT.FETCH_QUOTE_LOADING
})
export const fetchQuoteSuccess = (quote: SwapQuoteType) => ({
  type: AT.FETCH_QUOTE_SUCCESS,
  payload: {
    quote
  }
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
