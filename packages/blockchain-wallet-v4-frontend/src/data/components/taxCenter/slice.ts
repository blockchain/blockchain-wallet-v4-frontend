import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ReportType, TaxCenterState } from './types'

const initialState: TaxCenterState = {
  createReportError: false,
  fetchError: false,
  reports: []
}

const taxCenterSlice = createSlice({
  initialState,
  name: 'taxCenter',
  reducers: {
    createReport: () => {},
    createReportFailure: (state) => {
      state.createReportError = true
    },
    createReportSuccess: (state) => {
      state.createReportError = false
    },
    getReports: () => {},
    getReportsFailure: (state) => {
      state.fetchError = true
    },
    getReportsSuccess: (state, action: PayloadAction<ReportType[]>) => {
      state.fetchError = false
      state.reports = action.payload
    }
  }
})

const { actions } = taxCenterSlice
const taxCenterReducer = taxCenterSlice.reducer
export { actions, taxCenterReducer }
