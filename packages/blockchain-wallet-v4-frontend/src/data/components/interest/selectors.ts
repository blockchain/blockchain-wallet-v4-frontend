import { FiatType, RemoteDataType } from 'core/types'
import { Remote } from 'blockchain-wallet-v4/src'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

import { RatesType } from '../borrow/types'

export const getInterestAccountBalance = (state: RootState) =>
  state.components.interest.accountBalance

export const getCoinType = (state: RootState) => state.components.interest.coin

export const getDepositAddress = (state: RootState) => {
  const account = getInterestAccount(state).getOrElse({ accountRef: null })
  return account.accountRef
}

export const getInterestEligible = (state: RootState) =>
  state.components.interest.interestEligible

export const getInterestInstruments = (state: RootState) =>
  state.components.interest.instruments

export const getInterestLimits = (state: RootState) =>
  state.components.interest.interestLimits

export const getInterestAccount = (state: RootState) =>
  state.components.interest.account

export const getInterestRate = (state: RootState) =>
  state.components.interest.interestRate

export const getInterestTransactions = (state: RootState) =>
  state.components.interest.transactions

export const getDepositLimits = (state: RootState) =>
  state.components.interest.depositLimits

export const getPayment = (state: RootState) =>
  state.components.interest.payment

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
      throw Remote.Failure('INVALID_COIN_TYPE')
  }
}

export const getStep = (state: RootState) => state.components.interest.step

export const getTransactionsNextPage = (state: RootState) =>
  state.components.interest.transactionsNextPage

export const getWalletCurrency = (
  state: RootState
): RemoteDataType<string, FiatType> => {
  return selectors.core.settings.getCurrency(state)
}
