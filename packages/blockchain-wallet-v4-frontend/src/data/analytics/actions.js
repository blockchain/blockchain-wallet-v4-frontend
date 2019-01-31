import * as AT from './actionTypes'

export const logEvent = event => ({
  type: AT.LOG_EVENT,
  payload: { event }
})

export const logPageView = route => ({
  type: AT.LOG_PAGE_VIEW,
  payload: { route }
})

export const logGoal = data => ({
  type: AT.LOG_GOAL,
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
