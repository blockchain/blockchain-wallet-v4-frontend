import { RootState } from 'data/rootReducer'

export const getStep = (state: RootState) => state.components.sendBtc.step
export const getPayment = (state: RootState) => state.components.sendBtc.payment
export const getFeePerByteToggled = (state: RootState) => state.components.sendBtc.feePerByteToggled
export const getSendLimits = (state: RootState) => state.components.sendBtc.sendLimits
export const getMaxCustodialWithdrawalFee = (state: RootState) =>
  state.components.sendBtc.maxCustodialWithdrawalFee
