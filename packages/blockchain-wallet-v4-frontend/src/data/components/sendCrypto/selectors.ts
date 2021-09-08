import { RootState } from 'data/rootReducer'

export const getStep = (state: RootState) => state.components.sendCrypto.step

export const getTransaction = (state: RootState) => state.components.sendCrypto.transaction

export const getWithdrawalFees = (state: RootState, coin: string) =>
  state.components.sendCrypto.withdrawalFeesAndMins.map(
    (x) => x.fees.find(({ symbol }) => symbol === coin)?.value
  )

export const getWithdrawalMin = (state: RootState, coin: string) =>
  state.components.sendCrypto.withdrawalFeesAndMins.map(
    (x) => x.minAmounts.find(({ symbol }) => symbol === coin)?.value
  )
