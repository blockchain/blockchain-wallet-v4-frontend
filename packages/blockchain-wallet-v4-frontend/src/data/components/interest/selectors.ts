import { isEmpty, lift, union } from 'ramda'

import {
  EarnAccountBalanceResponseType,
  ExtractSuccess,
  FiatType,
  RatesType,
  RemoteDataType
} from '@core/types'
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

export const getWalletCurrency = (state: RootState): RemoteDataType<string, FiatType> => {
  return selectors.core.settings.getCurrency(state)
}

export const getAllRates = (state: RootState) => state.dataPath.coins.rates
// If the user does not have a rewards balance, move the preferredCoins list to the top of the list (even better if this is done by backend)
// If the user has a rewards balance, move those instruments to the top of the list and merge with the preferredCoins list
export const getInstrumentsSortedByBalance = createDeepEqualSelector(
  getEarnInstruments,
  getRewardsAccountBalance,
  getStakingAccountBalance,
  getIsStakingEnabled,
  getAllRates,
  getWalletCurrency,
  (
    instrumentsR: ReturnType<typeof getEarnInstruments>,
    rewardsBalancesR: ReturnType<typeof getRewardsAccountBalance>,
    stakingBalancesR: ReturnType<typeof getStakingAccountBalance>,
    isStakingEnabledR: ReturnType<typeof getIsStakingEnabled>,
    allRatesR: ReturnType<typeof getAllRates>,
    walletCurrencyR: ReturnType<typeof getWalletCurrency>
  ) => {
    const transform = (
      instruments: ExtractSuccess<typeof instrumentsR>,
      rewardsBalances: ExtractSuccess<typeof rewardsBalancesR>,
      stakingBalances: ExtractSuccess<typeof stakingBalancesR>,
      isStakingEnabled: ExtractSuccess<typeof isStakingEnabledR>,
      allRates: ExtractSuccess<typeof allRatesR>,
      walletCurrency: ExtractSuccess<typeof walletCurrencyR>
    ) => {
      if (isEmpty(instruments)) return []

      const mapBalancesToPreferredCoins = (
        balances: EarnAccountBalanceResponseType,
        preferredCoins: EarnInstrumentsType,
        product: 'Staking' | 'Rewards'
      ) => {
        if (!isEmpty(balances)) {
          const mappedBalances: EarnInstrumentsType = Object.keys(balances).map((coin) => ({
            coin,
            product,
            rate: allRates[`${coin}-${walletCurrency}`]
          }))
          return union(mappedBalances, preferredCoins)
        }

        return preferredCoins
      }

      let preferredRewardsCoins: EarnInstrumentsType = [
        { coin: 'BTC', product: 'Rewards', rate: allRates[`BTC-${walletCurrency}`] },
        { coin: 'ETH', product: 'Rewards', rate: allRates[`ETH-${walletCurrency}`] },
        { coin: 'USDT', product: 'Rewards', rate: allRates[`USDT-${walletCurrency}`] },
        { coin: 'USDC', product: 'Rewards', rate: allRates[`USDC-${walletCurrency}`] }
      ]
      let preferredStakingCoins: EarnInstrumentsType = [
        { coin: 'ETH', product: 'Staking', rate: allRates[`ETH-${walletCurrency}`] }
      ]

      const stakingInstruments = instruments.filter(({ product }) => product === 'Staking')

      const rewardsInstruments = instruments.filter(({ product }) => product === 'Rewards')

      preferredStakingCoins = mapBalancesToPreferredCoins(
        stakingBalances,
        preferredStakingCoins,
        'Staking'
      )

      preferredRewardsCoins = mapBalancesToPreferredCoins(
        rewardsBalances,
        preferredRewardsCoins,
        'Rewards'
      )

      preferredStakingCoins.forEach(({ coin }) => {
        const coinIndex: number = stakingInstruments.findIndex(
          (instrument) => instrument.coin === coin
        )
        if (coinIndex !== -1) {
          stakingInstruments.splice(coinIndex, 1)
        }
      })
      preferredRewardsCoins.forEach(({ coin }) => {
        const coinIndex: number = rewardsInstruments.findIndex(
          (instrument) => instrument.coin === coin
        )
        if (coinIndex !== -1) {
          rewardsInstruments.splice(coinIndex, 1)
        }
      })

      if (!isStakingEnabled) {
        return [...preferredRewardsCoins, ...rewardsInstruments]
      }

      return [
        ...preferredStakingCoins,
        ...stakingInstruments,
        ...preferredRewardsCoins,
        ...rewardsInstruments
      ]
    }

    return lift(transform)(
      instrumentsR,
      rewardsBalancesR,
      stakingBalancesR,
      isStakingEnabledR,
      allRatesR,
      walletCurrencyR
    )
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

export const getPendingStakingTransactions = (state: RootState) =>
  state.components.interest.pendingStakingTransactions

export const getTotalBondingDeposits = (state: RootState) =>
  state.components.interest.totalBondingDeposits

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

export const getWithdrawalMinimums = (state: RootState) =>
  state.components.interest.withdrawalMinimums

export const getAfterTransaction = (state: RootState) => state.components.interest.afterTransaction

export const getEarnEDDStatus = (state: RootState) => state.components.interest.earnEDDStatus

export const getEarnEDDWithdrawLimits = (state: RootState) =>
  state.components.interest.earnEDDWithdrawLimits

export const getEarnEDDDepositLimits = (state: RootState) =>
  state.components.interest.rewardsEDDDepositLimits

export const getUnderSanctionsMessage = (state: RootState) =>
  state.components.interest.underSanctionsMessage
export const getEarnTab = (state: RootState) => state.components.interest.earnTab
export const getShowAvailableAssets = (state: RootState) =>
  state.components.interest.showAvailableAssets
export const getSearchValue = (state: RootState) => state.components.interest.searchValue
