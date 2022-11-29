import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from '@core'

import { ReportGenerateRequestType, ReportType, TaxCenterState } from './types'

const initialState: TaxCenterState = {
  reportGenerationStatus: Remote.NotAsked,
  reports: Remote.NotAsked
}

const taxCenterSlice = createSlice({
  initialState,
  name: 'taxCenter',
  reducers: {
    createReport: (state, action: PayloadAction<ReportGenerateRequestType>) => {},
    createReportFailure: (state, action) => {
      state.reportGenerationStatus = Remote.Failure(action.payload)
    },
    createReportLoading: (state) => {
      state.reportGenerationStatus = Remote.Loading
    },
    createReportSuccess: (state) => {
      state.reportGenerationStatus = Remote.Success('')
    },
    getReports: () => {},
    getReportsFailure: (state) => {
      state.reports = Remote.Failure(null)
    },
    getReportsSuccess: (state, action: PayloadAction<ReportType[]>) => {
      state.reports = Remote.Success(action.payload)
    }
  }
})

const { actions } = taxCenterSlice
const taxCenterReducer = taxCenterSlice.reducer
export { actions, taxCenterReducer }
