import { RootState } from 'data/rootReducer'

export const getStep = (state: RootState) => state.components.sendBch.step
export const getPayment = (state: RootState) => state.components.sendBch.payment
export const getSendLimits = (state: RootState) => state.components.sendBch.sendLimits
export const getMaxCustodialWithdrawalFee = (state: RootState) =>
  state.components.sendBch.maxCustodialWithdrawalFee
export const getBchImportedFundsSweep = (state: RootState) =>
  state.components.sendBch.bchImportedFundsSweep
export const getImportFundsReceiveIndex = (state: RootState) =>
  state.components.sendBch.bchImportedFundsReceiveIndex
