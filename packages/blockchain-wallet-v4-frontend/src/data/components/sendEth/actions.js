import * as AT from './actionTypes'

export const sendEthInitialized = () => ({ type: AT.SEND_ETH_INITIALIZED })

export const sendEthDestroyed = () => ({ type: AT.SEND_ETH_DESTROYED })

export const sendEthPaymentUpdated = payment => ({ type: AT.SEND_ETH_PAYMENT_UPDATED, payload: payment })

export const sendEthFirstStepInitialized = () => ({ type: AT.SEND_ETH_FIRST_STEP_INITIALIZED })

export const sendEthFirstStepSubmitClicked = () => ({ type: AT.SEND_ETH_FIRST_STEP_SUBMIT_CLICKED })

export const sendEthSecondStepInitialized = () => ({ type: AT.SEND_ETH_SECOND_STEP_INITIALIZED })

export const sendEthSecondStepSubmitClicked = () => ({ type: AT.SEND_ETH_SECOND_STEP_SUBMIT_CLICKED })

export const sendEthSecondStepCancelClicked = () => ({ type: AT.SEND_ETH_SECOND_STEP_CANCEL_CLICKED })
