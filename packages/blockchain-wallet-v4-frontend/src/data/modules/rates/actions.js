import * as AT from './actionTypes'

export const subscribeToAdvice = (pair, volume, fix, fiatCurrency) => ({
  payload: { fiatCurrency, fix, pair, volume },
  type: AT.SUBSCRIBE_TO_ADVICE
})
export const unsubscribeFromAdvice = (pair) => ({
  payload: { pair },
  type: AT.UNSUBSCRIBE_FROM_ADVICE
})
export const updateAdvice = (quote) => ({
  payload: { quote },
  type: AT.UPDATE_ADVICE
})

export const updatePairConfig = (pair, volume, fix, fiatCurrency) => ({
  payload: { config: { fiatCurrency, fix, volume }, pair },
  type: AT.UPDATE_PAIR_CONFIG
})
export const setPairQuote = (pair, quote) => ({
  payload: { pair, quote },
  type: AT.SET_PAIR_QUOTE
})
export const pairUpdated = (pair) => ({
  payload: { pair },
  type: AT.PAIR_UPDATED
})

export const fetchAvailablePairs = () => ({
  type: AT.FETCH_AVAILABLE_PAIRS
})
export const availablePairsLoading = () => ({
  type: AT.AVAILABLE_PAIRS_LOADING
})
export const availablePairsSuccess = (pairs) => ({
  payload: { pairs },
  type: AT.AVAILABLE_PAIRS_SUCCESS
})
export const availablePairsError = (error) => ({
  payload: { error },
  type: AT.AVAILABLE_PAIRS_ERROR
})

export const subscribeToRates = (pairs) => ({
  payload: { pairs },
  type: AT.SUBSCRIBE_TO_RATES
})
export const unsubscribeFromRates = () => ({
  type: AT.UNSUBSCRIBE_FROM_RATES
})

export const updateBestRates = (rates) => ({
  payload: { rates },
  type: AT.UPDATE_BEST_RATES
})

export const removeAdvice = (pair) => ({
  payload: { pair },
  type: AT.REMOVE_ADVICE
})
