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

import { EarnInstrumentsType, EarnProductsType } from './types'

export const getPassiveRewardsAccountBalance = (
  state: RootState
): RemoteDataType<string, EarnAccountBalanceResponseType> =>
  state.components.interest.passiveRewardsAccountBalance
export const getActiveRewardsAccountBalance = (state: RootState) =>
  state.components.interest.activeRewardsAccountBalance
export const getStakingAccountBalance = (state: RootState) =>
  state.components.interest.stakingAccountBalance

export const getCoinType = (state: RootState) => state.components.interest.coin

export const getIsAmountDisplayedInCrypto = (state: RootState) =>
  state.components.interest.isAmountDisplayedInCrypto

export const getInterestEligible = (state: RootState) => state.components.interest.interestEligible

export const getActiveRewardsEligible = (state: RootState) =>
  state.components.interest.activeRewardsEligible
export const getStakingEligible = (state: RootState) => state.components.interest.stakingEligible

export const getEarnInstruments = (state: RootState) => state.components.interest.instruments

export const getIsStakingEnabled = (state: RootState) =>
  selectors.core.walletOptions.getIsStakingEnabled(state) || false
export const getIsActiveRewardsEnabled = (state: RootState) =>
  selectors.core.walletOptions.getActiveRewardsEnabled(state) || false

export const getWalletCurrency = (state: RootState): RemoteDataType<string, FiatType> => {
  return selectors.core.settings.getCurrency(state)
}

export const getEarnTab = (state: RootState) => state.components.interest.earnTab
export const getShowAvailableAssets = (state: RootState) =>
  state.components.interest.showAvailableAssets
export const getSearchValue = (state: RootState) => state.components.interest.searchValue

