import BigNumber from 'bignumber.js'
import { lift, mapObjIndexed, uniq, values } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'

export const getData = (state) => {
  const unifiedBalancesR = selectors.core.data.coins.getUnifiedBalances(state)

  const transform = (unifiedBalances: ExtractSuccess<typeof unifiedBalancesR>) => {
    const coinsInUnifiedBalances = uniq(unifiedBalances.map(({ ticker }) => ticker))
    const balancesArray = []
    coinsInUnifiedBalances.forEach((coin) => {
      const eachCoinBalance = selectors.balances
        .getCoinNonCustodialBalance(coin)(state)
        .getOrElse(0)
      const individualCoinBalance = { balance: new BigNumber(eachCoinBalance).toNumber(), coin }

      // @ts-ignore
      balancesArray.push(individualCoinBalance)

      return balancesArray
    })
    // console.log(balancesArray, 'balances array')
  }
  return lift(transform)(unifiedBalancesR)
}
