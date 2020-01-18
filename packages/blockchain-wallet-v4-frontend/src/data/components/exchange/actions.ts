import * as AT from './actionTypes'
import { ExchangeActionTypes } from './types'

// @PHIL Don't see this action being used anywhere. There is a set step reducer, but I don't see it anything called
// step in the state
// export const setStep = (step): ExchangeActionTypes => ({
//   type: AT.SET_STEP,
//   payload: { step }
// })
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
export const fetchLimitsLoading = (): ExchangeActionTypes => ({
  type: AT.FETCH_LIMITS_LOADING
})
export const fetchLimitsSuccess = (limits): ExchangeActionTypes => ({
  type: AT.FETCH_LIMITS_SUCCESS,
  payload: { limits }
})
export const fetchLimitsError = (error): ExchangeActionTypes => ({
  type: AT.FETCH_LIMITS_ERROR,
  payload: { error }
})
export const setMinMax = (min, max): ExchangeActionTypes => ({
  type: AT.SET_MIN_MAX,
  payload: { min, max }
})
export const useMin = () => ({
  type: AT.USE_MIN
})
export const useMax = () => ({
  type: AT.USE_MAX
})
export const setSourceFee = fee => ({
  type: AT.SET_SOURCE_FEE,
  payload: { fee }
})
export const setShowError = (showError): ExchangeActionTypes => ({
  type: AT.SET_SHOW_ERROR,
  payload: { showError }
})
export const recheckLatestTx = () => ({
  type: AT.RECHECK_LATEST_TX
})
export const setTxError = (error): ExchangeActionTypes => ({
  type: AT.SET_TX_ERROR,
  payload: { error }
})
export const showConfirmation = (): ExchangeActionTypes => ({
  type: AT.SHOW_CONFIRMATION
})
