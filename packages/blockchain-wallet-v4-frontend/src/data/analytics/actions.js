import * as AT from './actionTypes'

export const reportBalanceStats = () => ({
  type: AT.REPORT_BALANCE_STATS
})

export const logEvent = trackingData => ({
  type: AT.LOG_EVENT,
  payload: { trackingData }
})
