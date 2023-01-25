/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import Remote from '@core/remote'
import { FileUploadItem } from '@core/types'

import { DataObject, UploadDocumentsType } from './types'

const initialState: UploadDocumentsType = {
  data: null,
  reference: null,
  uploaded: Remote.NotAsked
}

const uploadDocumentsSlice = createSlice({
  initialState,
  name: 'uploadDocuments',
  reducers: {
    fetchData: (state, action: PayloadAction<{ token: string }>) => {},
    setData: (state, action: PayloadAction<DataObject>) => {
      state.data = action.payload
    },
    setReference: (state, action: PayloadAction<any>) => {
      state.reference = action.payload
    },
    setUploadedFailure: (state, action: PayloadAction<any>) => {
      state.uploaded = Remote.Failure(action.payload)
    },
    setUploadedLoading: (state) => {
      state.uploaded = Remote.Loading
    },
    setUploadedSuccess: (state, action: PayloadAction<any>) => {
      state.uploaded = Remote.Success(action.payload)
    },
    upload: (
      state,
      action: PayloadAction<{ files: FileUploadItem[]; redirectUrl: string; token: string }>
    ) => {}
  }
})

const { actions, reducer } = uploadDocumentsSlice
export { actions, reducer }
