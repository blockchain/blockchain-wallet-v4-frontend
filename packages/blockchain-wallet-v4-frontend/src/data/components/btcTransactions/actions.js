import * as AT from './actionTypes'

export const initialized = () => ({ type: AT.BTC_TRANSACTIONS_INITIALIZED })

export const endlessScrollTriggered = () => ({ type: AT.BTC_TRANSACTIONS_ENDLESS_SCROLL_TRIGGERED })

export const reportClicked = () => ({ type: AT.BTC_TRANSACTIONS_REPORT_CLICKED })
