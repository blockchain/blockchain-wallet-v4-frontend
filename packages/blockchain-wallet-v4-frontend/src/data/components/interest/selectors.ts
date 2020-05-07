import { RatesType } from '../borrow/types'
import { RemoteDataType } from 'core/types'
import { RootState } from '../../rootReducer'
import { selectors } from 'data'
import Remote from 'core/remote/remote'

export const getInterestAccountBalance = (state: RootState) =>
  state.components.interest.interestAccountBalance

export const getCoinType = (state: RootState) => state.components.interest.coin

export const getDepositAddress = (state: RootState) => {
  const account = getInterestAccount(state).getOrElse({ accountRef: null })
  // @ts-ignore TODO: fixme
  return account.accountRef
}

export const getInterestEligible = (state: RootState) =>
  state.components.interest.interestEligible

export const getInterestInstruments = (state: RootState) =>
  state.components.interest.interestInstruments

export const getInterestLimits = (state: RootState) =>
  state.components.interest.interestLimits

export const getInterestAccount = (state: RootState) =>
  state.components.interest.account

export const getInterestRate = (state: RootState) =>
  state.components.interest.interestRate

export const getInterestTransactions = (state: RootState) =>
  state.components.interest.interestTransactions

export const getMinMaxLimits = (state: RootState) =>
  state.components.interest.limits

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
