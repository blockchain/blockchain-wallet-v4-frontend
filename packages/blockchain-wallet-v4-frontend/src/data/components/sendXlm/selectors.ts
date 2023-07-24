import { RootState } from 'data/rootReducer'

export const getStep = (state: RootState) => state.components.sendXlm.step
export const getPayment = (state: RootState) => state.components.sendXlm.payment
export const getCheckDestination = (state: RootState) => state.components.sendXlm.checkDestination
export const getIsDestinationExchange = (state: RootState) =>
  state.components.sendXlm.isDestinationExchange
export const getFeeToggled = (state: RootState) => state.components.sendXlm.feeToggled
export const showNoAccountForm = (state: RootState) => state.components.sendXlm.showNoAccountForm
export const getSendLimits = (state: RootState) => state.components.sendXlm.sendLimits
export const getMaxCustodialWithdrawalFee = (state: RootState) =>
  state.components.sendXlm.maxCustodialWithdrawalFee
