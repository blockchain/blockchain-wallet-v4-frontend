import * as AT from './actionTypes'

export const sendBtcInitialized = () => ({ type: AT.SEND_BTC_INITIALIZED })

export const sendBtcDestroyed = () => ({ type: AT.SEND_BTC_DESTROYED })

export const sendBtcPaymentUpdated = payment => ({ type: AT.SEND_BTC_PAYMENT_UPDATED, payload: payment })

export const sendBtcFirstStepInitialized = () => ({ type: AT.SEND_BTC_FIRST_STEP_INITIALIZED })

export const sendBtcFirstStepToToggled = () => ({ type: AT.SEND_BTC_FIRST_STEP_TO_TOGGLED })

export const sendBtcFirstStepFeePerByteToggled = () => ({ type: AT.SEND_BTC_FIRST_STEP_FEEPERBYTE_TOGGLED })

export const sendBtcFirstStepSubmitClicked = () => ({ type: AT.SEND_BTC_FIRST_STEP_SUBMIT_CLICKED })

export const sendBtcSecondStepInitialized = () => ({ type: AT.SEND_BTC_SECOND_STEP_INITIALIZED })

export const sendBtcSecondStepSubmitClicked = () => ({ type: AT.SEND_BTC_SECOND_STEP_SUBMIT_CLICKED })

export const sendBtcSecondStepCancelClicked = () => ({ type: AT.SEND_BTC_SECOND_STEP_CANCEL_CLICKED })
