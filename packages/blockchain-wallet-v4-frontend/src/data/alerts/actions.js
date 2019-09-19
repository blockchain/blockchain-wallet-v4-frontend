import { ALERTS_CLEAR, ALERTS_DISMISS, ALERTS_SHOW } from './actionTypes'

const generateId = () =>
  Math.random()
    .toString(36)
    .substr(2, 10)

const display = (nature, message, data, persist, coin, timeout) => ({
  type: ALERTS_SHOW,
  payload: { id: generateId(), nature, message, data, persist, coin, timeout }
})
export const displayWarning = (message, data, persist, timeout) =>
  display('warn', message, data, persist, timeout)

export const displayInfo = (message, data, persist, timeout) =>
  display('info', message, data, persist, timeout)

export const displaySuccess = (message, data, persist, timeout) =>
  display('success', message, data, persist, timeout)

export const displayError = (message, data, persist, coin, timeout) =>
  display('error', message, data, persist, coin, timeout)

export const displayCoin = (message, coin, persist, timeout) =>
  display(null, message, null, persist, timeout, coin)

export const clearAlerts = () => ({ type: ALERTS_CLEAR })

export const dismissAlert = id => ({ type: ALERTS_DISMISS, payload: { id } })
