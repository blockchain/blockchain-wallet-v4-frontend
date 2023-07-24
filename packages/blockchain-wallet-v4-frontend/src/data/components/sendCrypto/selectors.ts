import { RootState } from 'data/rootReducer'

export const getStep = (state: RootState) => state.components.sendCrypto.step

export const getIsValidAddress = (state: RootState) => state.components.sendCrypto.isValidAddress

export const getTransaction = (state: RootState) => state.components.sendCrypto.transaction

export const getPrebuildTx = (state: RootState) => state.components.sendCrypto.prebuildTx

export const getCustodialWithdrawalFee = (state: RootState) =>
  state.components.sendCrypto.custodialWithdrawalFee

export const getMaxCustodialWithdrawalFee = (state: RootState) =>
  state.components.sendCrypto.maxCustodialWithdrawalFee

export const getWithdrawalMin = (state: RootState) => state.components.sendCrypto.withdrawalMin

export const getSendLimits = (state: RootState) => state.components.sendCrypto.sendLimits
