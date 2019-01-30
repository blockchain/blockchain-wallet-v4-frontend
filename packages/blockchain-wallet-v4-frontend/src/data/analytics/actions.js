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

export const startSession = guid => ({
  type: AT.START_SESSION,
  payload: { guid }
})

export const stopSession = data => ({
  type: AT.STOP_SESSION,
  payload: { data }
})
