import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from '@core'

import { ReportType, TaxCenterState } from './types'

const initialState: TaxCenterState = {
  report: Remote.NotAsked,
  reports: Remote.NotAsked
}

const taxCenterSlice = createSlice({
  initialState,
  name: 'taxCenter',
  reducers: {
    createReport: () => {},
    createReportFailure: (state) => {
      state.report = Remote.Failure()
    },
    createReportSuccess: (state) => {
      state.report = Remote.Success()
    },
    getReports: () => {},
    getReportsFailure: (state) => {
      state.reports = Remote.Failure()
    },
    getReportsSuccess: (state, action: PayloadAction<ReportType[]>) => {
      state.reports = Remote.Success(action.payload)
    }
  }
})

const { actions } = taxCenterSlice
const taxCenterReducer = taxCenterSlice.reducer
export { actions, taxCenterReducer }
