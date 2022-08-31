import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { CaptchaActionType } from './types'

const initialState = {
  runtimeFile: null
}

const miscSlice = createSlice({
  initialState,
  name: 'misc',
  reducers: {
    generateCaptchaToken: (state, action: PayloadAction<CaptchaActionType>) => {},
    pingRuntimeFile: () => {},
    setRuntimeFile: (state, action) => {
      state.runtimeFile = action.payload
    }
  }
})

export const { actions } = miscSlice
export const miscReducer = miscSlice.reducer
