import { RootState } from 'data/rootReducer'

export const getStep = (state: RootState) => state.components.sendEth.step
export const getPayment = (state: RootState) => state.components.sendEth.payment
export const getIsContract = (state: RootState) => state.components.sendEth.isContract
export const getFeeToggled = (state: RootState) => state.components.sendEth.feeToggled
export const getSendLimits = (state: RootState) => state.components.sendEth.sendLimits
export const getMaxCustodialWithdrawalFee = (state: RootState) =>
  state.components.sendEth.maxCustodialWithdrawalFee
