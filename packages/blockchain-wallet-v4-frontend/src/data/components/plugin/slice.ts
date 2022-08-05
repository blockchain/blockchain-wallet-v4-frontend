import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ethers, providers } from 'ethers'

interface InitialState {
  publicAddress: string
  transactionRequest: providers.TransactionRequest | null
  wallet: null | ethers.Wallet
}

const initialState: InitialState = {
  publicAddress: '',
  transactionRequest: null,
  wallet: null
}

const pluginSlice = createSlice({
  initialState,
  name: 'plugin',
  reducers: {
    autoLogin: () => {},
    getPublicAddress: () => {},
    getWallet: () => {},
    initTransactionRequestParameters: (
      state,
      action: PayloadAction<providers.TransactionRequest>
    ) => {
      state.transactionRequest = action.payload
    },
    loginRoutineSaga: () => {},
    sendTransaction: (state, action: PayloadAction<providers.TransactionRequest>) => {},
    setPublicAddress: (state, action: PayloadAction<string>) => {
      state.publicAddress = action.payload
    },
    setTransactionRequest: (state, action: PayloadAction<providers.TransactionRequest>) => {
      state.transactionRequest = action.payload
    },
    setWallet: (state, action: PayloadAction<ethers.Wallet>) => {
      state.wallet = action.payload
    }
  }
})

const { actions } = pluginSlice
const pluginReducer = pluginSlice.reducer
export { actions, pluginReducer }
