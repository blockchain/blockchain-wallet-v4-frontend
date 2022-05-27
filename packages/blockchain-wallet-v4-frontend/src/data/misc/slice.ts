import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { CaptchaActionType } from './types'

const initialState = {
  manifestFile: null
}

const miscSlice = createSlice({
  initialState,
  name: 'misc',
  reducers: {
    generateCaptchaToken: (state, action: PayloadAction<CaptchaActionType>) => {},
    pingManifestFile: () => {},
    setManifestFile: (state, action) => {
      state.manifestFile = action.payload
    }
  }
})

export const { actions } = miscSlice
export const miscReducer = miscSlice.reducer
