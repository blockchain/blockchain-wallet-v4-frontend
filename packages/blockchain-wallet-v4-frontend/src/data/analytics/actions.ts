import * as AT from './actionTypes'
import { ABTestCmdType, ABTestNameType } from './types'

export const createABTest = (test: ABTestNameType) => ({
  type: AT.CREATE_AB_TEST,
  payload: { test }
})

export const createABTestSuccess = (
  test: ABTestNameType,
  result: ABTestCmdType
) => ({
  type: AT.CREATE_AB_TEST_SUCCESS,
  payload: { test, result }
})

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

export const initUserSession = () => ({
  type: AT.INIT_USER_SESSION
})

export const startSession = guid => ({
  type: AT.START_SESSION,
  payload: { guid }
})

export const stopSession = data => ({
  type: AT.STOP_SESSION,
  payload: { data }
})
