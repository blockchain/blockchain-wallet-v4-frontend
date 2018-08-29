import * as AT from './actionTypes'

export const subscribeToRate = (pair, volume, fix, fiatCurrency) => ({
  type: AT.SUBSCRIBE_TO_RATE,
  payload: { pair, volume, fix, fiatCurrency }
})
export const unsubscribeFromRate = pair => ({
  type: AT.UNSUBSCRIBE_FROM_RATE,
  payload: { pair }
})

export const updatePairConfig = (pair, volume, fix, fiatCurrency) => ({
  type: AT.UPDATE_PAIR_CONFIG,
  payload: { pair, config: { volume, fix, fiatCurrency } }
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
