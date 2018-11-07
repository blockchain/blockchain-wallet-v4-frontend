import * as AT from './actionTypes'

// ShapeShift Actions
export const initialized = () => ({ type: AT.EXCHANGE_INITIALIZED })
export const destroyed = () => ({ type: AT.EXCHANGE_DESTROYED })
export const paymentUpdated = payment => ({
  type: AT.EXCHANGE_PAYMENT_UPDATED,
  payload: payment
})
export const orderUpdated = order => ({
  type: AT.EXCHANGE_ORDER_UPDATED,
  payload: order
})
export const firstStepInitialized = () => ({
  type: AT.EXCHANGE_FIRST_STEP_INITIALIZED
})
export const firstStepEnabled = () => ({
  type: AT.EXCHANGE_FIRST_STEP_ENABLED
})
export const firstStepDisabled = () => ({
  type: AT.EXCHANGE_FIRST_STEP_DISABLED
})
export const firstStepFormValidated = () => ({
  type: AT.EXCHANGE_FIRST_STEP_FORM_VALIDATED
})
export const firstStepFormUnvalidated = error => ({
  type: AT.EXCHANGE_FIRST_STEP_FORM_UNVALIDATED,
  payload: error
})
export const firstStepSubmitClicked = () => ({
  type: AT.EXCHANGE_FIRST_STEP_SUBMIT_CLICKED
})
export const firstStepSwapClicked = () => ({
  type: AT.EXCHANGE_FIRST_STEP_SWAP_CLICKED
})
export const firstStepMinimumClicked = () => ({
  type: AT.EXCHANGE_FIRST_STEP_MINIMUM_CLICKED
})
export const firstStepMaximumClicked = () => ({
  type: AT.EXCHANGE_FIRST_STEP_MAXIMUM_CLICKED
})
export const secondStepInitialized = () => ({
  type: AT.EXCHANGE_SECOND_STEP_INITIALIZED
})
export const secondStepSuccess = data => ({
  type: AT.EXCHANGE_SECOND_STEP_SUCCESS,
  payload: data
})
export const secondStepFailure = error => ({
  type: AT.EXCHANGE_SECOND_STEP_FAILURE,
  payload: error
})
export const secondStepSubmitClicked = () => ({
  type: AT.EXCHANGE_SECOND_STEP_SUBMIT_CLICKED
})
export const secondStepPaymentSent = payment => ({
  type: AT.EXCHANGE_SECOND_STEP_PAYMENT_SENT,
  payload: payment
})
export const secondStepCancelClicked = () => ({
  type: AT.EXCHANGE_SECOND_STEP_CANCEL_CLICKED
})
export const secondStepOrderExpired = () => ({
  type: AT.EXCHANGE_SECOND_STEP_ORDER_EXPIRED
})
export const secondStepGoBack = () => ({
  type: AT.EXCHANGE_SECOND_STEP_GOBACK
})
export const thirdStepInitialized = () => ({
  type: AT.EXCHANGE_THIRD_STEP_INITIALIZED
})
export const thirdStepTradeStatusChanged = status => ({
  type: AT.EXCHANGE_THIRD_STEP_TRADE_STATUS_CHANGED,
  payload: status
})
export const thirdStepCloseClicked = () => ({
  type: AT.EXCHANGE_THIRD_STEP_CLOSE_CLICKED
})
export const usStateRegistered = () => ({
  type: AT.EXCHANGE_US_STATE_REGISTERED
})

// Exchange Actions
export const setStep = step => ({
  type: AT.SET_STEP,
  payload: { step }
})
export const initialize = (from, to) => ({
  type: AT.INITIALIZE,
  payload: { from, to }
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
