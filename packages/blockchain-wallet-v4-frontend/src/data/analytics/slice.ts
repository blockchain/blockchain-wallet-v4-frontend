import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from 'blockchain-wallet-v4/src'

import { AnalyticsStateType, CreateABTestActionType, CreateABTestSuccessActionType } from './types'

const initialState: AnalyticsStateType = {
  ab_tests: {}
}

const analyticsSlice = createSlice({
  extraReducers: (builder) => {
    // Handle other actions that don't change redux state but relevant to this Slice
    builder.addDefaultCase((state) => state)
  },
  initialState,
  name: 'analytics',
  reducers: {
    createABTest: (state, action: PayloadAction<CreateABTestActionType['payload']>) => ({
      ...state,
      ab_tests: {
        ...state.ab_tests,
        [action.payload.test]: Remote.Loading
      }
    }),
    createABTestSuccess: (
      state,
      action: PayloadAction<CreateABTestSuccessActionType['payload']>
    ) => ({
      ...state,
      ab_tests: {
        ...state.ab_tests,
        [action.payload.test]: Remote.Success(action.payload.result)
      }
    })
  }
})

export const logEvent = createAction('analytics/logEvent', function prepare(event) {
  return {
    payload: { event }
  }
})

export const logPageView = createAction('analytics/logPageView', function prepare(route) {
  return {
    payload: { route }
  }
})

export const logGoal = createAction('analytics/logGoal', function prepare(data) {
  return {
    payload: { data }
  }
})

export const initUserSession = createAction('analytics/initUserSession')

export const startSession = createAction('analytics/startSession', function prepare(guid) {
  return {
    payload: { guid }
  }
})

export const stopSession = createAction('analytics/stopSession')

export const actions = {
  ...analyticsSlice.actions,
  initUserSession,
  logEvent,
  logGoal,
  logPageView,
  startSession,
  stopSession
}

export const { createABTest, createABTestSuccess } = actions

const createABTestType = createABTest.type
const createABTestSuccessType = createABTestSuccess.type
const initUserSessionType = initUserSession.type
const logEventType = logEvent.type
const logGoalType = logGoal.type
const logPageViewType = logPageView.type
const startSessionType = startSession.type
const stopSessionType = stopSession.type

export const actionTypes = {
  createABTest: createABTestType,
  createABTestSuccess: createABTestSuccessType,
  initUserSession: initUserSessionType,
  logEvent: logEventType,
  logGoal: logGoalType,
  logPageView: logPageViewType,
  startSession: startSessionType,
  stopSession: stopSessionType
}

export const analyticsReducer = analyticsSlice.reducer
