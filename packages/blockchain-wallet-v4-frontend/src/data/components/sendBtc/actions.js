import * as AT from './actionTypes'

export const sendBtcInitialized = feeType => ({ type: AT.SEND_BTC_INITIALIZED, payload: feeType })

export const sendBtcDestroyed = () => ({ type: AT.SEND_BTC_DESTROYED })

export const sendBtcPaymentUpdated = payment => ({ type: AT.SEND_BTC_PAYMENT_UPDATED, payload: payment })

export const sendBtcFirstStepInitialized = () => ({ type: AT.SEND_BTC_FIRST_STEP_INITIALIZED })

export const sendBtcFirstStepToToggled = (val) => ({ type: AT.SEND_BTC_FIRST_STEP_TO_TOGGLED, payload: val })

export const sendBtcFirstStepFeePerByteToggled = () => ({ type: AT.SEND_BTC_FIRST_STEP_FEEPERBYTE_TOGGLED })

export const sendBtcFirstStepMinimumAmountClicked = () => ({ type: AT.SEND_BTC_FIRST_STEP_MINIMUM_AMOUNT_CLICKED })

export const sendBtcFirstStepMaximumAmountClicked = () => ({ type: AT.SEND_BTC_FIRST_STEP_MAXIMUM_AMOUNT_CLICKED })

export const sendBtcFirstStepMinimumFeeClicked = () => ({ type: AT.SEND_BTC_FIRST_STEP_MINIMUM_FEE_CLICKED })

export const sendBtcFirstStepMaximumFeeClicked = () => ({ type: AT.SEND_BTC_FIRST_STEP_MAXIMUM_FEE_CLICKED })

export const sendBtcFirstStepRegularFeeClicked = () => ({ type: AT.SEND_BTC_FIRST_STEP_REGULAR_FEE_CLICKED })

export const sendBtcFirstStepPriorityFeeClicked = () => ({ type: AT.SEND_BTC_FIRST_STEP_PRIORITY_FEE_CLICKED })

export const sendBtcFirstStepSubmitClicked = () => ({ type: AT.SEND_BTC_FIRST_STEP_SUBMIT_CLICKED })

export const sendBtcSecondStepInitialized = () => ({ type: AT.SEND_BTC_SECOND_STEP_INITIALIZED })

export const sendBtcSecondStepSubmitClicked = () => ({ type: AT.SEND_BTC_SECOND_STEP_SUBMIT_CLICKED })

export const sendBtcSecondStepCancelClicked = () => ({ type: AT.SEND_BTC_SECOND_STEP_CANCEL_CLICKED })
