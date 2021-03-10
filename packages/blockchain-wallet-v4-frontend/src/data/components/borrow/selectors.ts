import { RatesType, RemoteDataType } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

import { RootState } from '../../rootReducer'

export const getCoinType = (state: RootState) => state.components.borrow.coin

export const getPayment = (state: RootState) => state.components.borrow.payment

export const getLimits = (state: RootState) => state.components.borrow.limits

export const getLoan = (state: RootState) => state.components.borrow.loan

export const getLoanTransactions = (state: RootState) =>
  state.components.borrow.loanTransactions

export const getOffers = (state: RootState) => state.components.borrow.offers

export const getOffer = (state: RootState) => state.components.borrow.offer

export const getBorrowHistory = (state: RootState) =>
  state.components.borrow.borrowHistory

export const getRates = (
  state: RootState
): RemoteDataType<string, RatesType> => {
  const coinType = getCoinType(state)

  return selectors.core.data.misc.getRatesSelector(coinType, state)
}

export const getStep = (state: RootState) => state.components.borrow.step
