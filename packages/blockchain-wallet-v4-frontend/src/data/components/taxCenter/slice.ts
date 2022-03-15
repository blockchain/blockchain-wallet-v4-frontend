import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from '@core'

import { TaxCenterState } from './types'

const initialState: TaxCenterState = {
  reportData: Remote.NotAsked,
  reports: []
}

const taxCenterSlice = createSlice({
  initialState,
  name: 'taxCenter',
  reducers: {
    createReport: (state, action: PayloadAction<string>) => {},
    createReportFailure: (state, action: PayloadAction<string>) => {
      state.reportData = Remote.Failure(action.payload)
    },
    getReports: () => {},
    getReportsFailure: (state) => {
      state.reports = []
    },
    getReportsSuccess: (state, action) => {
      state.reports = action.payload
    }
  }
})

const { actions } = taxCenterSlice
const taxCenterReducer = taxCenterSlice.reducer
export { actions, taxCenterReducer }
