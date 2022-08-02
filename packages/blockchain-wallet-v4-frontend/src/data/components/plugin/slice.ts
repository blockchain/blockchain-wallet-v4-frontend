import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ethers } from 'ethers'

interface InitialState {
  publicAddress: string
  wallet: null | ethers.Wallet
}

const initialState: InitialState = {
  publicAddress: '',
  wallet: null
}

const pluginSlice = createSlice({
  initialState,
  name: 'plugin',
  reducers: {
    getPublicAddress: () => {},
    getWallet: () => {},
    setPublicAddress: (state, action: PayloadAction<string>) => {
      state.publicAddress = action.payload
    },
    setWallet: (state, action: PayloadAction<ethers.Wallet>) => {
      state.wallet = action.payload
    }
  }
})

const { actions } = pluginSlice
const pluginReducer = pluginSlice.reducer
export { actions, pluginReducer }
