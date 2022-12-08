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

export const getEarnTab = (state: RootState) => state.components.interest.earnTab
export const getShowAvailableAssets = (state: RootState) =>
  state.components.interest.showAvailableAssets
export const getSearchValue = (state: RootState) => state.components.interest.searchValue

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
  getEarnTab,
  getSearchValue,
  getShowAvailableAssets,
  (
    instrumentsR: ReturnType<typeof getEarnInstruments>,
    rewardsBalancesR: ReturnType<typeof getRewardsAccountBalance>,
    stakingBalancesR: ReturnType<typeof getStakingAccountBalance>,
    isStakingEnabledR: ReturnType<typeof getIsStakingEnabled>,
    allRatesR: ReturnType<typeof getAllRates>,
    walletCurrencyR: ReturnType<typeof getWalletCurrency>,
    earnTab: ReturnType<typeof getEarnTab>,
    searchValue: ReturnType<typeof getSearchValue>,
    showAvailableAssets: ReturnType<typeof getShowAvailableAssets>
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

      let preferredRewardsCoins: EarnInstrumentsType = [
        { coin: 'BTC', product: 'Passive', rate: allRates[`BTC-${walletCurrency}`] },
        { coin: 'ETH', product: 'Passive', rate: allRates[`ETH-${walletCurrency}`] },
        { coin: 'USDT', product: 'Passive', rate: allRates[`USDT-${walletCurrency}`] },
        { coin: 'USDC', product: 'Passive', rate: allRates[`USDC-${walletCurrency}`] }
      ]
      let preferredStakingCoins: EarnInstrumentsType = [
        { coin: 'ETH', product: 'Staking', rate: allRates[`ETH-${walletCurrency}`] }
      ]

      const stakingInstruments = instruments.filter(({ product }) => product === 'Staking')

      const rewardsInstruments = instruments.filter(({ product }) => product === 'Passive')

      preferredStakingCoins = mapBalancesToPreferredCoins(
        stakingBalances,
        preferredStakingCoins,
        'Staking'
      )

      preferredRewardsCoins = mapBalancesToPreferredCoins(
        rewardsBalances,
        preferredRewardsCoins,
        'Passive'
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

      const sortedInstruments = [
        ...preferredStakingCoins,
        ...stakingInstruments,
        ...preferredRewardsCoins,
        ...rewardsInstruments
      ].filter(({ coin, product }) => {
        switch (earnTab) {
          case 'Passive':
            if (product !== earnTab) return false
            break
          case 'Staking':
            if (product !== earnTab) return false
            break
          case 'Active':
            if (product !== earnTab) return false
            break

          case 'All':
          default:
            break
        }

        if (showAvailableAssets) {
          const isStaking = product === 'Staking'
          const account = isStaking
            ? stakingBalances && stakingBalances[coin]
            : rewardsBalances && rewardsBalances[coin]
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
