import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from 'blockchain-wallet-v4/src'

import * as AT from './actionTypes'
import { AnalyticsStateType, CreateABTestActionType, CreateABTestSuccessActionType } from './types'

const initialState: AnalyticsStateType = {
  ab_tests: {}
}

const analyticsSlice = createSlice({
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

const logEvent = (event) => ({
  payload: { event },
  type: AT.LOG_EVENT
})

const logPageView = (route) => ({
  payload: { route },
  type: AT.LOG_PAGE_VIEW
})

const logGoal = (data) => ({
  payload: { data },
  type: AT.LOG_GOAL
})

const initUserSession = () => ({
  type: AT.INIT_USER_SESSION
})

const startSession = (guid) => ({
  payload: { guid },
  type: AT.START_SESSION
})

const stopSession = () => ({
  type: AT.STOP_SESSION
})

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

export const analyticsReducer = analyticsSlice.reducer