export const getAllRates = (state: RootState) => state.dataPath.coins.rates
// If the user does not have a rewards balance, move the preferredCoins list to the top of the list (even better if this is done by backend)
// If the user has a rewards balance, move those instruments to the top of the list and merge with the preferredCoins list
export const getInstrumentsSortedByBalance = createDeepEqualSelector(
  getEarnInstruments,
  getPassiveRewardsAccountBalance,
  getStakingAccountBalance,
  getIsStakingEnabled,
  getActiveRewardsAccountBalance,
  getIsActiveRewardsEnabled,
  getAllRates,
  getWalletCurrency,
  getEarnTab,
  getSearchValue,
  getShowAvailableAssets,
  (
    instrumentsR: ReturnType<typeof getEarnInstruments>,
    passiveRewardsBalancesR: ReturnType<typeof getPassiveRewardsAccountBalance>,
    stakingBalancesR: ReturnType<typeof getStakingAccountBalance>,
    isStakingEnabledR: ReturnType<typeof getIsStakingEnabled>,
    activeRewardsBalancesR: ReturnType<typeof getStakingAccountBalance>,
    isActiveRewardsEnabledR: ReturnType<typeof getIsStakingEnabled>,
    allRatesR: ReturnType<typeof getAllRates>,
    walletCurrencyR: ReturnType<typeof getWalletCurrency>,
    earnTab: ReturnType<typeof getEarnTab>,
    searchValue: ReturnType<typeof getSearchValue>,
    showAvailableAssets: ReturnType<typeof getShowAvailableAssets>
  ) => {
    const transform = (
      instruments: ExtractSuccess<typeof instrumentsR>,
      passiveRewardsBalances: ExtractSuccess<typeof passiveRewardsBalancesR>,
      stakingBalances: ExtractSuccess<typeof stakingBalancesR>,
      isStakingEnabled: ExtractSuccess<typeof isStakingEnabledR>,
      activeRewardsBalances: ExtractSuccess<typeof activeRewardsBalancesR>,
      isActiveRewardsEnabled: ExtractSuccess<typeof isActiveRewardsEnabledR>,
      allRates: ExtractSuccess<typeof allRatesR>,
      walletCurrency: ExtractSuccess<typeof walletCurrencyR>
    ) => {
      if (isEmpty(instruments)) return []

      const mapBalancesToPreferredCoins = (
        balances: EarnAccountBalanceResponseType,
        preferredCoins: EarnInstrumentsType,
        product: EarnProductsType
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

      let preferredPassiveRewardsCoins: EarnInstrumentsType = [
        { coin: 'BTC', product: 'Passive', rate: allRates[`BTC-${walletCurrency}`] },
        { coin: 'ETH', product: 'Passive', rate: allRates[`ETH-${walletCurrency}`] },
        { coin: 'USDT', product: 'Passive', rate: allRates[`USDT-${walletCurrency}`] },
        { coin: 'USDC', product: 'Passive', rate: allRates[`USDC-${walletCurrency}`] }
      ]
      let preferredStakingCoins: EarnInstrumentsType = [
        { coin: 'ETH', product: 'Staking', rate: allRates[`ETH-${walletCurrency}`] }
      ]
      let preferredActiveRewardsCoins: EarnInstrumentsType = [
        { coin: 'BTC', product: 'Active', rate: allRates[`BTC-${walletCurrency}`] }
      ]

      const stakingInstruments = instruments.filter(({ product }) => product === 'Staking')
      const activeRewardsInstruments = instruments.filter(({ product }) => product === 'Active')

      const rewardsInstruments = instruments.filter(({ product }) => product === 'Passive')

      preferredActiveRewardsCoins = mapBalancesToPreferredCoins(
        activeRewardsBalances,
        preferredActiveRewardsCoins,
        'Active'
      )

      preferredStakingCoins = mapBalancesToPreferredCoins(
        stakingBalances,
        preferredStakingCoins,
        'Staking'
      )

      preferredPassiveRewardsCoins = mapBalancesToPreferredCoins(
        passiveRewardsBalances,
        preferredPassiveRewardsCoins,
        'Passive'
      )

      preferredActiveRewardsCoins.forEach(({ coin }) => {
        const coinIndex: number = activeRewardsInstruments.findIndex(
          (instrument) => instrument.coin === coin
        )
        if (coinIndex !== -1) {
          activeRewardsInstruments.splice(coinIndex, 1)
        }
      })

      preferredStakingCoins.forEach(({ coin }) => {
        const coinIndex: number = stakingInstruments.findIndex(
          (instrument) => instrument.coin === coin
        )
        if (coinIndex !== -1) {
          stakingInstruments.splice(coinIndex, 1)
        }
      })

      preferredPassiveRewardsCoins.forEach(({ coin }) => {
        const coinIndex: number = rewardsInstruments.findIndex(
          (instrument) => instrument.coin === coin
        )
        if (coinIndex !== -1) {
          rewardsInstruments.splice(coinIndex, 1)
        }
      })

      let sortedInstruments = [...preferredPassiveRewardsCoins, ...rewardsInstruments]

      if (isStakingEnabled) {
        sortedInstruments = [...preferredStakingCoins, ...stakingInstruments, ...sortedInstruments]
      }

      if (isActiveRewardsEnabled) {
        sortedInstruments = [
          ...preferredActiveRewardsCoins,
          ...activeRewardsInstruments,
          ...sortedInstruments
        ]
      }

      sortedInstruments = sortedInstruments.filter(({ coin, product }) => {
        switch (earnTab) {
          case 'Passive':
            if (earnTab !== product) return false
            break
          case 'Staking':
            if (earnTab !== product) return false
            break
          case 'Active':
            if (earnTab !== product) return false
            break

          case 'All':
          default:
            break
        }

        if (showAvailableAssets) {
          let account

          switch (product) {
            case 'Staking':
              account = stakingBalances && stakingBalances[coin]
              break
            case 'Active':
              account = activeRewardsBalances && activeRewardsBalances[coin]
              break
            case 'Passive':
            default:
              account = passiveRewardsBalances && passiveRewardsBalances[coin]
              break
          }
          const accountBalanceBase = account ? account.balance : 0
          const hasAccountBalance = accountBalanceBase > 0

          if (!hasAccountBalance) return false
        }

        const coins = selectors.core.data.coins.getCoins()

        const coinfig = coins[coin]?.coinfig

        if (coinfig) {
          const { displaySymbol, name, symbol } = coinfig
          const containsSearchValue = [displaySymbol, name, symbol].some((value) =>
            value.toLowerCase().includes(searchValue.toLowerCase())
          )

          if (!containsSearchValue) return false
        }

        return coinfig
      })

      return sortedInstruments
    }

    return lift(transform)(
      instrumentsR,
      passiveRewardsBalancesR,
      stakingBalancesR,
      isStakingEnabledR,
      activeRewardsBalancesR,
      isActiveRewardsEnabledR,
      allRatesR,
      walletCurrencyR
    )
  }
)

export const getInterestLimits = (state: RootState) => state.components.interest.interestLimits

export const getStakingLimits = (state: RootState) => state.components.interest.stakingLimits

export const getActiveRewardsLimits = (state: RootState) =>
  state.components.interest.activeRewardsLimits

export const getRewardsAccount = (state: RootState) => state.components.interest.rewardsAccount

export const getStakingAccount = (state: RootState) => state.components.interest.stakingAccount

export const getActiveRewardsAccount = (state: RootState) =>
  state.components.interest.activeRewardsAccount

export const getRewardsDepositAddress = (state: RootState) => {
  const account = getRewardsAccount(state).getOrElse({ accountRef: '' })
  return account.accountRef
}

export const getStakingDepositAddress = (state: RootState) => {
  const account = getStakingAccount(state).getOrElse({ accountRef: '' })
  return account.accountRef
}

export const getActiveRewardsDepositAddress = (state: RootState) => {
  const account = getActiveRewardsAccount(state).getOrElse({ accountRef: '' })
  return account.accountRef
}

export const getInterestRates = (state: RootState) => state.components.interest.interestRates

export const getStakingRates = (state: RootState) => state.components.interest.stakingRates

export const getActiveRewardsRates = (state: RootState) =>
  state.components.interest.activeRewardsRates

export const getInterestTransactionsReport = (state: RootState) =>
  state.components.interest.transactionsReport

export const getEarnTransactions = (state: RootState) => state.components.interest.transactions

export const getPendingActiveRewardsTransactions = (state: RootState) =>
  state.components.interest.pendingActiveRewardsTransactions

export const getPendingStakingTransactions = (state: RootState) =>
  state.components.interest.pendingStakingTransactions

export const getTotalActiveRewardsBondingDeposits = (state: RootState) =>
  state.components.interest.totalActiveRewardsBondingDeposits

export const getTotalStakingBondingDeposits = (state: RootState) =>
  state.components.interest.totalStakingBondingDeposits

export const getStakingWithdrawals = (state: RootState) =>
  state.components.interest.stakingWithdrawals

export const getEarnDepositLimits = (state: RootState) =>
  state.components.interest.earnDepositLimits

export const getPayment = (state: RootState) => state.components.interest.payment

export const getRates = (state: RootState): RemoteDataType<string, RatesType> => {
  const coinType = getCoinType(state)

  return selectors.core.data.misc.getRatesSelector(coinType, state)
}

export const getRewardsStep = (state: RootState) => state.components.interest.rewardsStep

export const getStakingStep = (state: RootState) => state.components.interest.stakingStep

export const getActiveRewardsStep = (state: RootState) =>
  state.components.interest.activeRewardsStep

export const getRewardsTransactionsNextPage = (state: RootState) =>
  state.components.interest.rewardsTransactionsNextPage

export const getStakingTransactionsNextPage = (state: RootState) =>
  state.components.interest.stakingTransactionsNextPage

export const getActiveRewardsTransactionsNextPage = (state: RootState) =>
  state.components.interest.activeRewardsTransactionsNextPage

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
