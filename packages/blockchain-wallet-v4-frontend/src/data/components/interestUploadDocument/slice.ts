import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import Remote from 'blockchain-wallet-v4/src/remote/remote'
import { FileUploadItem, InterestEDDDocumentsResponse } from 'blockchain-wallet-v4/src/types'
import { ModalOriginType } from 'data/modals/types'

import {
  InterestUploadDocumentsPayload,
  InterestUploadDocumentsState,
  InterestUploadDocumentsStepType
} from './types'

const initialState: InterestUploadDocumentsState = {
  interestEDDDocumentLimits: Remote.NotAsked,
  step: InterestUploadDocumentsStepType.INIT_PAGE
}

const interestUploadDocumentSlice = createSlice({
  initialState,
  name: 'interestUploadDocument',
  reducers: {
    // EDD Documents Limits
    fetchEDDDocumentsLimits: () => {},
    fetchEDDDocumentsLimitsFailure: (state, action: PayloadAction<string>) => {
      state.interestEDDDocumentLimits = Remote.Failure(action.payload)
    },
    fetchEDDDocumentsLimitsLoading: (state) => {
      state.interestEDDDocumentLimits = Remote.Loading
    },
    fetchEDDDocumentsLimitsSuccess: (
      state,
      action: PayloadAction<InterestEDDDocumentsResponse>
    ) => {
      state.interestEDDDocumentLimits = Remote.Success(action.payload)
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
