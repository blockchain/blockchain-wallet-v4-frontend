import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  manifestFile: null
}

const miscSlice = createSlice({
  initialState,
  name: 'misc',
  reducers: {
    pingManifestFile: () => {},
    setManifestFile: (state, action) => {
      state.manifestFile = action.payload
    }
  }
})

export const { actions } = miscSlice
export const miscReducer = miscSlice.reducer
