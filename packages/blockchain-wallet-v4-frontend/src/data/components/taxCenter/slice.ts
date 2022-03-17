import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from '@core'

import { ReportType, TaxCenterState } from './types'

const initialState: TaxCenterState = {
  createReport: Remote.NotAsked,
  fetchError: false,
  reports: Remote.NotAsked,
  test: Remote.NotAsked
}

const taxCenterSlice = createSlice({
  initialState,
  name: 'taxCenter',
  reducers: {
    createReport: () => {},
    createReportFailure: (state) => {
      state.createReport = Remote.Failure()
    },
    createReportSuccess: (state) => {
      state.createReport = Remote.Success()
    },
    getReports: () => {},
    getReportsFailure: (state) => {
      state.fetchError = true
      state.test = Remote.Failure(true)
      state.reports = Remote.Failure()
    },
    getReportsSuccess: (state, action: PayloadAction<ReportType[]>) => {
      state.fetchError = false
      state.reports = Remote.Success(action.payload)
      state.test = Remote.Success(true)
    }
  }
})

const { actions } = taxCenterSlice
const taxCenterReducer = taxCenterSlice.reducer
export { actions, taxCenterReducer }
