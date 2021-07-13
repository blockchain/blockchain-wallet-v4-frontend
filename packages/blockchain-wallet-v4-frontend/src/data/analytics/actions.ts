import * as AT from './actionTypes'
import { ABTestCmdType, ABTestNameType } from './types'

export const createABTest = (test: ABTestNameType) => ({
  payload: { test },
  type: AT.CREATE_AB_TEST
})

export const createABTestSuccess = (test: ABTestNameType, result: ABTestCmdType) => ({
  payload: { result, test },
  type: AT.CREATE_AB_TEST_SUCCESS
})

export const logEvent = (event) => ({
  payload: { event },
  type: AT.LOG_EVENT
})

export const logPageView = (route) => ({
  payload: { route },
  type: AT.LOG_PAGE_VIEW
})

export const logGoal = (data) => ({
  payload: { data },
  type: AT.LOG_GOAL
})

export const initUserSession = () => ({
  type: AT.INIT_USER_SESSION
})

export const startSession = (guid) => ({
  payload: { guid },
  type: AT.START_SESSION
})

export const stopSession = () => ({
  type: AT.STOP_SESSION
})
