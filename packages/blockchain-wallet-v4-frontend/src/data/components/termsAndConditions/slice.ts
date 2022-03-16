import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from '@core'
import { TermsAndConditionType } from '@core/types'

import { TermsAndConditionsState } from './types'

const initialState: TermsAndConditionsState = {
  termsAndConditions: Remote.NotAsked
}

const termsAndConditionsSlice = createSlice({
  initialState,
  name: 'termsAndConditions',
  reducers: {
    fetchTermsAndConditions: () => {},
    fetchTermsAndConditionsFailure: (state, action: PayloadAction<string>) => {
      state.termsAndConditions = Remote.Failure(action.payload)
    },
    fetchTermsAndConditionsLoading: (state) => {
      state.termsAndConditions = Remote.Loading
    },
    fetchTermsAndConditionsSuccess: (state, action: PayloadAction<TermsAndConditionType>) => {
      state.termsAndConditions = Remote.Success(action.payload)
    },
    signTermsAndConditions: () => {}
  }
})

export const { fetchTermsAndConditions } = termsAndConditionsSlice.actions
const { actions, reducer } = termsAndConditionsSlice
export { actions, initialState, reducer }
