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
  WithdrawAmount
} from '@core/types'

import { SwapAccountType } from '../swap/types'
import {
  FetchSendLimitsPayload,
  GetMaxWithdrawalFeeType,
  SendCryptoState,
  SendCryptoStepPayload,
  SendCryptoStepType,
  SharedBuildTxResponseType
} from './types'

const initialState: SendCryptoState = {
  custodialWithdrawalFee: Remote.NotAsked,
  initialCoin: undefined,
  isValidAddress: Remote.NotAsked,
  maxCustodialWithdrawalFee: Remote.NotAsked,
  prebuildTx: Remote.NotAsked,
  sendLimits: Remote.NotAsked,
  step: SendCryptoStepType.COIN_SELECTION,
  transaction: Remote.NotAsked,
  withdrawLocks: Remote.NotAsked,
  withdrawalFeesAndMins: Remote.NotAsked,
  withdrawalMin: Remote.NotAsked
}

const sendCryptoSlice = createSlice({
  initialState,
  name: 'sendCrypto',
  reducers: {
    buildTx: (
      state,
      action: PayloadAction<{
        account: SwapAccountType
        baseCryptoAmt: string
        destination: string
        fee: BuildTxFeeType
        fix: 'FIAT' | 'CRYPTO'
        memo?: string
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
    buildTxSuccess: (state, action: PayloadAction<SharedBuildTxResponseType>) => {
      state.prebuildTx = Remote.Success(action.payload)
    },
    clearCustodialWithdrawal: (state) => {
      state.custodialWithdrawalFee = Remote.NotAsked
      state.withdrawalMin = Remote.NotAsked
      state.maxCustodialWithdrawalFee = Remote.NotAsked
    },
    fetchCustodialWithdrawalFeeFailure: (state, action: PayloadAction<string>) => {
      state.custodialWithdrawalFee = Remote.Failure(action.payload)
    },
    fetchCustodialWithdrawalFeeLoading: (state) => {
      state.custodialWithdrawalFee = Remote.Loading
    },
    fetchCustodialWithdrawalFeeSuccess: (state, action: PayloadAction<string>) => {
      state.custodialWithdrawalFee = Remote.Success(action.payload)
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
    getCustodialWithdrawalFee: (state) => {},
    getMaxWithdrawalFee: (state, payload: PayloadAction<GetMaxWithdrawalFeeType>) => {},
    initializeSend: (state) => {},
    sendCryptoMaxCustodialWithdrawalFeeFailure: (state, action: PayloadAction<string>) => {
      state.maxCustodialWithdrawalFee = Remote.Failure(action.payload)
    },
    sendCryptoMaxCustodialWithdrawalFeeLoading: (state) => {
      state.maxCustodialWithdrawalFee = Remote.Loading
    },
    sendCryptoMaxCustodialWithdrawalFeeSuccess: (state, action: PayloadAction<string>) => {
      state.maxCustodialWithdrawalFee = Remote.Success(action.payload)
    },
    setInitialCoin: (state, action: PayloadAction<string>) => {
      state.initialCoin = action.payload
    },
    setStep: (state, action: PayloadAction<SendCryptoStepPayload>) => {
      state.step = action.payload.step
    },
    setWithdrawalMin: (state, action: PayloadAction<string>) => {
      state.withdrawalMin = Remote.Success(action.payload)
    },
    submitTransaction: () => {},
    submitTransactionFailure: (state, action: PayloadAction<string>) => {
      state.transaction = Remote.Failure(action.payload)
    },
    submitTransactionLoading: (state) => {
      state.transaction = Remote.Loading
    },
    submitTransactionSuccess: (state, action: PayloadAction<{ amount: WithdrawAmount }>) => {
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
