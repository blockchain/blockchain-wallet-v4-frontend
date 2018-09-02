import * as AT from './actionTypes'

export const subscribeToRates = pairs => ({
  type: AT.SUBSCRIBE_TO_RATES,
  payload: { pairs }
})
export const unsubscribeFromRates = pairs => ({
  type: AT.UNSUBSCRIBE_FROM_RATES,
  payload: { pairs }
})
export const updateRates = (pairs, rates) => ({
  type: AT.UPDATE_RATES,
  payload: { pairs, rates }
})

export const subscribeToAdvice = (pair, volume, fix, fiatCurrency) => ({
  type: AT.SUBSCRIBE_TO_ADVICE,
  payload: { pair, volume, fix, fiatCurrency }
})
export const unsubscribeFromAdvice = pair => ({
  type: AT.UNSUBSCRIBE_FROM_ADVICE,
  payload: { pair }
})
export const updateAdvice = (pair, fix, volume, fiatCurrency, advice) => ({
  type: AT.UPDATE_ADVICE,
  payload: { pair, fix, volume, fiatCurrency, advice }
})

export const updatePairConfig = (pair, volume, fix, fiatCurrency) => ({
  type: AT.UPDATE_PAIR_CONFIG,
  payload: { pair, config: { volume, fix, fiatCurrency } }
})
export const setPairAdvice = (pair, advice) => ({
  type: AT.SET_PAIR_ADVICE,
  payload: { pair, advice }
})

export const fetchAvailablePairs = () => ({
  type: AT.FETCH_AVAILABLE_PAIRS
})
export const availablePairsLoading = () => ({
  type: AT.AVAILABLE_PAIRS_LOADING
})
export const availablePairsSuccess = pairs => ({
  type: AT.AVAILABLE_PAIRS_SUCCESS,
  payload: { pairs }
})
export const availablePairsError = error => ({
  type: AT.AVAILABLE_PAIRS_ERROR,
  payload: { error }
})
