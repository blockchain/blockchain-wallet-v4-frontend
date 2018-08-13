import { ALERTS_CLEAR, ALERTS_DISMISS, ALERTS_SHOW } from './actionTypes'

const generateId = () =>
  Math.random()
    .toString(36)
    .substr(2, 10)

const display = (nature, message, data, persist) => ({
  type: ALERTS_SHOW,
  payload: { id: generateId(), nature, message, data, persist }
})

export const displayInfo = (message, data, persist) =>
  display('info', message, data, persist)

export const displaySuccess = (message, data, persist) =>
  display('success', message, data, persist)

export const displayError = (message, data, persist) =>
  display('error', message, data, persist)

export const clearAlerts = () => ({ type: ALERTS_CLEAR })

export const dismissAlert = id => ({ type: ALERTS_DISMISS, payload: { id } })
