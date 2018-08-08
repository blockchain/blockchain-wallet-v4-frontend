import * as AT from './actionTypes'

export const subscribeToRates = pairs => ({
  type: AT.SUBSCRIBE_TO_RATES,
  payload: { pairs }
})
export const unsubscribeFromRates = pairs => ({
  type: AT.UNSUBSCRIBE_FROM_RATES,
  payload: { pairs }
})

export const increasePairRefCount = pair => ({
  type: AT.INCREASE_REF_COUNT,
  payload: { pair }
})
export const decreasePairRefCount = pair => ({
  type: AT.DECREASE_REF_COUNT,
  payload: { pair }
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
