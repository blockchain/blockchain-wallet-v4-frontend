/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { BuildTxFeeType, BuildTxResponseType } from '@core/network/api/coin/types'
import Remote from '@core/remote'
import {
  CrossBorderLimits,
  FiatCurrenciesType,
  RatesType,
  // ProductTypes,
  // BSTransactionType,
  WithdrawalLockResponseType,
  WithdrawalMinsAndFeesResponse,
  WithdrawResponseType
} from '@core/types'

import { SwapAccountType } from '../swap/types'
import {
  FetchSendLimitsPayload,
  SendCryptoState,
  SendCryptoStepPayload,
  SendCryptoStepType
} from './types'

const initialState: SendCryptoState = {
  initialCoin: undefined,
  isValidAddress: Remote.NotAsked,
  prebuildTx: Remote.NotAsked,
  sendLimits: Remote.NotAsked,
  step: SendCryptoStepType.COIN_SELECTION,
  transaction: Remote.NotAsked,
  withdrawLocks: Remote.NotAsked,
  withdrawalFeesAndMins: Remote.NotAsked
}

const sendCryptoSlice = createSlice({
  initialState,
  name: 'sendCrypto',
  reducers: {
    buildTx: (
      state,
      action: PayloadAction<{
        account: SwapAccountType
        amount: string
        destination: string
        fee: BuildTxFeeType
        fix: 'FIAT' | 'CRYPTO'
        rates: RatesType
        walletCurrency: keyof FiatCurrenciesType
      }>
    ) => {},
    buildTxFailure: (state, action: PayloadAction<string>) => {
      state.prebuildTx = Remote.Failure(action.payload)
    },
    buildTxLoading: (state) => {
      state.prebuildTx = Remote.Loading
    },
    buildTxSuccess: (state, action: PayloadAction<BuildTxResponseType>) => {
      state.prebuildTx = Remote.Success(action.payload)
    },
    fetchSendLimits: (state, action: PayloadAction<FetchSendLimitsPayload>) => {},
    fetchSendLimitsFailure: (state, action: PayloadAction<string>) => {
      state.sendLimits = Remote.Failure(action.payload)
    },
    fetchSendLimitsLoading: (state) => {
      state.sendLimits = Remote.Loading
    },
    fetchSendLimitsSuccess: (state, action: PayloadAction<CrossBorderLimits>) => {
      state.sendLimits = Remote.Success(action.payload)
    },
    fetchWithdrawalFees: (state, action: PayloadAction<{ account?: SwapAccountType }>) => {},
    fetchWithdrawalFeesFailure: (state, action: PayloadAction<string>) => {
      state.withdrawalFeesAndMins = Remote.Failure(action.payload)
    },
    fetchWithdrawalFeesLoading: (state) => {
      state.withdrawalFeesAndMins = Remote.Loading
    },
    fetchWithdrawalFeesSuccess: (state, action: PayloadAction<WithdrawalMinsAndFeesResponse>) => {
      state.withdrawalFeesAndMins = Remote.Success(action.payload)
    },
    fetchWithdrawalLocks: () => {},
    fetchWithdrawalLocksFailure: (state, action: PayloadAction<string>) => {
      state.withdrawLocks = Remote.Failure(action.payload)
    },
    fetchWithdrawalLocksLoading: (state) => {
      state.withdrawLocks = Remote.Loading
    },
    fetchWithdrawalLocksSuccess: (state, action: PayloadAction<WithdrawalLockResponseType>) => {
      state.withdrawLocks = Remote.Success(action.payload)
    },
    setInitialCoin: (state, action: PayloadAction<string>) => {
      state.initialCoin = action.payload
    },
    setStep: (state, action: PayloadAction<SendCryptoStepPayload>) => {
      state.step = action.payload.step
    },
    submitTransaction: () => {},
    submitTransactionFailure: (state, action: PayloadAction<string>) => {
      state.transaction = Remote.Failure(action.payload)
    },
    submitTransactionLoading: (state) => {
      state.transaction = Remote.Loading
    },
    submitTransactionSuccess: (
      state,
      action: PayloadAction<{ amount: { symbol: string; value: string } }>
    ) => {
      state.transaction = Remote.Success(action.payload)
    },
    validateAddress: (state, action: PayloadAction<{ address: string; coin: string }>) => {},
    validateAddressFailure: (state, action: PayloadAction<string>) => {
      state.isValidAddress = Remote.Failure(action.payload)
    },
    validateAddressLoading: (state) => {
      state.isValidAddress = Remote.Loading
    },
    validateAddressSuccess: (state, action: PayloadAction<boolean>) => {
      state.isValidAddress = Remote.Success(action.payload)
    }

    // showModal: (state, action: PayloadAction<{ origin: ModalOriginType }>) => {}
  }
})

const { actions, reducer } = sendCryptoSlice
export { actions, reducer }
