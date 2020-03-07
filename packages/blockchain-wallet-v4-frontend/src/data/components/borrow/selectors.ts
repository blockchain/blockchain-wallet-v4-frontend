import { INVALID_COIN_TYPE } from './model'
import { RatesType } from './types'
import { RemoteDataType } from 'core/types'
import { RootState } from '../../rootReducer'
import { selectors } from 'data'
import Remote from 'blockchain-wallet-v4/src/remote/remote'

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
): RemoteDataType<string | Error, RatesType> => {
  const coinType = getCoinType(state)

  switch (coinType) {
    case 'BTC':
      return selectors.core.data.btc.getRates(state)
    case 'PAX':
      return selectors.core.data.eth.getErc20Rates(state, 'pax')
    default:
      throw Remote.Failure(INVALID_COIN_TYPE)
  }
}

export const getStep = (state: RootState) => state.components.borrow.step
