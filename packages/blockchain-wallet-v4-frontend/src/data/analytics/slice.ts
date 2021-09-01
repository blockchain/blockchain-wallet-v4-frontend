import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from 'blockchain-wallet-v4/src'

import { AnalyticsStateType, CreateABTestActionType, CreateABTestSuccessActionType } from './types'

const initialState: AnalyticsStateType = {
  ab_tests: {}
}

const analyticsSlice = createSlice({
  initialState,
  name: 'analytics',
  reducers: {
    createABTest: (state, action: PayloadAction<CreateABTestActionType['payload']>) => {
      state.ab_tests[action.payload.test] = Remote.Loading
    },
    createABTestSuccess: (
      state,
      action: PayloadAction<CreateABTestSuccessActionType['payload']>
    ) => {
      state.ab_tests[action.payload.test] = Remote.Success(action.payload.result)
    },
    initUserSession: () => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    logEvent: (state, action) => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    logGoal: (state, action) => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    logPageView: (state, action) => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    startSession: (state, action) => {},
    stopSession: () => {}
  }
})

export const { actions } = analyticsSlice
export const analyticsReducer = analyticsSlice.reducer
