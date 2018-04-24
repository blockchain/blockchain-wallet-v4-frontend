
import * as AT from './actionTypes'

export const initialized = () => ({ type: AT.EXCHANGE_INITIALIZED })

export const destroyed = () => ({ type: AT.EXCHANGE_DESTROYED })

export const paymentUpdated = payment => ({ type: AT.EXCHANGE_PAYMENT_UPDATED, payload: payment })

export const accountsUpdated = accounts => ({ type: AT.EXCHANGE_ACCOUNTS_UPDATED, payload: accounts })

export const limitsUpdated = (minimum, maximum) => ({ type: AT.EXCHANGE_LIMITS_UPDATED, payload: { minimum, maximum } })

export const firstStepInitialized = () => ({ type: AT.EXCHANGE_FIRST_STEP_INITIALIZED })

export const firstStepEnabled = () => ({ type: AT.EXCHANGE_FIRST_STEP_ENABLED })

export const firstStepDisabled = () => ({ type: AT.EXCHANGE_FIRST_STEP_DISABLED })

export const firstStepFormValidated = () => ({ type: AT.EXCHANGE_FIRST_STEP_FORM_VALIDATED })

export const firstStepFormUnvalidated = (error) => ({ type: AT.EXCHANGE_FIRST_STEP_FORM_UNVALIDATED, payload: error })

export const firstStepSubmitClicked = () => ({ type: AT.EXCHANGE_FIRST_STEP_SUBMIT_CLICKED })

export const firstStepSwapClicked = () => ({ type: AT.EXCHANGE_FIRST_STEP_SWAP_CLICKED })

export const firstStepMinimumClicked = () => ({ type: AT.EXCHANGE_FIRST_STEP_MINIMUM_CLICKED })

export const firstStepMaximumClicked = () => ({ type: AT.EXCHANGE_FIRST_STEP_MAXIMUM_CLICKED })

export const secondStepInitialized = (depositFee, depositTotal) => ({ type: AT.EXCHANGE_SECOND_STEP_INITIALIZED, payload: { depositFee, depositTotal } })

export const secondStepSuccess = (data) => ({ type: AT.EXCHANGE_SECOND_STEP_SUCCESS, payload: data })

export const secondStepFailure = (error) => ({ type: AT.EXCHANGE_SECOND_STEP_FAILURE, payload: error })

export const secondStepSubmitClicked = () => ({ type: AT.EXCHANGE_SECOND_STEP_SUBMIT_CLICKED })

export const secondStepCancelClicked = () => ({ type: AT.EXCHANGE_SECOND_STEP_CANCEL_CLICKED })

export const secondStepOrderExpired = () => ({ type: AT.EXCHANGE_SECOND_STEP_ORDER_EXPIRED })

export const thirdStepInitialized = () => ({ type: AT.EXCHANGE_THIRD_STEP_INITIALIZED })

export const thirdStepCloseClicked = () => ({ type: AT.EXCHANGE_THIRD_STEP_CLOSE_CLICKED })
