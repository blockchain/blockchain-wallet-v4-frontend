import { createSlice } from '@reduxjs/toolkit'

import { TaxCenterState } from './types'

const initialState: TaxCenterState = {
  reports: []
}

const taxCenterSlice = createSlice({
  initialState,
  name: 'taxCenter',
  reducers: {
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
