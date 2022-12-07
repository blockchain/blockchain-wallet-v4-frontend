import { createSlice } from '@reduxjs/toolkit'

import Remote from '../../remote'
import { WalletOptionsStateType } from './types'

const initialState: WalletOptionsStateType = {
  details: Remote.NotAsked
}
const walletOptionsSlice = createSlice({
  initialState,
  name: 'walletOptions',
  reducers: {
    fetchOptions: () => {},
    fetchOptionsFailure: (state, action) => {
      state.details = Remote.Failure(action.payload)
    },

    fetchOptionsLoading: (state) => {
      state.details = Remote.Loading
    },
    fetchOptionsSuccess: (state, action) => {
      state.details = Remote.Success(action.payload)
    }
  }
})

const { actions } = walletOptionsSlice
const walletOptionsReducer = walletOptionsSlice.reducer
export { actions, walletOptionsReducer }
