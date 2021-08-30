import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ModalOriginType } from 'data/modals/types'

import {
  InterestUploadDocumentsPayload,
  InterestUploadDocumentsState,
  InterestUploadDocumentsStepType
} from './types'

const initialState: InterestUploadDocumentsState = {
  step: InterestUploadDocumentsStepType.INIT_PAGE
}

const interestUploadDocumentSlice = createSlice({
  initialState,
  name: 'interestUploadDocument',
  reducers: {
    setStep: (state, action: PayloadAction<InterestUploadDocumentsPayload>) => {
      state.step = action.payload.step
    },
    showModal: (state, action: PayloadAction<{ origin: ModalOriginType }>) => {}
  }
})

export const { showModal } = interestUploadDocumentSlice.actions
const { actions, reducer } = interestUploadDocumentSlice
export { actions, reducer }
