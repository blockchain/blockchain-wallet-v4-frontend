import * as AT from './actionTypes'

export const reportBalanceStats = () => ({
  type: AT.REPORT_BALANCE_STATS
})
export const logLockboxSetup = step => ({
  type: AT.LOG_LOCKBOX_SETUP,
  payload: { step }
})
export const logClick = name => ({
  type: AT.LOG_CLICK,
  payload: { name }
})
export const logSfoxDropoff = step => ({
  type: AT.LOG_SFOX_DROPOFF,
  payload: { step }
})
export const logKycEvent = event => ({
  type: AT.LOG_KYC_EVENT,
  payload: { event }
})
export const logExchangeEvent = event => ({
  type: AT.LOG_EXCHANGE_EVENT,
  payload: { event }
})

export const logEvent = (trackingData) => ({
  type: AT.LOG_EVENT,
  payload: { trackingData }
})

export const setSwapStartTime = (payload) => ({
  type: AT.SET_SWAP_START_TIME,
  payload
})
