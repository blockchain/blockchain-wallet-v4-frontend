import { RootState } from 'data/rootReducer'

export const getStep = (state: RootState) => state.components.sendCrypto.step

export const getIsValidAddress = (state: RootState) => state.components.sendCrypto.isValidAddress

export const getTransaction = (state: RootState) => state.components.sendCrypto.transaction

export const getPrebuildTx = (state: RootState) => state.components.sendCrypto.prebuildTx

export const getWithdrawalFees = (state: RootState, coin: string) =>
  state.components.sendCrypto.withdrawalFeesAndMins.map(
    (x) => x.fees.find(({ symbol }) => symbol === coin)?.value
  )

export const getWithdrawalMin = (state: RootState, coin: string) =>
  state.components.sendCrypto.withdrawalFeesAndMins.map(
    (x) => x.minAmounts.find(({ symbol }) => symbol === coin)?.value
  )

export const getSendLimits = (state: RootState) => state.components.sendCrypto.sendLimits

export const getPayment = (state: RootState) => state.components.sendCrypto.payment
