import * as AT from './actionTypes'

import { CoinType, SwapQuoteType } from 'core/types'
import { ModalOriginType } from 'data/modals/types'
import { SwapAccountType } from '../exchange/types'
import { SwapActionTypes, SwapSideType, SwapStepPayload } from './types'

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
