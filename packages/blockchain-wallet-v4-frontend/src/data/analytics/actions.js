import * as AT from './actionTypes'

export const logEvent = data => ({
  type: AT.LOG_EVENT,
  payload: { data }
})

export const logPageView = data => ({
  type: AT.LOG_PAGE_VIEW,
  payload: { data }
})

export const logSiteSearch = data => ({
  type: AT.LOG_SITE_SEARCH,
  payload: { data }
})

export const resetSession = data => ({
  type: AT.RESET_SESSION,
  payload: { data }
})

export const setSession = data => ({
  type: AT.SET_SESSION,
  payload: { data }
})
