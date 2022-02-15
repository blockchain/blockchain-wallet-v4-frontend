import { isEmpty, lift, union } from 'ramda'

import { ExtractSuccess, FiatType, RatesType, RemoteDataType } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getInterestAccountBalance = (state: RootState) =>
  state.components.interest.accountBalance

export const getCoinType = (state: RootState) => state.components.interest.coin

export const getIsAmountDisplayedInCrypto = (state: RootState) =>
  state.components.interest.isAmountDisplayedInCrypto

export const getInterestEligible = (state: RootState) => state.components.interest.interestEligible

export const getInterestInstruments = (state: RootState) => state.components.interest.instruments

// If the user does not have a rewards balance, move the preferredCoins list to the top of the list (even better if this is done by backend)
// If the user has a rewards balance, move those instruments to the top of the list and merge with the preferredCoins list
export const getInstrumentsSortedByBalance = createDeepEqualSelector(
  getInterestInstruments,
  getInterestAccountBalance,
  (
    instrumentsR: ReturnType<typeof getInterestInstruments>,
    balancesR: ReturnType<typeof getInterestAccountBalance>
  ) => {
    const transform = (
      instruments: ExtractSuccess<typeof instrumentsR>,
      balances: ExtractSuccess<typeof balancesR>
    ) => {
      if (isEmpty(instruments)) return []
      let preferredCoins = ['BTC', 'ETH', 'USDT', 'USDC']
      if (!isEmpty(balances)) {
        preferredCoins = union(Object.keys(balances), preferredCoins)
      }

      preferredCoins.forEach((coin) => {
        const coinIndex = instruments.indexOf(coin)
        if (coinIndex !== -1) {
          instruments.splice(coinIndex, 1)
        }
      })

      return [...preferredCoins, ...instruments]
    }

    return lift(transform)(instrumentsR, balancesR)
  }
)

export const getInterestLimits = (state: RootState) => state.components.interest.interestLimits

export const getInterestAccount = (state: RootState) => state.components.interest.account

export const getDepositAddress = (state: RootState) => {
  const account = getInterestAccount(state).getOrElse({ accountRef: '' })
  return account.accountRef
}
export const getInterestRate = (state: RootState) => state.components.interest.interestRate

export const getInterestTransactionsReport = (state: RootState) =>
  state.components.interest.transactionsReport

export const getInterestTransactions = (state: RootState) => state.components.interest.transactions

export const getDepositLimits = (state: RootState) => state.components.interest.depositLimits

export const getPayment = (state: RootState) => state.components.interest.payment

export const getRates = (state: RootState): RemoteDataType<string, RatesType> => {
  const coinType = getCoinType(state)

  return selectors.core.data.misc.getRatesSelector(coinType, state)
}

export const getStep = (state: RootState) => state.components.interest.step

export const getTransactionsNextPage = (state: RootState) =>
  state.components.interest.transactionsNextPage

export const getWalletCurrency = (state: RootState): RemoteDataType<string, FiatType> => {
  return selectors.core.settings.getCurrency(state)
}

export const getWithdrawalMinimums = (state: RootState) =>
  state.components.interest.withdrawalMinimums

export const getAfterTransaction = (state: RootState) => state.components.interest.afterTransaction

export const getInterestEDDStatus = (state: RootState) =>
  state.components.interest.interestEDDStatus

export const getInterestEDDWithdrawLimits = (state: RootState) =>
  state.components.interest.interestEDDWithdrawLimits

export const getInterestEDDDepositLimits = (state: RootState) =>
  state.components.interest.interestEDDDepositLimits
