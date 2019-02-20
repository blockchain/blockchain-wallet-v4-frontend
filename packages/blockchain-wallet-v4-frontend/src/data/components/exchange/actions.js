import * as AT from './actionTypes'

export const setStep = step => ({
  type: AT.SET_STEP,
  payload: { step }
})
export const initialize = requestedValues => ({
  type: AT.INITIALIZE,
  payload: { requestedValues }
})
export const changeSource = source => ({
  type: AT.CHANGE_SOURCE,
  payload: { source }
})
export const changeTarget = target => ({
  type: AT.CHANGE_TARGET,
  payload: { target }
})
export const changeAmount = amount => ({
  type: AT.CHANGE_AMOUNT,
  payload: { amount }
})
export const changeFix = fix => ({
  type: AT.CHANGE_FIX,
  payload: { fix }
})
export const confirmExchange = () => ({
  type: AT.CONFIRM_EXCHANGE
})
export const clearSubscriptions = () => ({
  type: AT.CLEAR_SUBSCRIPTIONS
})
export const swapBaseAndCounter = () => ({
  type: AT.SWAP_BASE_AND_COUNTER
})
export const updateLimits = () => ({
  type: AT.UPDATE_LIMITS
})
export const fetchLimitsLoading = () => ({
  type: AT.FETCH_LIMITS_LOADING
})
export const fetchLimitsSuccess = limits => ({
  type: AT.FETCH_LIMITS_SUCCESS,
  payload: { limits }
})
export const fetchLimitsError = error => ({
  type: AT.FETCH_LIMITS_ERROR,
  payload: { error }
})
export const setMinMax = (min, max) => ({
  type: AT.SET_MIN_MAX,
  payload: { min, max }
})
export const useMin = () => ({
  type: AT.USE_MIN
})
export const useMax = () => ({
  type: AT.USE_MAX
})
export const fetchTargetFees = () => ({
  type: AT.FETCH_TARGET_FEES
})
export const fetchTargetFeesLoading = () => ({
  type: AT.FETCH_TARGET_FEES_LOADING
})
export const fetchTargetFeesSuccess = fee => ({
  type: AT.FETCH_TARGET_FEES_SUCCESS,
  payload: { fee }
})
export const fetchTargetFeesError = error => ({
  type: AT.FETCH_TARGET_FEES_ERROR,
  payload: { error }
})
export const setSourceFee = fee => ({
  type: AT.SET_SOURCE_FEE,
  payload: { fee }
})
export const setShowError = showError => ({
  type: AT.SET_SHOW_ERROR,
  payload: { showError }
})
export const recheckLatestTx = () => ({
  type: AT.RECHECK_LATEST_TX
})
export const setTxError = error => ({
  type: AT.SET_TX_ERROR,
  payload: { error }
})
export const showConfirmation = () => ({
  type: AT.SHOW_CONFIRMATION
})
