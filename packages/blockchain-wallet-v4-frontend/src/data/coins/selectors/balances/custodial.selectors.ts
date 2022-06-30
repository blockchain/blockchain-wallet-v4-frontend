import BigNumber from 'bignumber.js'

import { Remote } from '@core'
import { BSBalancesType, CoinType, InterestAccountBalanceType, RemoteDataType } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'
import { PartialClientErrorProperties } from 'data/analytics/types/errors'
import { DEFAULT_BS_BALANCE } from 'data/components/buySell/model'
import { RootState } from 'data/rootReducer'

// gets a coins trading account balance
const getCoinTradingBalance = (coin: CoinType, state) => {
  return selectors.components.buySell.getBSBalances(state).map((x) => x[coin])
}

// gets a coins interest account balance
const getCoinInterestBalance = (coin: CoinType, state) => {
  return selectors.components.interest.getInterestAccountBalance(state).map((x) => x[coin])
}

// gets a coins custodial balance
const getCoinCustodialBalance = (
  coin: string
): ((state: RootState) => RemoteDataType<string, number>) =>
  createDeepEqualSelector(
    [
      selectors.components.buySell.getBSBalances,
      selectors.components.interest.getInterestAccountBalance
    ],
    (
      sbBalancesR: RemoteDataType<PartialClientErrorProperties, BSBalancesType>,
      interestAccountBalanceR: RemoteDataType<string, InterestAccountBalanceType>
    ) => {
      const sbCoinBalance = sbBalancesR.getOrElse({
        [coin]: DEFAULT_BS_BALANCE
      })[coin]
      const interestCoinBalance = interestAccountBalanceR.getOrElse({
        [coin]: { balance: '0' } as InterestAccountBalanceType[typeof coin]
      })[coin]
      const sbBalance = sbCoinBalance ? sbCoinBalance.available : '0'
      const interestBalance = interestCoinBalance ? interestCoinBalance.balance : '0'

      return Remote.of(new BigNumber(sbBalance).plus(new BigNumber(interestBalance)).toNumber())
    }
  )

export { getCoinCustodialBalance, getCoinInterestBalance, getCoinTradingBalance }
