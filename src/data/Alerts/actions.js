export const ALERTS_CLEAR = 'ALERTS_CLEAR'
export const ALERTS_DISMISS = 'ALERTS_DISMISS'
export const ALERTS_SHOW = 'ALERTS_SHOW'

const DISMISS_AFTER = 7000

let rand = () => Math.random().toString(36).slice(2)

export const clearAlerts = () => ({
  type: ALERTS_CLEAR
})

export const dismissAlert = (id) => ({
  type: ALERTS_DISMISS, payload: { id }
})

export const display = (type, message, time = DISMISS_AFTER) => ({
  type: ALERTS_SHOW, payload: { type, message, time, id: rand() }
})

export const displayError = display.bind(null, 'danger')
export const displaySuccess = display.bind(null, 'success')
export const displayInfo = display.bind(null, 'info')
