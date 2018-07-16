import { ALERTS_CLEAR, ALERTS_DISMISS, ALERTS_SHOW } from './actionTypes'

const generateId = () =>
  Math.random()
    .toString(36)
    .substr(2, 10)

const display = (nature, message, data) => ({
  type: ALERTS_SHOW,
  payload: { id: generateId(), nature, message, data }
})

export const displayInfo = (message, data) => display('info', message, data)

export const displaySuccess = (message, data) =>
  display('success', message, data)

export const displayError = (message, data) => display('error', message, data)

export const clearAlerts = () => ({ type: ALERTS_CLEAR })

export const dismissAlert = id => ({ type: ALERTS_DISMISS, payload: { id } })
