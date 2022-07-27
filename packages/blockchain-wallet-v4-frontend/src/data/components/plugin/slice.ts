import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  publicAddress: ''
}

const pluginSlice = createSlice({
  initialState,
  name: 'plugin',
  reducers: {
    getPublicAddress: () => {},
    setPublicAddress: (state, action: PayloadAction<string>) => {
      state.publicAddress = action.payload
    }
  }
})

const { actions } = pluginSlice
const pluginReducer = pluginSlice.reducer
export { actions, pluginReducer }
