import * as AT from './actionTypes'

export const initialized = () => ({ type: AT.TRANSACTION_REPORT_INITIALIZED })

export const destroyed = () => ({ type: AT.TRANSACTION_REPORT_DESTROYED })

export const submitClicked = (coin) => ({ type: AT.TRANSACTION_REPORT_SUBMIT_CLICKED, payload: { coin } })
