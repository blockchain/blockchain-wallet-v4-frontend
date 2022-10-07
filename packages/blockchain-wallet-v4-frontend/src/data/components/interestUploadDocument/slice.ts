import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from '@core'
import { EarnEDDDocumentsResponse, FileUploadItem } from '@core/types'
import { ModalOriginType } from 'data/modals/types'

import {
  InterestUploadDocumentsPayload,
  InterestUploadDocumentsState,
  InterestUploadDocumentsStepType
} from './types'

const initialState: InterestUploadDocumentsState = {
  earnEDDDocumentLimits: Remote.NotAsked,
  step: InterestUploadDocumentsStepType.INIT_PAGE
}

const interestUploadDocumentSlice = createSlice({
  initialState,
  name: 'interestUploadDocument',
  reducers: {
    // EDD Documents Limits
    fetchEDDDocumentsLimits: () => {},
    fetchEDDDocumentsLimitsFailure: (state, action: PayloadAction<string>) => {
      state.earnEDDDocumentLimits = Remote.Failure(action.payload)
    },
    fetchEDDDocumentsLimitsLoading: (state) => {
      state.earnEDDDocumentLimits = Remote.Loading
    },
    fetchEDDDocumentsLimitsSuccess: (state, action: PayloadAction<EarnEDDDocumentsResponse>) => {
      state.earnEDDDocumentLimits = Remote.Success(action.payload)
    },

    saveAdditionalData: () => {},

    setStep: (state, action: PayloadAction<InterestUploadDocumentsPayload>) => {
      state.step = action.payload.step
    },
    showModal: (state, action: PayloadAction<{ origin: ModalOriginType }>) => {},
    uploadFiles: (state, action: PayloadAction<{ files: FileUploadItem[] }>) => {}
  }
})

export const { saveAdditionalData, showModal, uploadFiles } = interestUploadDocumentSlice.actions
const { actions, reducer } = interestUploadDocumentSlice
export { actions, initialState, reducer }
