import * as AT from './actionTypes'

export const initialized = () => ({ type: AT.EXCHANGE_INITIALIZED })

export const swapClicked = () => ({ type: AT.EXCHANGE_SWAP_CLICKED })

export const submitClicked = (step) => ({ type: AT.EXCHANGE_SUBMIT_CLICKED, payload: { step } })

export const minimumClicked = () => ({ type: AT.EXCHANGE_MINIMUM_CLICKED })

export const maximumClicked = () => ({ type: AT.EXCHANGE_MAXIMUM_CLICKED })

export const statusLoading = () => ({ type: AT.EXCHANGE_STATUS_LOADING })

export const statusLoaded = () => ({ type: AT.EXCHANGE_STATUS_LOADED })

export const error = (message, data = '') => ({ type: AT.EXCHANGE_ERROR, payload: { message, data } })
