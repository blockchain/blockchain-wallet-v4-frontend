import { isEmpty, lift, union } from 'ramda'

import { ExtractSuccess, FiatType, RatesType, RemoteDataType } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { EarnInstrumentsType } from './types'

export const getRewardsAccountBalance = (state: RootState) =>
  state.components.interest.rewardsAccountBalance
export const getStakingAccountBalance = (state: RootState) =>
  state.components.interest.stakingAccountBalance

export const getCoinType = (state: RootState) => state.components.interest.coin

export const getIsAmountDisplayedInCrypto = (state: RootState) =>
  state.components.interest.isAmountDisplayedInCrypto

export const getInterestEligible = (state: RootState) => state.components.interest.interestEligible

export const getStakingEligible = (state: RootState) => state.components.interest.stakingEligible

export const getEarnInstruments = (state: RootState) => state.components.interest.instruments

export const getIsStakingEnabled = (state: RootState) =>
  selectors.core.walletOptions.getIsStakingEnabled(state) || false

// If the user does not have a rewards balance, move the preferredCoins list to the top of the list (even better if this is done by backend)
// If the user has a rewards balance, move those instruments to the top of the list and merge with the preferredCoins list
export const getInstrumentsSortedByBalance = createDeepEqualSelector(
  getEarnInstruments,
  getRewardsAccountBalance,
  getIsStakingEnabled,
  (
    instrumentsR: ReturnType<typeof getEarnInstruments>,
    balancesR: ReturnType<typeof getRewardsAccountBalance>,
    isStakingEnabledR: ReturnType<typeof getIsStakingEnabled>
  ) => {
    const transform = (
      instruments: ExtractSuccess<typeof instrumentsR>,
      balances: ExtractSuccess<typeof balancesR>,
      isStakingEnabled: ExtractSuccess<typeof isStakingEnabledR>
    ) => {
      if (isEmpty(instruments)) return []
      let preferredCoins: EarnInstrumentsType = [
        { coin: 'BTC', product: 'Rewards' },
        { coin: 'ETH', product: 'Rewards' },
        { coin: 'USDT', product: 'Rewards' },
        { coin: 'USDC', product: 'Rewards' }
      ]
      if (!isEmpty(balances)) {
        const mappedBalances: EarnInstrumentsType = Object.keys(balances).map((coin) => ({
          coin,
          product: 'Rewards'
        }))
        preferredCoins = union(mappedBalances, preferredCoins)
      }

      // pin staking to first row
      preferredCoins = [{ coin: 'ETH', product: 'Staking' }, ...preferredCoins]

      preferredCoins.forEach(({ coin, product }) => {
        const coinIndex: number = instruments.findIndex(
          (instrument) => instrument.coin === coin && instrument.product === product
        )
        if (coinIndex !== -1) {
          instruments.splice(coinIndex, 1)
        }
      })

      if (!isStakingEnabled) {
        preferredCoins = preferredCoins.filter(({ product }) => product !== 'Staking')
        instruments = instruments.filter(({ product }) => product !== 'Staking')
      }

      return [...preferredCoins, ...instruments]
    }

    return lift(transform)(instrumentsR, balancesR, isStakingEnabledR)
  }
)

export const getInterestLimits = (state: RootState) => state.components.interest.interestLimits

export const getStakingLimits = (state: RootState) => state.components.interest.stakingLimits

export const getRewardsAccount = (state: RootState) => state.components.interest.rewardsAccount

export const getStakingAccount = (state: RootState) => state.components.interest.stakingAccount

export const getRewardsDepositAddress = (state: RootState) => {
  const account = getRewardsAccount(state).getOrElse({ accountRef: '' })
  return account.accountRef
}

export const getStakingDepositAddress = (state: RootState) => {
  const account = getStakingAccount(state).getOrElse({ accountRef: '' })
  return account.accountRef
}
export const getInterestRates = (state: RootState) => state.components.interest.interestRates

export const getStakingRates = (state: RootState) => state.components.interest.stakingRates

export const getInterestTransactionsReport = (state: RootState) =>
  state.components.interest.transactionsReport

export const getEarnTransactions = (state: RootState) => state.components.interest.transactions

export const getEarnDepositLimits = (state: RootState) =>
  state.components.interest.earnDepositLimits

export const getPayment = (state: RootState) => state.components.interest.payment

export const getRates = (state: RootState): RemoteDataType<string, RatesType> => {
  const coinType = getCoinType(state)

  return selectors.core.data.misc.getRatesSelector(coinType, state)
}

export const getRewardsStep = (state: RootState) => state.components.interest.rewardsStep

export const getStakingStep = (state: RootState) => state.components.interest.stakingStep

export const getRewardsTransactionsNextPage = (state: RootState) =>
  state.components.interest.rewardsTransactionsNextPage

export const getStakingTransactionsNextPage = (state: RootState) =>
  state.components.interest.stakingTransactionsNextPage

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

export const getUnderSanctionsMessage = (state: RootState) =>
  state.components.interest.underSanctionsMessage
